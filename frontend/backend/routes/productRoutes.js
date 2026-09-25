const upload = require('../config/upload');
const express = require('express')
const path = require('path')
const db = require('../config/db')
const { verifyToken, isSeller } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', verifyToken, isSeller, upload.single('image'), async (req, res) => {
  const { name, price, description, category, stock, location, specific_address } = req.body
  const imageUrl = req.file ? (req.file.path && req.file.path.startsWith('http') ? req.file.path : `/uploads/${req.file.filename}`) : null

  try {
    const result = await db.query(
      'INSERT INTO products (seller_id, name, price, description, category, stock, location, specific_address, image_url, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
      [req.user.id, name, price, description, category, stock, location, specific_address, imageUrl, 'pending']
    )
    res.json({ message: 'Product submitted', productId: result.rows[0].id })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:id', verifyToken, isSeller, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error("Multer upload error in routes/productRoutes.js:", err);
      return res.status(400).json({ error: "Image upload failed: " + err.message });
    }
    next();
  });
}, async (req, res) => {
  const { name, price, description, category, stock, location, specific_address } = req.body
  
  try {
    if (req.file) {
      await db.query(
        'UPDATE products SET name=$1, price=$2, description=$3, category=$4, stock=$5, location=$6, specific_address=$7, image_url=$8, status=$9 WHERE id=$10 AND seller_id=$11',
        [name, price, description, category, stock, location, specific_address, (req.file.path && req.file.path.startsWith('http') ? req.file.path : `/uploads/${req.file.filename}`), 'pending', req.params.id, req.user.id]
      )
    } else {
      await db.query(
        'UPDATE products SET name=$1, price=$2, description=$3, category=$4, stock=$5, location=$6, specific_address=$7, status=$8 WHERE id=$9 AND seller_id=$10',
        [name, price, description, category, stock, location, specific_address, 'pending', req.params.id, req.user.id]
      )
    }
    res.json({ message: 'Product updated and pending approval' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:id/stock', verifyToken, isSeller, async (req, res) => {
  try {
    await db.query('UPDATE products SET stock=$1 WHERE id=$2 AND seller_id=$3', [req.body.stock, req.params.id, req.user.id])
    res.json({ message: 'Stock updated' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/public', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, s.store_name as seller,
      (SELECT AVG(rating) FROM reviews WHERE product_id = p.id) as rating,
      (SELECT COUNT(*) FROM reviews WHERE product_id = p.id) as review_count
      FROM products p
      JOIN seller_profiles s ON p.seller_id = s.user_id
      WHERE p.status = 'approved'
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/seller', verifyToken, isSeller, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products WHERE seller_id = $1', [req.user.id])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  const productId = req.params.id
  try {
    const prodResult = await db.query(`
      SELECT p.*, s.store_name as seller, s.user_id as seller_id, s.profile_image_url as seller_image,
      (SELECT AVG(rating) FROM reviews WHERE product_id = p.id) as rating,
      (SELECT COUNT(*) FROM reviews WHERE product_id = p.id) as review_count
      FROM products p
      JOIN seller_profiles s ON p.seller_id = s.user_id
      WHERE p.id = $1 AND p.status = 'approved'
    `, [productId])

    const product = prodResult.rows[0]
    if (!product) return res.status(404).json({ message: 'Product not found' })

    const simResult = await db.query('SELECT * FROM products WHERE category = $1 AND id != $2 AND status = \'approved\' LIMIT 4', [product.category, productId])
    const similarProducts = simResult.rows

    const statsResult = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM products WHERE seller_id = $1 AND status = 'approved') as total_products,
        (SELECT AVG(r.rating) FROM reviews r JOIN products pr ON r.product_id = pr.id WHERE pr.seller_id = $2) as avg_seller_rating
    `, [product.seller_id, product.seller_id])
    const stats = statsResult.rows[0]

    const reviewsResult = await db.query(`
      SELECT r.*, u.name as buyer_name, u.email as buyer_email 
      FROM reviews r 
      LEFT JOIN users u ON r.buyer_id = u.id 
      WHERE r.product_id = $1 
      ORDER BY r.created_at DESC
    `, [productId])
    const reviews = reviewsResult.rows

    res.json({
      reviews,
      product,
      similarProducts,
      sellerStats: { 
        total_products: stats.total_products || 0,
        rating: stats.avg_seller_rating ? Number(stats.avg_seller_rating).toFixed(1) : 'New',
        responseRate: '98%'
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router