import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CORS Headers in case they are needed
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, otp, secret } = req.body;

    if (secret !== (process.env.VERCEL_EMAIL_SECRET || 'dev_secret')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    const mailOptions = {
      from: `Likha UCN Market Hub <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your Likha UCN Verification Code',
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #7C121A;">Likha UCN Market Hub</h2>
              <p>Your verification code is:</p>
              <h1 style="letter-spacing: 5px; font-size: 32px; background: #f4f4f4; padding: 10px; border-radius: 5px; width: fit-content;">${otp}</h1>
              <p>This code will expire in 10 minutes.</p>
             </div>`
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully via Vercel' });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
