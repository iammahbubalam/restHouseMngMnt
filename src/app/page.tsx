'use client';

import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import DateStrip from '@/components/DateStrip';
import RoomCard from '@/components/RoomCard';
import BookingModal from '@/components/BookingModal';
import Navbar from '@/components/Navbar';
import { format } from 'date-fns';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [buildingsData, setBuildingsData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRooms = async (date: Date) => {
    setLoading(true);
    try {
      const dateString = format(date, 'yyyy-MM-dd');
      const res = await fetch(`/api/rooms?date=${dateString}`);
      if (res.ok) {
        const data = await res.json();
        setBuildingsData(data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchRooms(selectedDate);
    }
  }, [selectedDate, session]);

  const handleBookClick = (roomId: number, roomNumber: string) => {
    setSelectedRoomId(roomId);
    setSelectedRoomNumber(roomNumber);
    setModalOpen(true);
  };

  const handleConfirmBooking = async (comment: string) => {
    if (!selectedRoomId) return;
    
    setIsSubmitting(true);
    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: selectedRoomId,
          bookingDate: dateString,
          comment,
        }),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchRooms(selectedDate); // Refresh data
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to book room');
      }
    } catch (error) {
      console.error(error);
      alert('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        fetchRooms(selectedDate);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error(error);
      alert('An unexpected error occurred');
    }
  };

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-primary">Loading...</div>;
  }

  const currentUserId = session.user?.id as string;

  return (
    <div className="min-h-screen bg-bg-primary pb-24 font-sans">
      
      {/* Top Header */}
      <header className="px-6 py-6 pt-12 flex justify-between items-center bg-bg-card border-b border-border-subtle sticky top-0 z-20">
        <div>
          <p className="text-text-secondary text-sm font-medium tracking-wide">Welcome back,</p>
          <h1 className="text-2xl font-bold text-text-primary">{session.user?.name}</h1>
        </div>
        
        {session.user?.image ? (
          <img 
            src={session.user.image} 
            alt="Profile" 
            className="w-12 h-12 rounded-full border-2 border-border-subtle cursor-pointer hover:border-accent-red transition-colors"
            onClick={() => signOut()}
            title="Sign out"
          />
        ) : (
          <button onClick={() => signOut()} className="p-3 bg-bg-glass rounded-full text-accent-red hover:bg-accent-red/10 transition-colors">
            <LogOut size={20} />
          </button>
        )}
      </header>

      {/* Date Strip Component */}
      <DateStrip 
        selectedDate={selectedDate} 
        onSelectDate={setSelectedDate} 
      />

      {/* Main Content */}
      <main className="p-6 space-y-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-accent-green/20 border-t-accent-green rounded-full animate-spin"></div>
          </div>
        ) : (
          Object.entries(buildingsData).map(([code, building]: [string, any]) => (
            <div key={code} className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-text-primary">{building.name}</h2>
                <div className="h-[1px] flex-1 bg-border-subtle"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {building.rooms.map((room: any) => (
                  <RoomCard 
                    key={room.id}
                    room={room}
                    currentUserId={currentUserId}
                    onBook={() => handleBookClick(room.id, room.roomNumber)}
                    onCancel={() => handleCancelBooking(room.booking?.id)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </main>

      <Navbar />

      <BookingModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmBooking}
        roomNumber={selectedRoomNumber}
        date={selectedDate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
