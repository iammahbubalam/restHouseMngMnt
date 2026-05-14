'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { format } from "date-fns";
import { Loader } from "lucide-react";

import DateStrip from "@/components/DateStrip";
import RoomCard from "@/components/RoomCard";
import Navbar from "@/components/Navbar";
import BuildingCard from "@/components/BuildingCard";
import BookingModal from "@/components/BookingModal";
import ConfirmModal from "@/components/ConfirmModal";

// --- TYPES ---
interface Room {
  id: number;
  roomNumber: string;
  isBooked: boolean;
  booking?: {
    id: number;
    bookedById: string;
    bookedByName: string;
    bookingDate: string;
    comment: string;
  };
}

interface BuildingData {
  code: string;
  name: string;
  rooms: Room[];
}

interface BuildingDisplay {
  id: string;
  code: string;
  name: string;
  location: string;
  rooms: number;
  image: string;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [buildingsData, setBuildingsData] = useState<Record<string, BuildingData>>({});
  const [loading, setLoading] = useState(true);

  // --- MODAL STATES ---
  const [bookingModal, setBookingModal] = useState<{ isOpen: boolean; room: Room | null }>({ isOpen: false, room: null });
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; room: Room | null }>({ isOpen: false, room: null });

  const [profileImgError, setProfileImgError] = useState(false);

  // --- DATA FETCHING ---
  const fetchData = useCallback(async (silent = false) => {
    if (status !== "authenticated") return;
    if (!silent) setLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const response = await fetch(`/api/rooms?date=${dateStr}`);
      const data = await response.json();
      if (response.ok && typeof data === 'object' && !data.error) {
        setBuildingsData(data);
      } else {
        setBuildingsData({});
      }
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [selectedDate, status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- ACTIONS ---
  const handleBook = async (comment: string) => {
    if (!bookingModal.room) return;
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: bookingModal.room.id,
          bookingDate: format(selectedDate, 'yyyy-MM-dd'),
          comment
        })
      });
      if (response.ok) {
        setBookingModal({ isOpen: false, room: null });
        fetchData(true);
      } else {
        console.error('Booking failed at server');
      }
    } catch (e) {
      console.error('Network error during booking', e);
    }
  };

  const handleCancel = async () => {
    const room = confirmModal.room;
    if (!room || !room.booking) return;
    try {
      const response = await fetch(`/api/bookings/${room.booking.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setConfirmModal({ isOpen: false, room: null });
        fetchData(true);
      }
    } catch (e) {
      console.error('Cancellation failed', e);
    }
  };

  // --- MEMOS ---
  const buildings = useMemo<BuildingDisplay[]>(() => {
    return Object.values(buildingsData).map(b => ({
      id: b.code,
      code: b.code,
      name: b.name,
      location: 'Section A',
      rooms: b.rooms.length,
      image: b.code === 'vip_rest_house' ? '/images/sunset_villa.png' : '/images/ocean_view.png'
    }));
  }, [buildingsData]);

  const filteredRooms = useMemo<Room[]>(() => {
    if (!selectedBuildingId) return [];
    return buildingsData[selectedBuildingId]?.rooms || [];
  }, [buildingsData, selectedBuildingId]);

  // --- AUTO-SELECTION ---
  useEffect(() => {
    if (buildings.length > 0 && !selectedBuildingId) {
      setSelectedBuildingId(buildings[0].id);
    }
  }, [buildings, selectedBuildingId]);

  // --- RENDER HELPERS ---
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary">
        <Loader className="w-8 h-8 text-accent-blue animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    if (typeof window !== 'undefined') window.location.href = "/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-44">
      {/* COMPACT SCROLLING HEADER */}
      <header className="relative px-6 pt-12 pb-4">
        <div className="max-w-screen-xl mx-auto flex justify-between items-end">
          <div className="animate-in slide-in-from-left duration-700">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-blue mb-1.5">DASHBOARD</p>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Home</h1>
          </div>
          <div className="h-11 w-11 rounded-xl overflow-hidden bg-bg-card border border-white/10 shadow-2xl active:scale-90 transition-all flex items-center justify-center group animate-in slide-in-from-right duration-700">
            {session?.user?.image && !profileImgError ? (
              <img 
                src={session.user.image} 
                alt="Profile" 
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-all"
                onError={() => setProfileImgError(true)}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-[12px] font-black text-white bg-accent-blue/30 border border-accent-blue/20">
                {session?.user?.name?.charAt(0) || 'A'}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-8 space-y-12">
        {/* DATE STRIP */}
        <section className="animate-in fade-in slide-in-from-bottom duration-700 delay-100">
          <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </section>

        {/* BUILDINGS */}
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">Buildings</h2>
            <div className="bg-bg-card px-4 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] border border-white/10 shadow-lg">
              {buildings.length} UNITS
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {buildings.map((b) => (
              <BuildingCard 
                key={b.id}
                name={b.name}
                location={b.location}
                roomCount={b.rooms}
                imageUrl={b.image}
                isSelected={selectedBuildingId === b.id}
                onClick={() => setSelectedBuildingId(b.id)}
              />
            ))}
          </div>
        </section>

        {/* ROOMS */}
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          <div className="flex items-center justify-between px-1">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-blue mb-2">
                DATE: {format(selectedDate, 'dd MM yyyy')}
              </p>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">Rooms</h2>
            </div>
            <div className="bg-bg-card px-4 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] border border-white/10 shadow-lg">
              {filteredRooms.length} STATUS
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader className="w-8 h-8 text-accent-blue animate-spin opacity-40" />
            </div>
          ) : filteredRooms.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  currentUserId={session?.user?.id || ''}
                  onBook={() => setBookingModal({ isOpen: true, room })}
                  onCancel={() => setConfirmModal({ isOpen: true, room })}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-bg-card/20 rounded-3xl border border-dashed border-white/10">
              <p className="text-white text-[10px] font-black uppercase tracking-[0.3em] opacity-60">No Units Selected</p>
            </div>
          )}
        </section>
      </main>

      {/* MODALS */}
      <BookingModal 
        isOpen={bookingModal.isOpen}
        roomNumber={bookingModal.room?.roomNumber || ''}
        onClose={() => setBookingModal({ isOpen: false, room: null })}
        onConfirm={handleBook}
      />

      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title="Cancel Booking"
        message={`Confirm termination of booking for Room ${confirmModal.room?.roomNumber}? This record will be permanently deleted.`}
        confirmLabel="Terminate Booking"
        isDestructive={true}
        onClose={() => setConfirmModal({ isOpen: false, room: null })}
        onConfirm={handleCancel}
      />

      <Navbar />
    </div>
  );
}
