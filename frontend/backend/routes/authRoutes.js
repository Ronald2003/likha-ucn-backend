const nodemailer = require('nodemailer');
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/db')

const router = express.Router()

router.post('/register', async (req, res) => {
  const { email, password, role, storeName, name, phone } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const userResult = await db.query(
      'INSERT INTO users (email, password_hash, role, name, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [email, hashedPassword, role, name || null, phone || null]
    );
    
    const userId = userResult.rows[0].id;
    
    if (role === 'seller') {
      await db.query(
        'INSERT INTO seller_profiles (user_id, store_name, verification_status) VALUES ($1, $2, $3)',
        [userId, storeName, 'pending']
      );
    }
    res.json({ message: 'Registration successful', userId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isValidPassword = bcrypt.compareSync(password, user.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      'LIKHA_SECRET_KEY',
      { expiresIn: '24h' }
    )
    res.json({ token, role: user.role })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router

const otpStore = new Map();

router.post('/send-otp', async (req, res) => {
  
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });
    
    console.log(`[OTP] Generated ${otp} for ${email}`);

    // Render Free Tier blocks all outbound SMTP (Ports 25, 465, 587).
    // To prevent the app from hanging and returning a 504 Timeout,
    // we bypass SMTP entirely and return the debug_otp directly.
    return res.json({ message: 'OTP sent (Render Free Tier mock)', debug_otp: otp });

});

router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const stored = otpStore.get(email);
  
  if (!stored) return res.status(400).json({ error: 'OTP not requested or expired' });
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'OTP expired' });
  }
  if (stored.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
  
  // OTP valid, remove it
  otpStore.delete(email);
  res.json({ message: 'OTP verified' });
});
