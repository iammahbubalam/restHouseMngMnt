'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from "next-auth/react";
import { 
  Search, 
  Filter, 
  Calendar, 
  ChevronRight, 
  Loader,
  Hash,
  X,
  User as UserIcon,
  Clock,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Download
} from 'lucide-react';
import Navbar from "@/components/Navbar";
import { format } from 'date-fns';

// --- TYPES ---
interface BookingRecord {
  id: string;
  creator_name: string;
  room_number: string;
  booking_date: string;
  note: string;
  created_at: string;
}

export default function BookingsPage() {
  const { data: session, status } = useSession();
  
  // State for List & Pagination
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Modals
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [creators, setCreators] = useState<{id: string, name: string}[]>([]);
  const [showCreatorDropdown, setShowCreatorDropdown] = useState(false);

  const limit = 40;

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch('/api/bookings/filters');
        const data = await response.json();
        if (response.ok) setCreators(data.creators);
      } catch (e) {
        console.error('Failed to fetch creators', e);
      }
    };
    if (status === "authenticated") fetchFilters();
  }, [status]);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      let url = `/api/bookings?limit=${limit}&offset=${offset}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (creatorId) url += `&creatorId=${creatorId}`;
      if (startDate && endDate) url += `&startDate=${startDate}&endDate=${endDate}`;
      
      const response = await fetch(url);
      const result = await response.json();
      if (response.ok) {
        setBookings(result.data);
        setTotal(result.total);
      }
    } catch (e) {
      console.error('Failed to fetch history', e);
    } finally {
      setLoading(false);
    }
  }, [page, search, creatorId, startDate, endDate]);

  useEffect(() => {
    if (status === "authenticated") fetchHistory();
  }, [status, fetchHistory]);

  if (status === "unauthenticated") {
    if (typeof window !== 'undefined') window.location.href = "/login";
    return null;
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-bg-primary pb-44">
      {/* HEADER */}
      <header className="relative px-6 pt-12 pb-4">
        <div className="max-w-screen-xl mx-auto flex justify-between items-end">
          <div className="animate-in slide-in-from-left duration-700">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-blue mb-1.5">AUDIT LOG</p>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">History</h1>
          </div>
          <div className="flex gap-2 animate-in slide-in-from-right duration-700">
             <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all border ${showFilters ? 'bg-accent-blue border-accent-blue text-white shadow-xl shadow-accent-blue/30' : 'bg-bg-card border-white/10 text-white'}`}
             >
                <Filter size={18} />
             </button>
             <div className="h-11 w-11 rounded-xl bg-bg-card border border-white/10 shadow-2xl flex items-center justify-center">
                <Hash size={22} className="text-white opacity-80" />
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-6 space-y-8">
        
        {/* COMPACT FILTER SUITE (BOXY) */}
        {showFilters && (
          <section className="space-y-4 animate-in slide-in-from-top duration-500 bg-bg-card/40 p-5 rounded-2xl border border-white/10 shadow-2xl">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-white uppercase tracking-widest ml-1 opacity-60">Start Date</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[11px] text-white focus:border-accent-blue focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-white uppercase tracking-widest ml-1 opacity-60">End Date</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[11px] text-white focus:border-accent-blue focus:outline-none"
                />
              </div>
            </div>
            
            {/* CUSTOM PREMIUM DROPDOWN */}
            <div className="space-y-1.5 relative">
              <label className="text-[8px] font-black text-white uppercase tracking-widest ml-1 opacity-60">Created By (Admin)</label>
              <button 
                onClick={() => setShowCreatorDropdown(!showCreatorDropdown)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[11px] font-black text-white uppercase tracking-widest flex items-center justify-between active:scale-[0.99] transition-all"
              >
                <span>{creators.find(c => c.id === creatorId)?.name || 'All Administrators'}</span>
                <ChevronRight className={`transition-transform duration-300 ${showCreatorDropdown ? 'rotate-90' : ''}`} size={16} />
              </button>
              
              {showCreatorDropdown && (
                <div className="absolute top-[105%] left-0 right-0 z-[60] bg-bg-card border border-white/15 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div 
                    onClick={() => { setCreatorId(''); setPage(1); setShowCreatorDropdown(false); }}
                    className="p-4 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 cursor-pointer border-b border-white/5 transition-colors"
                  >
                    All Administrators
                  </div>
                  {creators.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => { setCreatorId(c.id); setPage(1); setShowCreatorDropdown(false); }}
                      className="p-4 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 cursor-pointer border-b last:border-0 border-white/5 transition-colors"
                    >
                      {c.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input 
                type="text" 
                placeholder="SEARCH GUEST OR ROOM..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-6 text-[11px] font-black uppercase tracking-widest text-white placeholder:text-white/20 focus:border-accent-blue/50 focus:outline-none transition-all"
              />
            </div>
            <button 
              onClick={() => { setStartDate(''); setEndDate(''); setSearch(''); setCreatorId(''); setPage(1); }}
              className="w-full py-3.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-[0.2em] active:scale-95 transition-all hover:bg-white/10"
            >
              Reset All Filters
            </button>
          </section>
        )}

        {/* COMPACT LEDGER GRID (BOXY) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-black text-white uppercase tracking-[0.3em] opacity-80">
              {total} Total History
            </h2>
            <div className="flex items-center gap-4">
               <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Page {page} / {totalPages || 1}</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {loading ? (
              <div className="flex justify-center py-24">
                <Loader className="animate-spin text-accent-blue opacity-50" size={32} />
              </div>
            ) : bookings.length > 0 ? (
              bookings.map((b) => (
                <div 
                  key={b.id} 
                  onClick={() => setSelectedBooking(b)}
                  className="p-4 flex items-center justify-between border border-white/10 bg-bg-card/60 active:scale-[0.99] transition-all shadow-xl hover:border-white/20 group cursor-pointer rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-white/5 flex flex-col items-center justify-center border border-white/10 group-hover:border-accent-blue/50 transition-colors">
                      <span className="text-[6px] font-black text-white opacity-40 uppercase leading-none mb-0.5">Unit</span>
                      <span className="text-sm font-black text-white leading-none tracking-tighter">{b.room_number}</span>
                    </div>
                    <div>
                      <h5 className="text-[13px] font-black text-white uppercase tracking-tight leading-none mb-1.5">{b.creator_name}</h5>
                      <div className="flex items-center gap-3">
                        <p className="text-[8px] font-black text-accent-blue uppercase tracking-[0.2em]">{format(new Date(b.booking_date), 'dd MMM yyyy')}</p>
                        {b.note && <div className="h-1 w-1 rounded-full bg-white/20"></div>}
                        {b.note && <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">HAS NOTE</span>}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-white opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              ))
            ) : (
              <div className="text-center py-32 bg-bg-card/20 rounded-2xl border border-dashed border-white/20">
                <p className="text-white text-[11px] font-black uppercase tracking-[0.3em] opacity-40">No Records Found</p>
              </div>
            )}
          </div>
        </section>

        {/* PAGINATION FOOTER */}
        {!loading && totalPages > 1 && (
          <section className="flex justify-center gap-3 pt-4">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="h-11 w-11 rounded-xl bg-bg-card border border-white/10 flex items-center justify-center text-white disabled:opacity-20 active:scale-90 transition-all shadow-xl"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="h-11 px-5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white uppercase tracking-widest">
              {page}
            </div>
            <button 
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="h-11 w-11 rounded-xl bg-bg-card border border-white/10 flex items-center justify-center text-white disabled:opacity-20 active:scale-90 transition-all shadow-xl"
            >
              <ChevronRightIcon size={18} />
            </button>
          </section>
        )}
      </main>

      {/* TRANSACTION DETAIL MODAL (BOXY) */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setSelectedBooking(null)}></div>
          <div className="relative bg-bg-card w-full max-w-[360px] rounded-2xl overflow-hidden shadow-2xl border border-white/15 animate-in zoom-in duration-300">
            <div className="p-7 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-accent-blue/20 flex items-center justify-center text-accent-blue border border-accent-blue/30">
                  <Hash size={22} />
                </div>
                <div>
                  <h3 className="text-[16px] font-black text-white tracking-tighter uppercase leading-none mb-1.5">Booking Details</h3>
                  <p className="text-[8px] font-black text-accent-blue uppercase tracking-[0.3em]">ID: {selectedBooking.id.split('-')[0]}</p>
                </div>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-7 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Room Number</p>
                  <p className="text-xl font-black text-white leading-none">Unit {selectedBooking.room_number}</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Visit Date</p>
                  <p className="text-[13px] font-black text-white uppercase">{format(new Date(selectedBooking.booking_date), 'dd MMM yyyy')}</p>
                </div>
              </div>

              <div className="space-y-2.5 bg-black/40 p-5 rounded-xl border border-white/5 shadow-inner">
                <p className="text-[8px] font-black text-accent-blue uppercase tracking-[0.3em]">Administrator Note</p>
                <p className="text-[11px] font-medium text-white leading-relaxed italic">
                  "{selectedBooking.note || 'No additional notes provided for this transaction.'}"
                </p>
              </div>

              <div className="space-y-5 pt-2">
                <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-accent-green">
                      <UserIcon size={18} />
                   </div>
                   <div>
                      <p className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Created By</p>
                      <p className="text-[11px] font-black text-white uppercase tracking-tight">{selectedBooking.creator_name}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-accent-amber">
                      <Clock size={18} />
                   </div>
                   <div>
                      <p className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Creation Time</p>
                      <p className="text-[11px] font-black text-white uppercase tracking-tight">
                        {format(new Date(selectedBooking.created_at), 'dd MMM yyyy • HH:mm')}
                      </p>
                   </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedBooking(null)}
                className="w-full py-4.5 bg-white text-black font-black text-[9px] uppercase tracking-[0.4em] rounded-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
}
