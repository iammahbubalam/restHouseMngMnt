import postgres from 'postgres';

async function test() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('No DATABASE_URL found');
    return;
  }
  console.log('Testing TCP connection with postgres-js...');
  try {
    const sql = postgres(url, { ssl: 'require' });
    const result = await sql`SELECT 1 as test`;
    console.log('Success:', result);
    await sql.end();
  } catch (err) {
    console.error('TCP Connection failed:', err);
  }
}

test();
