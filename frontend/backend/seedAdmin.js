const bcrypt = require('bcryptjs')
const { Pool } = require('pg')

const db = new Pool({
  connectionString: 'postgresql://postgres:1234@localhost:5432/likha_db'
})

async function seedAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('adminpassword', 10)
    
    await db.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash",
      ['Admin', 'admin@ucn.edu.ph', hashedPassword, 'admin']
    )
    
    console.log('Admin password updated successfully.')
  } catch (err) {
    console.error('Database error:', err.message)
  } finally {
    await db.end()
  }
}

seedAdmin()