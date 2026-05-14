import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    console.log('Initializing Access Table...');
    await sql`
      CREATE TABLE IF NOT EXISTS access (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // ADD YOUR EMAILS HERE
    const emails = [
      'iammahbubalam@gmail.com',
      'mahbub@example.com'
    ];

    for (const email of emails) {
      await sql`
        INSERT INTO access (email) 
        VALUES (${email}) 
        ON CONFLICT (email) DO NOTHING;
      `;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Security table initialized and admin whitelisted. Please delete this file (/api/setup/route.ts) now for security.' 
    });
  } catch (error: any) {
    console.error('Setup failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
