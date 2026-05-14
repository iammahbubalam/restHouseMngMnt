'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import DateStrip from "@/components/DateStrip";
import RoomCard from "@/components/RoomCard";
import Navbar from "@/components/Navbar";
import BuildingCard from "@/components/BuildingCard";
import { format } from "date-fns";
import { Loader2, Search, Plus, Filter } from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('villa-a');
  const [buildingsData, setBuildingsData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const buildings = [
    { id: 'villa-a', code: 'A', name: 'Sunset Villa', location: 'Building A', rooms: 12, image: '/images/sunset_villa.png' },
    { id: 'villa-b', code: 'B', name: 'Ocean View', location: 'Building B', rooms: 15, image: '/images/ocean_view.png' },
  ];

  const currentBuildingCode = useMemo(() => {
    return buildings.find(b => b.id === selectedBuildingId)?.code || 'A';
  }, [selectedBuildingId]);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/login";
    }
  }, [status]);

  const fetchData = useCallback(async () => {
    if (status !== "authenticated") return;
    setLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const response = await fetch(`/api/rooms?date=${dateStr}`);
      const data = await response.json();
      setBuildingsData(data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // FILTER ROOMS BY SELECTED BUILDING
  const filteredRooms: any[] = useMemo(() => {
    return buildingsData[currentBuildingCode]?.rooms || [];
  }, [buildingsData, currentBuildingCode]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary">
        <Loader2 className="w-10 h-10 text-accent-blue animate-spin mb-4" />
        <p className="text-text-secondary font-black animate-pulse uppercase tracking-widest text-[10px]">Initializing...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-bg-secondary pb-24">
      <header className="bg-bg-primary border-b border-border-subtle sticky top-0 z-20">
        <div className="px-6 pt-8 pb-4 max-w-screen-xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-text-primary tracking-tight">Rest House</h1>
            <p className="text-[10px] text-text-secondary font-black uppercase tracking-[0.2em] opacity-60">Management System</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-full bg-bg-secondary border border-border-subtle text-text-primary">
              <Search size={20} />
            </button>
            <div className="h-10 w-10 rounded-full border-2 border-accent-blue p-0.5">
              <img src={session.user?.image || ''} alt="User" className="h-full w-full rounded-full object-cover" />
            </div>
          </div>
        </div>
        <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-8 space-y-10">
        {/* BUILDINGS DUAL GRID */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-text-primary tracking-tight">Buildings</h2>
            <span className="text-[10px] font-black text-accent-blue uppercase tracking-widest bg-accent-blue/10 px-2 py-1 rounded-md">
              Select One
            </span>
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

        {/* ROOMS DUAL GRID */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-text-primary tracking-tight">Rooms</h2>
              <span className="px-2 py-0.5 rounded-md bg-text-primary/5 text-text-primary text-[10px] font-black uppercase border border-border-subtle">
                {filteredRooms.length} Units
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-xl bg-bg-primary border border-border-subtle text-text-secondary">
                <Filter size={18} />
              </button>
              <button className="p-2.5 bg-text-primary text-bg-primary rounded-xl shadow-lg shadow-text-primary/10">
                <Plus size={18} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-bg-primary/30 rounded-[2rem] border border-dashed border-border-subtle">
              <Loader2 className="w-8 h-8 text-accent-blue animate-spin mb-3" />
              <p className="text-text-secondary text-[10px] font-black uppercase tracking-widest">Updating...</p>
            </div>
          ) : filteredRooms.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  currentUserId={session.user?.id || ''}
                  onBook={() => {}}
                  onCancel={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-bg-primary/30 rounded-[2rem] border border-dashed border-border-subtle">
              <p className="text-text-secondary font-black uppercase tracking-widest text-[10px]">No data for this building</p>
            </div>
          )}
        </section>
      </main>

      <Navbar />
    </div>
  );
}
