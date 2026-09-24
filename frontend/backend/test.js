const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:1234@localhost:5432/likha_db' });

async function testQuery() {
  try {
    const res = await pool.query(`SELECT p.stock as current_stock FROM products p LIMIT 1;`);
    console.log(res.rows);
  } catch(e) {
    console.log(e);
  } finally {
    pool.end();
  }
}
testQuery();
