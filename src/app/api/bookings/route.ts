import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { roomId, bookingDate, comment } = body;

    if (!roomId || !bookingDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert the booking. The database UNIQUE constraint on (room_id, booking_date)
    // will throw an error if someone else already booked it.
    const result = await sql`
      INSERT INTO bookings (room_id, booking_date, booked_by, comment)
      VALUES (${roomId}, ${bookingDate}, ${session.user.id}, ${comment || ''})
      RETURNING *
    `;

    return NextResponse.json({ success: true, booking: result[0] });
  } catch (error: any) {
    console.error('Booking error:', error);
    
    // Check if this is a unique constraint violation (double booking)
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'This room is already booked for this date.' }, 
        { status: 409 }
      );
    }
    
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
