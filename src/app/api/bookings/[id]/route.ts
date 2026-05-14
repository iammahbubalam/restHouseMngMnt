import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const bookingId = resolvedParams.id;

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    // Only allow the user who booked it to delete it
    const result = await sql`
      DELETE FROM bookings
      WHERE id = ${bookingId} AND booked_by = ${session.user.id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found or you do not have permission to delete it' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, deletedId: result[0].id });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
