import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { checkAccess } from '@/lib/security';

export async function GET() {
  try {
    const access = await checkAccess();
    if (!access.authorized) return access.response;

    const creators = await sql`
      SELECT DISTINCT 
        u.id, 
        u.name 
      FROM bookings b
      JOIN users u ON u.id = b.booked_by
      ORDER BY u.name ASC
    `;

    return NextResponse.json({ creators });
  } catch (error) {
    console.error('Fetch filter options error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
