'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { format } from "date-fns";
import { Loader2, User } from "lucide-react";

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
  const [profileImgError, setProfileImgError] = useState(false);

  // --- MODAL STATES ---
  const [bookingModal, setBookingModal] = useState<{ isOpen: boolean; room: Room | null }>({ isOpen: false, room: null });
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; room: Room | null }>({ isOpen: false, room: null });

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
        <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    if (typeof window !== 'undefined') window.location.href = "/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-32">
      {/* COMPACT SCROLLING HEADER */}
      <header className="relative px-6 pt-10 pb-4">
        <div className="max-w-screen-xl mx-auto flex justify-between items-end">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-text-secondary opacity-30 mb-0.5">Rest House</p>
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase">Home</h1>
          </div>
          <div className="h-10 w-10 rounded-xl overflow-hidden bg-white/5 border border-white/5 shadow-lg active:scale-95 transition-transform flex items-center justify-center group">
            {session?.user?.image && !profileImgError ? (
              <img 
                src={session.user.image} 
                alt="Profile" 
                className="h-full w-full object-cover"
                onError={() => setProfileImgError(true)}
              />
            ) : (
              <div className="text-text-secondary group-active:text-white transition-colors">
                <User size={20} />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-8 space-y-12">
        {/* DATE STRIP */}
        <section>
          <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </section>

        {/* BUILDINGS */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">Buildings</h2>
            <div className="bg-bg-card px-3 py-1 rounded-full text-[10px] font-black text-text-secondary uppercase tracking-widest border border-white/5">
              {buildings.length} Total
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
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-accent-blue mb-1">
                DATE: {format(selectedDate, 'dd-MM-yyyy')}
              </p>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">Rooms</h2>
            </div>
            <div className="bg-bg-card px-3 py-1 rounded-full text-[10px] font-black text-text-secondary uppercase tracking-widest border border-white/5">
              {filteredRooms.length} Units
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 text-accent-blue animate-spin" />
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
            <div className="text-center py-20 bg-bg-card/20 rounded-xl border border-dashed border-white/5">
              <p className="text-text-secondary text-[8px] font-black uppercase tracking-widest">No Rooms Available</p>
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
        message={`Confirm cancellation for Room ${confirmModal.room?.roomNumber}? This action is irreversible.`}
        confirmLabel="Cancel Booking"
        isDestructive={true}
        onClose={() => setConfirmModal({ isOpen: false, room: null })}
        onConfirm={handleCancel}
      />

      <Navbar />
    </div>
  );
}
