import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { checkAccess } from '@/lib/security';
import { startOfWeek, endOfWeek, format, eachDayOfInterval } from 'date-fns';

export async function GET() {
  try {
    const access = await checkAccess();
    if (!access.authorized) return access.response;

    // 1. Total Occupancy Rate (Global)
    const totalRoomsCount = await sql`SELECT COUNT(*) FROM rooms`;
    const bookedRoomsCount = await sql`SELECT COUNT(*) FROM bookings WHERE booking_date = CURRENT_DATE`;
    
    const occupancy = totalRoomsCount[0].count > 0 
      ? Math.round((bookedRoomsCount[0].count / totalRoomsCount[0].count) * 100) 
      : 0;

    // 2. Active Guests (Today)
    const activeGuests = await sql`SELECT COUNT(DISTINCT booked_by) FROM bookings WHERE booking_date = CURRENT_DATE`;

    // 3. Weekly Trend Data
    const start = startOfWeek(new Date());
    const end = endOfWeek(new Date());
    const days = eachDayOfInterval({ start, end });

    const weeklyStats = await Promise.all(days.map(async (day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const count = await sql`SELECT COUNT(*) FROM bookings WHERE booking_date = ${dateStr}`;
      return {
        date: dateStr,
        count: parseInt(count[0].count)
      };
    }));

    // 4. Recent Activity
    const recentActivity = await sql`
      SELECT 
        u.name as guest,
        r.room_number as room,
        b.booking_date as date,
        'Check-in' as type
      FROM bookings b
      JOIN rooms r ON r.id = b.room_id
      JOIN users u ON u.id = b.booked_by
      ORDER BY b.id DESC
      LIMIT 10
    `;

    return NextResponse.json({
      kpis: [
        { label: 'Occupancy', value: `${occupancy}%`, trend: '+5%', icon: 'TrendingUp', color: 'text-accent-green' },
        { label: 'Active Guests', value: activeGuests[0].count.toString(), trend: '+2', icon: 'Users', color: 'text-accent-blue' },
        { label: 'Total Units', value: totalRoomsCount[0].count.toString(), trend: 'Stable', icon: 'BarChart3', color: 'text-accent-amber' },
      ],
      weeklyStats,
      recentActivity
    });
  } catch (error) {
    console.error('Reports API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
