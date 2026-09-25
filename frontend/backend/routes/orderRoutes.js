const express = require('express')
const db = require('../config/db')
const { verifyToken, isSeller } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', verifyToken, async (req, res) => {
  const { cart, paymentMethod, address, phone } = req.body
  const buyerId = req.user.id
  
  const client = await db.connect()

  try {
    await client.query('BEGIN')

    let amount = 0;
    // Security Fix: Fetch prices from DB instead of trusting client
    for (let i = 0; i < cart.length; i++) {
      const stockResult = await client.query('SELECT stock, price FROM products WHERE id = $1', [cart[i].id])
      const product = stockResult.rows[0]
      if (!product || product.stock < cart[i].quantity) {
        throw new Error(`Insufficient stock for product ID: ${cart[i].id}`)
      }
      cart[i].price = product.price;
      amount += (product.price * cart[i].quantity);
    }

    const orderResult = await client.query(
      'INSERT INTO orders (buyer_id, status, payment_status, payment_method) VALUES ($1, $2, $3, $4) RETURNING id',
        [buyerId, 'pending', 'unpaid', paymentMethod]
    )
    const orderId = orderResult.rows[0].id
    
    for (const item of cart) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, seller_id, quantity, price) VALUES ($1, $2, $3, $4, $5)',
        [orderId, item.id, item.seller_id, item.quantity, item.price]
      )
      
      if (paymentMethod !== 'qrph' && paymentMethod !== 'bank') {
        await client.query(
          'UPDATE products SET stock = stock - $1 WHERE id = $2',
          [item.quantity, item.id]
        )
      }
      // Add Seller Notification
      await client.query(
        'INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3)',
        [item.seller_id, 'New Order Received', `You have a new order (${item.quantity}x) for product ID ${item.id}.`]
      )
    }

    if (paymentMethod === 'qrph' || paymentMethod === 'bank') {
      const encodedKey = Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')
      const paymongoRes = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: `Basic ${encodedKey}`
        },
        body: JSON.stringify({
          data: {
            attributes: {
              payment_method_types: paymentMethod === 'bank' ? ['paymaya', 'gcash', 'card'] : ['qrph'],
              success_url: `${req.headers.origin || 'http://localhost:5173'}/?payment=success&order_id=${orderId}`,
              cancel_url: `${req.headers.origin || 'http://localhost:5173'}/?payment=cancelled`,
              line_items: [{ currency: 'PHP', amount: amount * 100, name: 'Likha UCN Market Hub Order', quantity: 1 }]
            }
          }
        })
      })
      const paymongoData = await paymongoRes.json()
      
      if (paymongoData.errors) {
        throw new Error('Invalid PayMongo Test Key')
      }
      
      await client.query('INSERT INTO payments (order_id, paymongo_reference, status) VALUES ($1, $2, $3)', [orderId, paymongoData.data.id, 'pending'])
      await client.query('COMMIT')
      return res.json({ message: 'Order placed successfully', orderId, checkoutUrl: paymongoData.data.attributes.checkout_url })
    } else {
      await client.query('INSERT INTO payments (order_id, paymongo_reference, status) VALUES ($1, $2, $3)', [orderId, 'manual', 'pending'])
      await client.query('COMMIT')
      return res.json({ message: 'Order placed successfully', orderId, checkoutUrl: null })
    }
  } catch (err) {
    await client.query('ROLLBACK')
    res.status(400).json({ error: err.message })
  } finally {
    client.release()
  }
})

router.put('/:id/paid', verifyToken, async (req, res) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')
    const orderResult = await client.query('SELECT payment_status, payment_method FROM orders WHERE id = $1', [req.params.id])
    if (orderResult.rows.length === 0) {
       await client.query('ROLLBACK')
       return res.status(404).json({ error: 'Order not found' })
    }
    const order = orderResult.rows[0]

    if (order.payment_status === 'paid') {
      await client.query('ROLLBACK')
      return res.json({ message: 'Already paid' })
    }

    // Update payment status
    await client.query("UPDATE orders SET payment_status = 'paid' WHERE id = $1", [req.params.id])
    await client.query("UPDATE payments SET status = 'paid' WHERE order_id = $1", [req.params.id])
    
    const itemsResult = await client.query('SELECT product_id, quantity FROM order_items WHERE order_id = $1', [req.params.id])
    
    // Deduct stock only if QRPH (since others deducted at creation)
    if (order.payment_method === 'qrph' || order.payment_method === 'bank') {
      for (const item of itemsResult.rows) {
        await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.product_id])
      }
    }
    
    await client.query('COMMIT')
    res.json({ message: 'Payment status updated to paid and stock deducted', productIds: itemsResult.rows.map(r => r.product_id) })
  } catch (err) {
    await client.query('ROLLBACK')
    res.status(400).json({ error: err.message })
  } finally {
    client.release()
  }
})

router.get('/buyer', verifyToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        oi.id, 
        o.id as order_id, 
        oi.status, 
        o.payment_status, 
          o.payment_method, 
          o.created_at, 
          oi.ready_at, 
          oi.completed_at, 
          (oi.price * oi.quantity) as total_amount, 
        oi.price,
        oi.quantity,
        oi.product_id,
        p.name as product_name,
        p.image_url as image_url,
          p.stock as current_stock,
        s.store_name as store_name,
        s.user_id as seller_id,
        (SELECT COUNT(*) FROM reviews WHERE order_id = o.id AND product_id = oi.product_id) as has_reviewed
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      JOIN seller_profiles s ON p.seller_id = s.user_id
      WHERE o.buyer_id = $1
      ORDER BY oi.id DESC
    `, [req.user.id])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/seller', verifyToken, isSeller, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT oi.id as order_item_id, o.id as order_id, oi.status, o.payment_status, o.payment_method, o.created_at, oi.quantity, oi.price, p.name, p.image_url, u.name as buyer_name, u.email as buyer_email, u.phone as buyer_phone
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      JOIN users u ON o.buyer_id = u.id
      WHERE oi.seller_id = $1
      ORDER BY o.id DESC
    `, [req.user.id])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:id/status', verifyToken, async (req, res) => {
  const { status } = req.body
  try {
    const itemResult = await db.query('SELECT order_id, seller_id FROM order_items WHERE id = $1', [req.params.id])
    const item = itemResult.rows[0]
    
    if (!item) return res.status(404).json({ error: 'Order item not found' })

    if (item.seller_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to update this item' })
    }

    await db.query('UPDATE order_items SET status = $1 WHERE id = $2', [status, req.params.id])
    if (status === 'ready for pickup') {
      await db.query('UPDATE order_items SET ready_at = CURRENT_TIMESTAMP WHERE id = $1', [req.params.id])
    } else if (status === 'completed') {
      await db.query('UPDATE order_items SET completed_at = CURRENT_TIMESTAMP WHERE id = $1', [req.params.id])
    }
    
    const orderResult = await db.query('SELECT buyer_id FROM orders WHERE id = $1', [item.order_id])
    const order = orderResult.rows[0]
    
    if (order) {
      await db.query(
        'INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3)', 
        [order.buyer_id, 'Order Update', `An item in your order #${item.order_id} is now ${status.toUpperCase()}.`]
      )
    }
    
    // Check if all items are completed to update the parent order status
    const allItemsResult = await db.query("SELECT status FROM order_items WHERE order_id = $1", [item.order_id])
    const allCompleted = allItemsResult.rows.every(row => row.status === 'completed')
    if (allCompleted) {
       await db.query("UPDATE orders SET status = 'completed', payment_status = 'paid' WHERE id = $1", [item.order_id])
    } else {
       await db.query("UPDATE orders SET status = 'processing' WHERE id = $1", [item.order_id])
    }
    
    res.json({ message: 'Order item status updated' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:id/mark-paid', verifyToken, isSeller, async (req, res) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')
    const orderResult = await client.query('SELECT payment_status, payment_method FROM orders WHERE id = $1', [req.params.id])
    if (orderResult.rows.length === 0) {
       await client.query('ROLLBACK')
       return res.status(404).json({ error: 'Order not found' })
    }
    const order = orderResult.rows[0]

    if (order.payment_status === 'paid') {
      await client.query('ROLLBACK')
      return res.json({ message: 'Already paid' })
    }

    await client.query("UPDATE orders SET payment_status = 'paid' WHERE id = $1", [req.params.id])
    await client.query("UPDATE payments SET status = 'paid' WHERE order_id = $1", [req.params.id])

    // If it was QRPH, stock wasn't deducted at creation, so deduct it now
    if (order.payment_method === 'qrph' || order.payment_method === 'bank') {
      const itemsResult = await client.query('SELECT product_id, quantity FROM order_items WHERE order_id = $1', [req.params.id])
      for (const item of itemsResult.rows) {
        await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.product_id])
      }
    }

    await client.query('COMMIT')
    res.json({ message: 'Order marked as paid' })
  } catch (err) {
    await client.query('ROLLBACK')
    res.status(400).json({ error: err.message })
  } finally {
    client.release()
  }
})

module.exports = router
