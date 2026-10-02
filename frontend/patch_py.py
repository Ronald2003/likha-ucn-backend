import os

with open('backend/config/db.js', 'r') as f:
    db = f.read()

settings = """
    await db.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        setting_key TEXT UNIQUE,
        setting_value TEXT
      )
    `)
    
    await db.query(`
      INSERT INTO site_settings (setting_key, setting_value) 
      VALUES ('hero_image', 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')
      ON CONFLICT (setting_key) DO NOTHING
    `)
    
    await db.query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT`)
"""

db = db.replace("console.log('Database initialized successfully')", settings + "\n    console.log('Database initialized successfully')")

with open('backend/config/db.js', 'w') as f:
    f.write(db)
print("Success")
