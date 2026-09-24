const db = require('./config/db');
db.query("SELECT id, role, email FROM users WHERE role = 'admin'").then(res => {
  console.log(res.rows);
  process.exit(0);
}).catch(console.error);
