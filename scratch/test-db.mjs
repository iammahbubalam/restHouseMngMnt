import { neon } from '@neondatabase/serverless';

async function test() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('No DATABASE_URL found');
    return;
  }
  console.log('Testing connection to:', url.replace(/:[^:@]+@/, ':****@'));
  try {
    const sql = neon(url);
    const result = await sql`SELECT 1 as test`;
    console.log('Success:', result);
  } catch (err) {
    console.error('Connection failed:', err);
    console.error('Stack:', err.stack);
  }
}

test();
