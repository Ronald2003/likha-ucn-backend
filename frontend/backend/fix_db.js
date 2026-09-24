const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:1234@localhost:5432/likha_db' });

async function fixCols() {
  try {
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_url TEXT;');
    await pool.query('ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS logo_url TEXT;');
    console.log("Added missing image columns!");
  } catch (err) {
    console.log("Error:", err.message);
  } finally {
    pool.end();
  }
}
fixCols();
