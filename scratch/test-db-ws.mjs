import { neonConfig, neon } from '@neondatabase/serverless';
import ws from 'ws';

// Force WebSocket usage
neonConfig.webSocketConstructor = ws;

async function test() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('No DATABASE_URL found');
    return;
  }
  console.log('Testing WebSocket connection to Neon...');
  try {
    const sql = neon(url);
    const result = await sql`SELECT 1 as test`;
    console.log('Success via WebSocket:', result);
  } catch (err) {
    console.error('WebSocket failed:', err);
  }
}

test();
