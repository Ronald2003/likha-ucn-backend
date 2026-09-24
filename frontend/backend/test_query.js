const db = require('./config/db');
db.query(`SELECT p.seller_id, AVG(r.rating) as avg_rating, COUNT(r.id) as count FROM reviews r JOIN products p ON r.product_id = p.id GROUP BY p.seller_id`).then(res => {
  console.log(res.rows);
  process.exit(0);
}).catch(console.error);
