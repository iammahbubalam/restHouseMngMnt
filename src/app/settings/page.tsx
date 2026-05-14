'use client';

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { 
  Shield, 
  LogOut, 
  ChevronRight, 
  Settings as SettingsIcon,
  Database
} from 'lucide-react';
import Navbar from "@/components/Navbar";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [imgError, setImgError] = useState(false);

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
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-blue mb-1.5">ADMINISTRATION</p>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Account</h1>
          </div>
          <div className="h-11 w-11 rounded-xl bg-bg-card border border-white/10 shadow-2xl flex items-center justify-center animate-in slide-in-from-right duration-700">
             <SettingsIcon size={22} className="text-white opacity-90" />
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-6 space-y-8">
        
        {/* BOXY PROFILE (HIGH CONTRAST) */}
        <section className="animate-in fade-in slide-in-from-bottom duration-700 delay-100">
          <div className="p-8 flex flex-col items-center text-center space-y-6 bg-bg-card/60 border border-white/10 shadow-2xl relative overflow-hidden rounded-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-accent-blue shadow-[0_0_15px_rgba(0,183,255,0.5)]"></div>
            
            <div className="h-24 w-24 rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl relative bg-bg-surface flex items-center justify-center group">
                {session?.user?.image && !imgError ? (
                  <img 
                    src={session.user.image} 
                    alt="Profile" 
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-3xl font-black text-white bg-accent-blue/30 border border-accent-blue/20">
                    {session?.user?.name?.charAt(0) || 'A'}
                  </div>
                )}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
                {session?.user?.name || 'Authorized Admin'}
              </h2>
              <p className="text-[11px] font-black text-accent-blue uppercase tracking-[0.4em] opacity-80">{session?.user?.email}</p>
            </div>
            
            <div className="flex gap-2.5">
               <div className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 text-[8px] font-black text-white uppercase tracking-[0.3em]">
                 Level 9 Access
               </div>
               <div className="px-5 py-2 rounded-lg bg-accent-green/10 border border-accent-green/20 text-[8px] font-black text-accent-green uppercase tracking-[0.3em]">
                 Verified
               </div>
            </div>
          </div>
        </section>

        {/* SECURITY STATUS (MINIMAL) */}
        <section className="space-y-4 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] px-1 opacity-40">System Context</h3>
          <div className="grid grid-cols-2 gap-3">
             <div className="p-5 bg-bg-card/40 border border-white/10 rounded-xl space-y-3">
                <Shield size={18} className="text-accent-blue opacity-60" />
                <div>
                   <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Status</p>
                   <p className="text-[11px] font-black text-white uppercase tracking-tight">Whitelisted</p>
                </div>
             </div>
             <div className="p-5 bg-bg-card/40 border border-white/10 rounded-xl space-y-3">
                <Database size={18} className="text-accent-green opacity-60" />
                <div>
                   <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Network</p>
                   <p className="text-[11px] font-black text-white uppercase tracking-tight">Active Node</p>
                </div>
             </div>
          </div>
        </section>

        {/* LOGOUT ACTION (BOXY & LOUD) */}
        <section className="pt-4 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full p-5 bg-white border border-white flex items-center justify-between group active:scale-[0.98] transition-all shadow-2xl rounded-xl"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-black flex items-center justify-center text-white">
                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              </div>
              <div className="text-left">
                 <p className="text-[8px] font-black text-black/40 uppercase tracking-[0.2em] mb-1">Session Management</p>
                 <span className="text-[12px] font-black text-black uppercase tracking-[0.3em]">Sign Out & Lock</span>
              </div>
            </div>
            <ChevronRight size={20} className="text-black opacity-20 group-hover:opacity-100 transition-opacity" />
          </button>
        </section>

      </main>

      <Navbar />
    </div>
  );
}
