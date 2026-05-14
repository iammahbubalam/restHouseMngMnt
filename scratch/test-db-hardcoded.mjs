import { neon } from '@neondatabase/serverless';

async function test() {
  // Hardcoded URL from your .env and screenshot
  const url = "postgresql://rest_house_mngmnt:npg_IcQ2JN7uZqUg@ep-summer-king-aha2t373.c-3.us-east-1.aws.neon.tech/rest_house_mngmnt?sslmode=require";
  
  console.log('Testing connection with hardcoded URL...');
  try {
    const sql = neon(url);
    const result = await sql`SELECT 1 as test`;
    console.log('Success:', result);
  } catch (err) {
    console.error('Failed:', err.message);
    if (err.sourceError) {
        console.error('Source Error:', err.sourceError);
    }
  }
}

test();
