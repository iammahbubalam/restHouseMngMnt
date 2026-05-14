import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

async function init() {
  try {
    console.log('Initializing Access Table...');
    await sql`
      CREATE TABLE IF NOT EXISTS access (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Access table created/verified.');

    // Add your email to the list
    const adminEmail = 'iammahbubalam@gmail.com'; // Using your corpus/contact email name pattern
    await sql`
      INSERT INTO access (email) 
      VALUES (${adminEmail}) 
      ON CONFLICT (email) DO NOTHING;
    `;
    console.log(`✅ Admin whitelisted: ${adminEmail}`);
    
    process.exit(0);
  } catch (e) {
    console.error('❌ DB Init Failed:', e);
    process.exit(1);
  }
}

init();
