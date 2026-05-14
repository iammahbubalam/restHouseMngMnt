import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // Fetch all rooms and left join with bookings for the specific date
    // This allows us to see both available and booked rooms in one query
    const rooms = await sql`
      SELECT
        r.id AS room_id,
        r.room_number,
        bg.code AS building_code,
        bg.name AS building_name,
        b.id AS booking_id,
        b.comment,
        b.booking_date,
        u.name AS booked_by_name,
        u.email AS booked_by_email,
        u.id AS booked_by_id
      FROM rooms r
      JOIN buildings bg ON r.building_id = bg.id
      LEFT JOIN bookings b
        ON b.room_id = r.id
        AND b.booking_date = ${date}
      LEFT JOIN users u ON u.id = b.booked_by
      ORDER BY bg.id, r.room_number
    `;

    // Group by building for easier frontend rendering
    const groupedByBuilding = rooms.reduce((acc, row) => {
      if (!acc[row.building_code]) {
        acc[row.building_code] = {
          name: row.building_name,
          rooms: []
        };
      }
      
      acc[row.building_code].rooms.push({
        id: row.room_id,
        roomNumber: row.room_number,
        isBooked: !!row.booking_id,
        booking: row.booking_id ? {
          id: row.booking_id,
          date: row.booking_date,
          comment: row.comment,
          bookedById: row.booked_by_id,
          bookedByName: row.booked_by_name,
        } : null
      });
      
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(groupedByBuilding);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
