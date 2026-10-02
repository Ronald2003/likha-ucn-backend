const express = require('express')
const db = require('../config/db')
const { verifyToken, isAdmin } = require('../middleware/authMiddleware')
const upload = require('../config/upload')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY name ASC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const result = await db.query('INSERT INTO categories (name) VALUES ($1) RETURNING id', [req.body.name])
    res.json({ id: result.rows[0].id, name: req.body.name })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:id/image', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' })
    const imageUrl = req.file.path
    await db.query('UPDATE categories SET image_url = $1 WHERE id = $2', [imageUrl, req.params.id])
    res.json({ message: 'Category image updated', imageUrl })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM categories WHERE id = $1', [req.params.id])
    res.json({ message: 'Category deleted' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
