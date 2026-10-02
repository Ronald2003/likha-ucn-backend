const express = require('express')
const db = require('../config/db')
const { verifyToken, isAdmin } = require('../middleware/authMiddleware')
const upload = require('../config/upload')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM site_settings')
    const settings = {}
    result.rows.forEach(r => settings[r.setting_key] = r.setting_value)
    res.json(settings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/hero', verifyToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' })
    const imageUrl = req.file.path
    await db.query(
      "INSERT INTO site_settings (setting_key, setting_value) VALUES ('hero_image', $1) ON CONFLICT (setting_key) DO UPDATE SET setting_value = $1",
      [imageUrl]
    )
    res.json({ message: 'Hero image updated', imageUrl })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
