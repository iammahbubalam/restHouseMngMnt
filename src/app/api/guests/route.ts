import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { checkAccess } from '@/lib/security';

export async function GET() {
  try {
    const access = await checkAccess();
    if (!access.authorized) return access.response;

    // Fetch guests based on their booking history
    const guests = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        COUNT(b.id) as total_bookings,
        MAX(b.booking_date) as last_visit
      FROM users u
      JOIN bookings b ON b.booked_by = u.id
      GROUP BY u.id, u.name, u.email
      ORDER BY total_bookings DESC
    `;

    return NextResponse.json(guests);
  } catch (error) {
    console.error('Guests API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
