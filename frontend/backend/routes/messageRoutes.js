const express = require('express')
const db = require('../config/db')
const { verifyToken } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', verifyToken, async (req, res) => {
  const { receiverId, content } = req.body
  const senderId = req.user.id

  try {
    const result = await db.query(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING id',
      [senderId, receiverId, content]
    )
    res.json({ message: 'Message sent', messageId: result.rows[0].id })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/conversations', verifyToken, async (req, res) => {
  const userId = req.user.id
  try {
    const result = await db.query(`
      SELECT DISTINCT
          CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END as contact_id,
          u.email as contact_email,
          u.name as name,
          u.role as role,
          u.profile_image_url,
          sp.store_name as store_name,
          sp.logo_url
      FROM messages m
      JOIN users u ON u.id = CASE WHEN m.sender_id = $2 THEN m.receiver_id ELSE m.sender_id END
      LEFT JOIN seller_profiles sp ON u.id = sp.user_id
      WHERE m.sender_id = $3 OR m.receiver_id = $4
    `, [userId, userId, userId, userId])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/unread-count', verifyToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT COUNT(*) as count FROM messages WHERE receiver_id = $1 AND is_read = FALSE',
      [req.user.id]
    )
    res.json({ count: parseInt(result.rows[0].count) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:contactId', verifyToken, async (req, res) => {
  const userId = req.user.id
  const contactId = req.params.contactId

  try {
    const result = await db.query(`
      SELECT * FROM messages 
      WHERE (sender_id = $1 AND receiver_id = $2) 
         OR (sender_id = $3 AND receiver_id = $4)
      ORDER BY created_at ASC
    `, [userId, contactId, contactId, userId])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})



router.put('/mark-read/:contactId', verifyToken, async (req, res) => {
  try {
    await db.query(
      'UPDATE messages SET is_read = TRUE WHERE receiver_id = $1 AND sender_id = $2 AND is_read = FALSE',
      [req.user.id, req.params.contactId]
    )
    res.json({ message: 'Marked as read' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
