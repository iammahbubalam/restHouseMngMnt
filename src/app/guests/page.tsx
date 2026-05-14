'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from "next-auth/react";
import { 
  ShieldCheck, 
  Search, 
  Mail, 
  History, 
  ChevronRight, 
  X,
  Loader,
  Clock,
  User
} from 'lucide-react';
import Navbar from "@/components/Navbar";
import { format } from 'date-fns';

// --- TYPES ---
interface StaffRecord {
  id: string;
  name: string;
  email: string;
  total_bookings: string;
  last_visit: string;
}

export default function StaffPage() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [staff, setStaff] = useState<StaffRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<StaffRecord | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('/api/guests');
        const data = await response.json();
        if (response.ok) setStaff(data);
      } catch (e) {
        console.error('Failed to fetch staff', e);
      } finally {
        setLoading(false);
      }
    };
    if (status === "authenticated") fetchStaff();
  }, [status]);

  const filteredStaff = useMemo(() => {
    return staff.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [staff, searchQuery]);

  if (status === "unauthenticated") {
    if (typeof window !== 'undefined') window.location.href = "/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-44">
      {/* HEADER */}
      <header className="relative px-6 pt-12 pb-4">
        <div className="max-w-screen-xl mx-auto flex justify-between items-end">
          <div className="animate-in slide-in-from-left duration-700">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-blue mb-1.5">MANAGEMENT</p>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Staff</h1>
          </div>
          <div className="h-11 w-11 rounded-xl bg-bg-card border border-white/10 shadow-2xl flex items-center justify-center animate-in slide-in-from-right duration-700">
             <ShieldCheck size={22} className="text-white opacity-90" />
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-6 space-y-8">
        
        {/* SEARCH BAR (BOXY) */}
        <div className="relative group animate-in fade-in slide-in-from-bottom duration-700 delay-100">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-accent-blue transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="SEARCH STAFF NAME OR EMAIL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-card/40 border border-white/10 rounded-xl py-5 pl-14 pr-6 text-[11px] font-black uppercase tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-accent-blue/50 transition-all shadow-2xl"
          />
        </div>

        {/* STAFF LIST (BOXY GRID) */}
        <section className="space-y-4 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-black text-white uppercase tracking-[0.3em] opacity-80">Staff Roster</h2>
            <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-white uppercase tracking-widest">
              {filteredStaff.length} MANAGERS
            </div>
          </div>

          <div className="space-y-2.5">
            {loading ? (
              <div className="flex justify-center py-24">
                <Loader className="animate-spin text-accent-blue opacity-50" size={32} />
              </div>
            ) : filteredStaff.length > 0 ? (
              filteredStaff.map((s) => (
                <div 
                  key={s.id} 
                  onClick={() => setSelectedStaff(s)}
                  className="p-4 border border-white/10 bg-bg-card/60 active:scale-[0.99] transition-all shadow-xl hover:border-white/20 group cursor-pointer rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-white border border-white/10 group-hover:border-accent-blue/50 transition-colors">
                      <User size={20} className="opacity-40" />
                    </div>
                    <div>
                      <h5 className="text-[14px] font-black text-white uppercase tracking-tight leading-none mb-1.5">{s.name}</h5>
                      <p className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-40">STAFF ID: {s.id.split('-')[0]}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-[11px] font-black text-white leading-none mb-1">{s.total_bookings}</span>
                      <span className="text-[7px] font-black text-accent-blue uppercase tracking-widest opacity-60">ACTIONS</span>
                    </div>
                    <ChevronRight size={18} className="text-white opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-32 bg-bg-card/20 rounded-2xl border border-dashed border-white/20">
                <p className="text-white text-[11px] font-black uppercase tracking-[0.3em] opacity-40">No Staff Found</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* STAFF DETAIL MODAL (BOXY) */}
      {selectedStaff && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setSelectedStaff(null)}></div>
          <div className="relative bg-bg-card w-full max-w-[340px] rounded-2xl overflow-hidden shadow-2xl border border-white/15 animate-in zoom-in duration-300">
            <div className="p-7 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-accent-blue/20 flex items-center justify-center text-accent-blue border border-accent-blue/30">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="text-[16px] font-black text-white tracking-tighter uppercase leading-none mb-1.5">Staff Audit</h3>
                  <p className="text-[8px] font-black text-accent-blue uppercase tracking-[0.3em]">ID: {selectedStaff.id.split('-')[0]}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStaff(null)} className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-7 space-y-8">
              <div className="space-y-1.5">
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">Full Name</p>
                <p className="text-xl font-black text-white leading-none uppercase tracking-tight">{selectedStaff.name}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-accent-blue">
                      <Mail size={18} />
                   </div>
                   <div className="overflow-hidden">
                      <p className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Contact Email</p>
                      <p className="text-[11px] font-black text-white truncate">{selectedStaff.email}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-accent-amber">
                      <Clock size={18} />
                   </div>
                   <div>
                      <p className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Last Active</p>
                      <p className="text-[11px] font-black text-white uppercase tracking-tight">
                        {format(new Date(selectedStaff.last_visit), 'dd MMM yyyy')}
                      </p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-accent-green">
                      <History size={18} />
                   </div>
                   <div>
                      <p className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Total Management</p>
                      <p className="text-[11px] font-black text-white uppercase tracking-tight">
                        {selectedStaff.total_bookings} Records Managed
                      </p>
                   </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedStaff(null)}
                className="w-full py-4.5 bg-white text-black font-black text-[9px] uppercase tracking-[0.4em] rounded-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                Close Directory
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
}
