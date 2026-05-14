import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be a Neon postgres connection string');
}

// TCP-based driver with aggressive timeouts and logging
export const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  max: 10,
  connect_timeout: 10, // 10 seconds
  onnotice: (msg) => console.log('DB Notice:', msg),
});
