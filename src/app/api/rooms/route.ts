import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { checkAccess } from '@/lib/security';

export async function GET(request: Request) {
  try {
    const access = await checkAccess();
    if (!access.authorized) return access.response;

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // 1. Fetch all buildings
    const buildings = await sql`SELECT * FROM buildings ORDER BY id`;
    
    // 2. Fetch all rooms with their bookings for the specific date
    const roomRows = await sql`
      SELECT
        r.id AS room_id,
        r.room_number,
        r.building_id,
        b.id AS booking_id,
        b.comment,
        b.booking_date,
        u.name AS booked_by_name,
        u.id AS booked_by_id
      FROM rooms r
      LEFT JOIN bookings b
        ON b.room_id = r.id
        AND b.booking_date = ${date}
      LEFT JOIN users u ON u.id = b.booked_by
      ORDER BY r.room_number
    `;

    // 3. Construct the response object
    const result: Record<string, any> = {};
    
    buildings.forEach(b => {
      result[b.code] = {
        id: b.id,
        name: b.name,
        code: b.code,
        rooms: roomRows
          .filter(r => r.building_id === b.id)
          .map(r => ({
            id: r.room_id,
            roomNumber: r.room_number,
            isBooked: !!r.booking_id,
            booking: r.booking_id ? {
              id: r.booking_id,
              date: r.booking_date,
              comment: r.comment,
              bookedById: r.booked_by_id,
              bookedByName: r.booked_by_name,
            } : null
          }))
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
