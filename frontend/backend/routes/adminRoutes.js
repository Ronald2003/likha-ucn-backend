const express = require('express')
const db = require('../config/db')
const { verifyToken, isAdmin } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/pending-sellers', verifyToken, isAdmin, async (req, res) => {
  try {
    const result = await db.query("SELECT s.*, u.name, u.email, u.phone FROM seller_profiles s JOIN users u ON s.user_id = u.id WHERE s.verification_status = 'pending'")
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/pending-products', verifyToken, isAdmin, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, s.store_name 
      FROM products p 
      JOIN seller_profiles s ON p.seller_id = s.user_id 
      WHERE p.status = 'pending'
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/pending-names', verifyToken, isAdmin, async (req, res) => {
  try {
    const result = await db.query('SELECT user_id, store_name, pending_store_name FROM seller_profiles WHERE pending_store_name IS NOT NULL')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/approve-seller/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await db.query('BEGIN')
    await db.query("UPDATE seller_profiles SET verification_status = 'approved' WHERE user_id = $1", [req.params.id])
    await db.query("UPDATE users SET role = 'seller' WHERE id = $1", [req.params.id])
    await db.query('INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3)', [req.params.id, 'Account Approved', 'Your seller account has been approved!'])
    await db.query('COMMIT')
    res.json({ message: 'Seller approved' })
  } catch (err) {
    await db.query('ROLLBACK')
    res.status(400).json({ error: err.message })
  }
})

router.put('/approve-product/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await db.query(
      "UPDATE products SET status = 'approved' WHERE id = $1",
      [req.params.id]
    )
    const prodResult = await db.query('SELECT seller_id FROM products WHERE id = $1', [req.params.id]);
    if (prodResult.rows[0]) await db.query('INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3)', [prodResult.rows[0].seller_id, 'Product Approved', 'Your product has been approved and is now live.']);
    res.json({ message: 'Product approved' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/approve-name/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const result = await db.query('SELECT pending_store_name FROM seller_profiles WHERE user_id = $1', [req.params.id])
    const row = result.rows[0]
    
    if (!row || !row.pending_store_name) return res.status(400).json({ error: 'No pending name found' })
    
    await db.query('UPDATE seller_profiles SET store_name = $1, pending_store_name = NULL WHERE user_id = $2', [row.pending_store_name, req.params.id])
    await db.query('INSERT INTO notifications (user_id, title, message) VALUES ($1, $2, $3)', [req.params.id, 'Name Change Approved', 'Your new store name has been approved.']);
    res.json({ message: 'Name approved' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/reject-name/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await db.query('UPDATE seller_profiles SET pending_store_name = NULL WHERE user_id = $1', [req.params.id])
    res.json({ message: 'Name rejected' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router