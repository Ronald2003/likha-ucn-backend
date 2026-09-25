const upload = require('../config/upload');
const express = require('express')
const bcrypt = require('bcryptjs')
const path = require('path')
const db = require('../config/db')
const { verifyToken } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/admin', async (req, res) => {
  try {
    const result = await db.query("SELECT id, name, email FROM users WHERE role = 'admin' LIMIT 1");
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Helper function for PostgreSQL
const runSafeQuery = async (query, params = []) => {
  try {
    const res = await db.query(query, params)
    return res.rows
  } catch (err) {
    return []
  }
}

router.get('/me', verifyToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, role, name, phone, profile_image_url FROM users WHERE id = $1', 
      [req.user.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/profile', verifyToken, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error("Multer upload error in routes/userRoutes.js:", err);
      return res.status(400).json({ error: "Image upload failed: " + err.message });
    }
    next();
  });
}, async (req, res) => {
  const { name, email, phone, password } = req.body
  
  let query = 'UPDATE users SET name = $1, email = $2, phone = $3'
  let params = [name, email, phone]
  let paramIndex = 4

  if (password) {
    query += `, password_hash = $${paramIndex}`
    params.push(bcrypt.hashSync(password, 10)) 
    paramIndex++
  }

  if (req.file) {
    query += `, profile_image_url = $${paramIndex}`
    params.push((req.file.path && req.file.path.startsWith('http') ? req.file.path : `/uploads/${req.file.filename}`))
    paramIndex++
  }

  query += ` WHERE id = $${paramIndex}`
  params.push(req.user.id)

  try {
    await db.query(query, params)
    res.json({ message: 'Profile updated' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/all', async (req, res) => {
  try {
    const usersResult = await db.query("SELECT id, email, role, name, phone, profile_image_url FROM users")
    const users = usersResult.rows
    
    const profiles = await runSafeQuery("SELECT * FROM seller_profiles")
    const reviews = await runSafeQuery("SELECT p.seller_id, AVG(r.rating) as avg_rating, COUNT(r.id) as count FROM reviews r JOIN products p ON r.product_id = p.id GROUP BY p.seller_id")
    
    const results = users.map(u => {
      const profile = profiles.find(p => p.user_id === u.id) || {}
      const reviewStats = reviews.find(r => r.seller_id === u.id) || { avg_rating: 0, count: 0 }
      
      return {
        ...u,
        store_name: profile.store_name,
        logo_url: profile.logo_url,
        description: profile.description,
        rating: reviewStats.count > 0 ? Number(reviewStats.avg_rating).toFixed(1) : '0.0',
        review_count: reviewStats.count
      }
    })
    res.json(results)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/admin/user/:id', async (req, res) => {
  const userId = String(req.params.id)
  
  try {
    const userResult = await db.query("SELECT id, email, role, name, phone, profile_image_url FROM users WHERE id = $1", [userId])
    const user = userResult.rows[0]

    if (!user) return res.status(404).json({ error: 'User not found' })

    const data = { 
      user: user,
      stats: {
        total_sales: 0,
        products_listed: 0,
        overall_rating: '0.0',
        total_reviews: 0,
        total_orders: 0,
        total_purchases: 0
      }, 
      products: [], 
      purchases: [], 
      reviews: [] 
    }

    const profilesResult = await db.query("SELECT * FROM seller_profiles WHERE user_id = $1", [userId])
    const myProfile = profilesResult.rows[0]
    
    if (myProfile) {
      data.user.store_name = myProfile.store_name
      data.user.logo_url = myProfile.profile_image_url || myProfile.logo_url
      data.user.description = myProfile.description
    }

    if (user.role === 'seller') {
      const productsResult = await db.query("SELECT * FROM products WHERE seller_id = $1", [userId])
      data.products = productsResult.rows
      data.stats.products_listed = data.products.length

      const sellerOrdersResult = await db.query(`
        SELECT o.id as order_id, oi.status, oi.quantity, oi.price, p.name
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN products p ON oi.product_id = p.id
        WHERE oi.seller_id = $1
      `, [userId])
      
      const sellerOrders = sellerOrdersResult.rows
      let totalSales = 0
      sellerOrders.forEach(o => {
        if (o.status === 'completed') {
           totalSales += (Number(o.price) * Number(o.quantity))
        }
      })
      data.stats.total_sales = totalSales

      const sellerReviewsResult = await db.query(`
        SELECT r.* 
        FROM reviews r
        JOIN products p ON r.product_id = p.id
        WHERE p.seller_id = $1
      `, [userId])
      
      data.reviews = sellerReviewsResult.rows
      data.stats.total_reviews = data.reviews.length
      if (data.reviews.length > 0) {
        const sum = data.reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0)
        data.stats.overall_rating = (sum / data.reviews.length).toFixed(1)
      }
      
    } else {
      const buyerOrdersResult = await db.query(`
        SELECT o.id as order_id, oi.status, oi.quantity, oi.price, p.name as product_name, p.image_url, s.store_name as seller_store
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        JOIN products p ON oi.product_id = p.id
        LEFT JOIN seller_profiles s ON p.seller_id = s.user_id
        WHERE o.buyer_id = $1
      `, [userId])
      
      const buyerOrders = buyerOrdersResult.rows
      let totalPurchases = 0
      data.purchases = buyerOrders.map(o => {
        const price = Number(o.price || 0)
        const qty = Number(o.quantity || 1)
        if (o.status === 'completed') {
            totalPurchases += (price * qty)
        }
        return {
          ...o,
          price: price,
          quantity: qty,
          status: o.status || 'Pending'
        }
      })
      
      data.stats.total_orders = data.purchases.length
      data.stats.total_purchases = totalPurchases

      const buyerReviewsResult = await db.query("SELECT * FROM reviews WHERE buyer_id = $1", [userId])
      data.reviews = buyerReviewsResult.rows
      data.stats.total_reviews = data.reviews.length
    }

    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router