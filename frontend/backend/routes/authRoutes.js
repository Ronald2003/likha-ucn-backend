const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/db')

const router = express.Router()

router.post('/register', async (req, res) => {
  const { email, password, role, storeName, name, phone } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
        // Send a POST request to our Netlify Serverless Function
        // which acts as our email-sending proxy (bypassing Render's SMTP block)
        const fetch = require('node-fetch'); // Assuming node-fetch is available, or use axios if installed
        
        // Use standard Node.js fetch (available in Node 18+)
        const response = await fetch('https://ucnmarkethub.netlify.app/.netlify/functions/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                otp: otp,
                secret: process.env.NETLIFY_EMAIL_SECRET || 'dev_secret'
            })
        });

        if (!response.ok) {
            throw new Error('Netlify function rejected the email request');
        }

        console.log(`[OTP] Email securely dispatched to ${email} via Netlify Function.`);
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
  
  // OTP valid, remove it
  otpStore.delete(email);
  res.json({ message: 'OTP verified' });
});

module.exports = router;
