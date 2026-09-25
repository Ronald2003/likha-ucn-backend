const { Pool, types } = require('pg')
types.setTypeParser(1700, val => parseFloat(val))

const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:1234@localhost:5432/likha_db',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
})

db.on('error', (err, client) => {
  console.error('Unexpected error on idle database client', err.message);
  // Prevent Node from crashing on idle connection disconnects
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err.stack)
  } else {
    console.log('Connected to Neon PostgreSQL database')
    initializeDatabase()
  }
})

async function initializeDatabase() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE,
        password_hash TEXT,
        role TEXT,
        name TEXT,
        phone TEXT,
        profile_image_url TEXT
      )
    `)

    await db.query(`
      CREATE TABLE IF NOT EXISTS seller_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        store_name TEXT,
        verification_status TEXT,
        profile_image_url TEXT,
        pending_store_name TEXT
      )
    `)

    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        seller_id INTEGER REFERENCES users(id),
        name TEXT,
        price NUMERIC,
        description TEXT,
        category TEXT,
        image_url TEXT,
        status TEXT,
        stock INTEGER DEFAULT 1,
        ship_from TEXT
      )
    `)

    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        buyer_id INTEGER REFERENCES users(id),
        status TEXT,
        payment_status TEXT
      )
    `)

    await db.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        product_id INTEGER REFERENCES products(id),
        seller_id INTEGER REFERENCES users(id),
        quantity INTEGER,
        price NUMERIC,
        status TEXT DEFAULT 'pending'
      )
    `)

    try {
      await db.query("ALTER TABLE order_items ADD COLUMN status TEXT DEFAULT 'pending'")
      await db.query("ALTER TABLE messages ADD COLUMN is_read BOOLEAN DEFAULT FALSE")
      await db.query("ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS logo_url TEXT")
      await db.query("ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS profile_image_url TEXT")
      await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_url TEXT")
    } catch (e) {
      // Column might already exist, safe to ignore
    }

    await db.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        paymongo_reference TEXT,
        status TEXT
      )
    `)

    await db.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER REFERENCES users(id),
        receiver_id INTEGER REFERENCES users(id),
        content TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await db.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        product_id INTEGER REFERENCES products(id),
        buyer_id INTEGER REFERENCES users(id),
        rating INTEGER,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE
      )
    `)

    await db.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title TEXT,
        message TEXT,
        is_read INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Insert default categories if none exist
    const catCheck = await db.query("SELECT COUNT(*) as count FROM categories")
    if (parseInt(catCheck.rows[0].count) === 0) {
      const defaultCategories = ['Food & Beverage', 'Clothing', 'Electronics', 'School Supplies']
      for (const category of defaultCategories) {
        await db.query("INSERT INTO categories (name) VALUES ($1) ON CONFLICT DO NOTHING", [category])
      }
    }

    console.log('Database tables verified and initialized successfully.')
  } catch (error) {
    console.error('Error initializing database tables:', error)
  }
}

module.exports = db

