const db = require('./config/db');
async function migrate() {
  try {
    console.log("Renaming column ship_from to location...");
    await db.query(`ALTER TABLE products RENAME COLUMN ship_from TO location;`);
    console.log("Adding column specific_address...");
    await db.query(`ALTER TABLE products ADD COLUMN specific_address text;`);
    console.log("Updating existing products to Daet...");
    await db.query(`UPDATE products SET location = 'Daet';`);
    console.log("Migration complete!");
    process.exit(0);
  } catch (err) {
    if (err.message.includes("does not exist") || err.message.includes("already exists")) {
      console.log(err.message);
      // maybe already migrated
      try {
        await db.query(`UPDATE products SET location = 'Daet';`);
        console.log("Updated to Daet anyway.");
        process.exit(0);
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    } else {
      console.error(err);
      process.exit(1);
    }
  }
}
migrate();
