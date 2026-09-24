const express = require('express')
const db = require('../config/db')
const { verifyToken } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', verifyToken, async (req, res) => {
  const { orderId, productId, rating, comment } = req.body
  const buyerId = req.user.id

  try {
    await db.query(
      'INSERT INTO reviews (order_id, product_id, buyer_id, rating, comment) VALUES ($1, $2, $3, $4, $5)',
      [orderId, productId, buyerId, rating, comment]
    )
    res.json({ message: 'Review submitted successfully' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router