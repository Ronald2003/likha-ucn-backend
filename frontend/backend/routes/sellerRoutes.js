const upload = require('../config/upload');
const express = require('express')
const db = require('../config/db')
const { verifyToken } = require('../middleware/authMiddleware')
const path = require('path')
const fs = require('fs')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const usersResult = await db.query("SELECT u.* FROM users u JOIN seller_profiles sp ON u.id = sp.user_id WHERE u.role = 'seller' AND sp.verification_status = 'approved'")
    const users = usersResult.rows
    
    const profilesResult = await db.query("SELECT * FROM seller_profiles")
    const safeProfiles = profilesResult.rows || []
    
    const countsResult = await db.query("SELECT seller_id, COUNT(*) as count FROM products GROUP BY seller_id")
    const countMap = {}
    if (countsResult.rows) {
      countsResult.rows.forEach(c => countMap[c.seller_id] = c.count)
    }

    const results = users.map(u => {
      const p = safeProfiles.find(profile => profile.user_id === u.id) || {}
      return {
        user_id: u.id,
        email: u.email,
        owner_name: u.name,
        store_name: p.store_name,
        description: p.description,
        profile_image_url: u.profile_image_url || u.image_url || u.image || u.avatar,
        logo_url: p.logo_url || p.image_url || p.image || p.avatar,
        product_count: countMap[u.id] || 0
      }
    })
    res.json(results)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/me', verifyToken, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM seller_profiles WHERE user_id = $1", [req.user.id])
    res.json(result.rows[0] || {})
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  const userId = req.params.id
  
  try {
    const userResult = await db.query("SELECT * FROM users WHERE id = $1 AND role = 'seller'", [userId])
    const user = userResult.rows[0]
    
    if (!user) return res.status(404).json({ error: 'Seller not found' })
    
    const profileResult = await db.query("SELECT * FROM seller_profiles WHERE user_id = $1", [userId])
    const p = profileResult.rows[0] || {}
    
    res.json({
      user_id: user.id,
      email: user.email,
      owner_name: user.name,
      store_name: p.store_name,
      description: p.description,
      profile_image_url: user.profile_image_url || user.image_url || user.image || user.avatar,
      logo_url: p.logo_url || p.image_url || p.image || p.avatar
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/request-name', verifyToken, async (req, res) => {
  const { newName } = req.body
  
  try {
    const result = await db.query("SELECT * FROM seller_profiles WHERE user_id = $1", [req.user.id])
    const row = result.rows[0]
    
    if (!row) {
      await db.query("INSERT INTO seller_profiles (user_id, pending_store_name) VALUES ($1, $2)", [req.user.id, newName])
    } else {
      await db.query("UPDATE seller_profiles SET pending_store_name = $1 WHERE user_id = $2", [newName, req.user.id])
    }
    res.json({ message: "Name change requested" })
  } catch (err) {
    // If column doesn't exist, try creating it and rerunning
    if (err.message.includes('column "pending_store_name" of relation "seller_profiles" does not exist')) {
      try {
        await db.query("ALTER TABLE seller_profiles ADD COLUMN pending_store_name TEXT")
        await db.query("UPDATE seller_profiles SET pending_store_name = $1 WHERE user_id = $2", [newName, req.user.id])
        res.json({ message: "Name change requested" })
      } catch (innerErr) {
        res.status(500).json({ error: innerErr.message })
      }
    } else {
      res.status(500).json({ error: err.message })
    }
  }
})

router.put('/image', verifyToken, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error("Multer upload error:", err);
      return res.status(400).json({ error: "Image upload failed: " + err.message });
    }
    next();
  });
}, async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" })
  const imageUrl = req.file.path && req.file.path.startsWith('http') ? req.file.path : (req.file.path && req.file.path.startsWith('http') ? req.file.path : `/uploads/${req.file.filename}`)

  try {
    await db.query("UPDATE users SET profile_image_url = $1 WHERE id = $2", [imageUrl, req.user.id]);
      await db.query("UPDATE seller_profiles SET logo_url = $1, profile_image_url = $1 WHERE user_id = $2", [imageUrl, req.user.id]);
    res.json({ message: "Profile image updated", imageUrl })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router