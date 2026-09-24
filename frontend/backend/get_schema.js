const db = require('./config/db');
db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'seller_profiles'").then(res => console.log("seller_profiles:", res.rows.map(r=>r.column_name).join(', ')));
db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'").then(res => { console.log("users:", res.rows.map(r=>r.column_name).join(', ')); process.exit(0); });
