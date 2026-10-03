const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, otp, secret } = JSON.parse(event.body);

    // Super simple secret check so hackers can't spam this URL
    if (secret !== process.env.NETLIFY_EMAIL_SECRET) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
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

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Email sent successfully via Netlify' })
    };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
