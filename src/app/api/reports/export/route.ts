import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { checkAccess } from '@/lib/security';
import { format } from 'date-fns';

export async function GET(request: Request) {
  try {
    const access = await checkAccess();
    if (!access.authorized) return access.response;

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'Start and end dates are required' }, { status: 400 });
    }

    const logs = await sql`
      SELECT 
        b.id,
        b.booking_date,
        b.comment as note,
        b.created_at,
        r.room_number,
        bd.name as building_name,
        u.name as creator_name,
        u.email as creator_email
      FROM bookings b
      JOIN rooms r ON r.id = b.room_id
      JOIN buildings bd ON bd.id = r.building_id
      JOIN users u ON u.id = b.booked_by
      WHERE b.booking_date BETWEEN ${startDate} AND ${endDate}
      ORDER BY b.booking_date ASC
    `;

    // Generate CSV Content
    const headers = ['ID', 'Building', 'Room', 'Booking Date', 'Staff Name', 'Staff Email', 'Created At', 'Note'];
    const rows = logs.map(l => [
      l.id,
      l.building_name,
      l.room_number,
      format(new Date(l.booking_date), 'yyyy-MM-dd'),
      l.creator_name,
      l.creator_email,
      format(new Date(l.created_at), 'yyyy-MM-dd HH:mm:ss'),
      `"${(l.note || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=Staff_History_Report_${startDate}_to_${endDate}.csv`
      }
    });

  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
