import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { checkAccess } from '@/lib/security';

export async function GET(request: Request) {
  try {
    const access = await checkAccess();
    if (!access.authorized) return access.response;

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '40'), 100);
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0);
    const creatorId = searchParams.get('creatorId') || null;
    const startDate = searchParams.get('startDate') || null;
    const endDate = searchParams.get('endDate') || null;
    const search = searchParams.get('search') || null;

    // Base query components
    let whereClause = sql``;
    const conditions = [];
    
    if (creatorId) {
      conditions.push(sql`b.booked_by = ${creatorId}`);
    }
    if (startDate) {
      conditions.push(sql`b.booking_date >= ${startDate}`);
    }
    if (endDate) {
      conditions.push(sql`b.booking_date <= ${endDate}`);
    }
    if (search) {
      const searchPattern = `%${search}%`;
      conditions.push(sql`(u.name ILIKE ${searchPattern} OR r.room_number ILIKE ${searchPattern})`);
    }

    if (conditions.length > 0) {
      whereClause = sql`WHERE ${conditions.reduce((acc, curr) => sql`${acc} AND ${curr}`)}`;
    }

    // Main data query
    const bookings = await sql`
      SELECT 
        b.id,
        b.booking_date,
        b.comment as note,
        b.created_at,
        r.room_number,
        u.name as creator_name,
        u.email as creator_email
      FROM bookings b
      JOIN rooms r ON r.id = b.room_id
      JOIN users u ON u.id = b.booked_by
      ${whereClause}
      ORDER BY b.booking_date DESC, b.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Accurate total count for pagination
    const countResult = await sql`
      SELECT COUNT(*) FROM bookings b
      JOIN users u ON u.id = b.booked_by
      ${whereClause}
    `;

    return NextResponse.json({
      data: bookings,
      total: parseInt(countResult[0].count),
      limit,
      offset
    });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const access = await checkAccess();
    if (!access.authorized) return access.response;
    const session = access.session;

    const body = await request.json();
    const { roomId, bookingDate, comment } = body;
    const userId = session?.user?.id;

    if (!roomId || !bookingDate || !userId) {
      return NextResponse.json({ error: 'Missing required fields or unauthorized' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO bookings (room_id, booking_date, booked_by, comment)
      VALUES (${roomId}, ${bookingDate}, ${userId}, ${comment || ''})
      RETURNING *
    `;

    return NextResponse.json({ success: true, booking: result[0] });
  } catch (error: any) {
    console.error('Booking error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Room already booked' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
