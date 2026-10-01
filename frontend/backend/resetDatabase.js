require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

async function resetDatabase() {
  console.log("Connecting to the database to wipe all data...");
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log("1. Wiping reviews...");
    await client.query('DELETE FROM reviews');

    console.log("2. Wiping notifications and messages...");
    await client.query('DELETE FROM notifications');
    await client.query('DELETE FROM messages');

    console.log("3. Wiping order items and payments...");
    await client.query('DELETE FROM order_items');
    await client.query('DELETE FROM payments');

    console.log("4. Wiping orders...");
    await client.query('DELETE FROM orders');

    console.log("5. Wiping products...");
    await client.query('DELETE FROM products');

    console.log("6. Wiping seller profiles...");
    await client.query('DELETE FROM seller_profiles');

    console.log("7. Wiping all users EXCEPT the Admin...");
    await client.query("DELETE FROM users WHERE role != 'admin'");

    await client.query('COMMIT');
    console.log("\n✅ SUCCESS: Database has been wiped clean for a fresh start!");
    console.log("Your Admin account is the only account remaining.");
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("\n❌ ERROR: Failed to wipe database.", error.message);
  } finally {
    client.release();
    pool.end();
  }
}

resetDatabase();
