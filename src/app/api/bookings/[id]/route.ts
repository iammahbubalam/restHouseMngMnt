import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { checkAccess } from '@/lib/security';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const access = await checkAccess();
    if (!access.authorized) return access.response;
    const session = access.session;

    const resolvedParams = await params;
    const bookingId = resolvedParams.id;

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'User ID missing from session' }, { status: 401 });
    }

    // Only allow the user who booked it to delete it
    const result = await sql`
      DELETE FROM bookings
      WHERE id = ${bookingId ?? null} AND booked_by = ${session.user.id ?? null}
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
