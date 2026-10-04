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
    
    const token = jwt.sign(
      { id: userId, role: role },
      'LIKHA_SECRET_KEY',
      { expiresIn: '24h' }
    );
    
    res.json({ message: 'Registration successful', token, role, userId });
  } catch (err) {
    if (err.constraint === 'users_email_key' || err.message && err.message.includes('users_email_key')) {
        return res.status(400).json({ error: 'This email is already registered. Please log in instead.' });
    }
    res.status(400).json({ error: err.message });
  }
});

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

const otpStore = new Map();

router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    
    try {
        const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'This email is already registered. Please log in instead.' });
        }
    } catch (dbErr) {
        // ignore and proceed
    }
    
    const crypto = require('crypto');
    const otp = crypto.randomInt(100000, 999999).toString();
    
    otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });
    
    try {
        const response = await fetch(process.env.VERCEL_EMAIL_URL || 'https://likha-ucn.vercel.app/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                otp: otp,
                secret: process.env.VERCEL_EMAIL_SECRET || 'dev_secret'
            })
        });

        if (!response.ok) {
            throw new Error('Vercel function rejected the email request');
        }

        console.log(`[OTP] Email securely dispatched to ${email} via Vercel Function.`);
        return res.json({ message: 'OTP securely sent to your email.' });
    } catch (error) {
        console.error('[OTP Error]:', error);
        return res.status(500).json({ error: 'Failed to send OTP email.' });
    }
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
  
  otpStore.delete(email);
  res.json({ message: 'OTP verified' });
});

module.exports = router;
