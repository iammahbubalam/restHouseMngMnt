import { neon } from '@neondatabase/serverless';

async function test() {
  // Attempting to use the non-pooling hostname
  const url = "postgresql://rest_house_mngmnt:npg_IcQ2JN7uZqUg@ep-summer-king-aha2t373.c-3.us-east-1.aws.neon.tech/rest_house_mngmnt?sslmode=require";
  
  console.log('Testing non-pooling connection...');
  try {
    const sql = neon(url);
    const result = await sql`SELECT 1 as test`;
    console.log('Success:', result);
  } catch (err) {
    console.error('Non-pooling failed:', err.message);
  }
}

test();
