const express = require('express')
const db = require('../config/db')
const { verifyToken } = require('../middleware/authMiddleware')
const router = express.Router()

router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/read-all', verifyToken, async (req, res) => {
  try {
    await db.query('UPDATE notifications SET is_read = 1 WHERE user_id = $1', [req.user.id])
    res.json({ message: 'All notifications marked as read' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router