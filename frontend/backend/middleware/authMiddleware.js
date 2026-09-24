const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], 'LIKHA_SECRET_KEY')
    req.user = decoded
    next()
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' })
  }
}

const isSeller = async (req, res, next) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ message: 'Requires seller privileges' })
  }
  try {
    const db = require('../config/db')
    const result = await db.query("SELECT verification_status FROM seller_profiles WHERE user_id = $1", [req.user.id])
    if (!result.rows[0] || result.rows[0].verification_status !== 'approved') {
      return res.status(403).json({ message: 'Seller account pending admin approval' })
    }
    next()
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Requires admin privileges' })
  }
  next()
}

module.exports = { verifyToken, isSeller, isAdmin }