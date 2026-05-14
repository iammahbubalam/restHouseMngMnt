'use client';

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Users, 
  Calendar, 
  FileText,
  ChevronRight,
  Loader,
  X
} from 'lucide-react';
import Navbar from "@/components/Navbar";
import { format } from 'date-fns';

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const [isExporting, setIsExporting] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Export Modal State
  const [showExportModal, setShowExportModal] = useState(false);
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-01'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/reports');
        const data = await response.json();
        if (response.ok) setReportData(data);
      } catch (e) {
        console.error('Failed to fetch reports', e);
      } finally {
        setLoading(false);
      }
    };
    if (status === "authenticated") fetchReports();
  }, [status]);

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const url = `/api/reports/export?startDate=${startDate}&endDate=${endDate}`;
      const response = await fetch(url);
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `Audit_Log_${startDate}_to_${endDate}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setShowExportModal(false);
      }
    } catch (e) {
      console.error('Download failed', e);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary">
        <Loader className="w-8 h-8 text-accent-blue animate-spin" />
      </div>
    );
  }

  const iconMap: Record<string, any> = { TrendingUp, Users, BarChart3 };

  return (
    <div className="min-h-screen bg-bg-primary pb-44">
      {/* HEADER */}
      <header className="relative px-6 pt-12 pb-4">
        <div className="max-w-screen-xl mx-auto flex justify-between items-end">
          <div className="animate-in slide-in-from-left duration-700">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-blue mb-1.5">ANALYTICS</p>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Reports</h1>
          </div>
          <div className="h-11 w-11 rounded-xl bg-bg-card border border-white/10 shadow-2xl flex items-center justify-center animate-in slide-in-from-right duration-700">
             <FileText size={22} className="text-white opacity-90" />
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-6 space-y-10">
        
        {/* BOXY KPI GRID */}
        <section className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
          {reportData?.kpis?.map((kpi: any, i: number) => {
            const IconComp = iconMap[kpi.icon] || BarChart3;
            const cleanLabel = kpi.label === 'ACTIVE GUESTS' ? 'STAFF ACTIVE' : kpi.label;
            return (
              <div key={i} className="p-4 space-y-4 bg-bg-card/60 border border-white/10 shadow-xl rounded-xl">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg bg-white/5 ${kpi.color}`}>
                    <IconComp size={18} />
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${kpi.color}`}>
                    {kpi.trend}
                  </span>
                </div>
                <div>
                  <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">{cleanLabel}</p>
                  <h4 className="text-3xl font-black text-white tracking-tighter leading-none">{kpi.value}</h4>
                </div>
              </div>
            );
          })}
          
          <button 
            onClick={() => setShowExportModal(true)}
            className="p-4 bg-white rounded-xl flex flex-col justify-between active:scale-[0.98] transition-all text-left shadow-2xl group border-2 border-transparent hover:border-accent-blue/20"
          >
            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center text-black group-hover:scale-110 transition-transform">
              <Download size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[8px] font-black text-black/40 uppercase tracking-[0.2em] mb-1">BULK DATA</p>
              <h4 className="text-[14px] font-black text-black tracking-tight uppercase leading-none">Export CSV</h4>
            </div>
          </button>
        </section>

        {/* PERFORMANCE SECTION (BOXY) */}
        <section className="space-y-4 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-black text-white uppercase tracking-[0.3em] opacity-80">Performance</h2>
            <div className="bg-bg-card px-3 py-1.5 rounded-lg text-[8px] font-black text-white uppercase tracking-[0.2em] border border-white/10 shadow-lg">
              WEEKLY TREND
            </div>
          </div>
          
          <div className="p-8 bg-bg-card/40 border border-white/10 min-h-[180px] flex items-center justify-center relative shadow-xl rounded-xl">
            <div className="flex items-end gap-3 h-24">
              {reportData?.weeklyStats?.map((stat: any, i: number) => (
                <div key={i} className="w-6 bg-white/5 rounded-t-md relative group">
                  <div 
                    style={{ height: `${Math.max(15, (stat.count / 10) * 100)}%` }} 
                    className="absolute bottom-0 left-0 right-0 bg-accent-blue rounded-t-md transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  ></div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[7px] font-black text-white uppercase tracking-tighter opacity-40">
                    {format(new Date(stat.date), 'EEE')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MANAGEMENT LOG LIST (BOXY) */}
        <section className="space-y-4 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
          <h2 className="text-[11px] font-black text-white uppercase tracking-[0.3em] opacity-80 px-1">Management Log</h2>
          <div className="space-y-2.5">
            {reportData?.recentActivity?.map((act: any, i: number) => (
              <div key={i} className="p-4 flex items-center justify-between border border-white/10 bg-bg-card/30 active:scale-[0.99] transition-all shadow-xl rounded-xl hover:border-white/20 group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-white border border-white/10 shadow-inner">
                    <Calendar size={18} className="opacity-40" />
                  </div>
                  <div>
                    <h5 className="text-[13px] font-black text-white uppercase tracking-tight leading-none mb-1">{act.guest}</h5>
                    <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Unit {act.room} • {format(new Date(act.date), 'dd MMM')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-black text-accent-blue uppercase tracking-[0.2em]">{act.type}</span>
                  <ChevronRight size={16} className="text-white opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* EXPORT MODAL (BOXY PREMIUM) */}
      {showExportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500" onClick={() => setShowExportModal(false)}></div>
          <div className="relative bg-bg-card w-full max-w-[340px] rounded-2xl overflow-hidden shadow-2xl border border-white/15 animate-in zoom-in duration-300">
            <div className="p-7 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-black/20 flex items-center justify-center text-white border border-white/10 shadow-inner">
                  <Download size={22} />
                </div>
                <div>
                  <h3 className="text-[16px] font-black text-white tracking-tighter uppercase leading-none mb-1.5">Audit Export</h3>
                  <p className="text-[8px] font-black text-accent-blue uppercase tracking-[0.3em]">SELECT DATA RANGE</p>
                </div>
              </div>
              <button onClick={() => setShowExportModal(false)} className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-7 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-white/40 uppercase tracking-widest ml-1">Start Date</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[11px] text-white focus:border-accent-blue focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-white/40 uppercase tracking-widest ml-1">End Date</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-[11px] text-white focus:border-accent-blue focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-5 bg-accent-blue/5 border border-accent-blue/10 rounded-xl">
                 <p className="text-[10px] font-medium text-white/80 leading-relaxed italic text-center">
                   Export includes detailed staff activity, unit assignments, and management audit notes.
                 </p>
              </div>

              <button 
                onClick={handleDownload}
                disabled={isExporting}
                className="w-full py-4.5 bg-white text-black font-black text-[9px] uppercase tracking-[0.4em] rounded-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isExporting ? <Loader className="animate-spin" size={16} /> : <Download size={16} />}
                {isExporting ? 'GENERATING...' : 'DOWNLOAD AUDIT LOG'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
}
