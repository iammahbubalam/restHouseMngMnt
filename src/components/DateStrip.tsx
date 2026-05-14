'use client';

import { format, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import { useState } from 'react';

interface DateStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function DateStrip({ selectedDate, onSelectDate }: DateStripProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  
  const today = new Date();
  const next7Days = Array.from({ length: 7 }).map((_, i) => addDays(today, i));

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(viewDate)),
    end: endOfWeek(endOfMonth(viewDate))
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white tracking-tighter">
          {format(selectedDate, 'MMMM yyyy')}
        </h2>
        <button 
          onClick={() => setShowCalendar(true)}
          className="h-12 w-12 flex items-center justify-center rounded-2xl bg-bg-card border border-white/5 text-text-secondary active:scale-90 transition-all"
        >
          <CalendarIcon size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {next7Days.map((date, i) => {
          const isSelected = isSameDay(date, selectedDate);
          return (
            <button
              key={i}
              onClick={() => onSelectDate(date)}
              className={`
                flex flex-col items-center justify-center py-4 rounded-[1.25rem] transition-all duration-300 active:scale-95
                ${isSelected 
                  ? 'bg-white text-black shadow-2xl shadow-white/20' 
                  : 'bg-bg-card text-text-secondary border border-white/5'
                }
              `}
            >
              <span className={`text-[9px] font-black uppercase tracking-tighter mb-1 ${isSelected ? 'opacity-40' : 'opacity-30'}`}>
                {format(date, 'EEE')}
              </span>
              <span className="text-lg font-black tracking-tighter">{format(date, 'd')}</span>
            </button>
          );
        })}
      </div>

      {/* MODAL CALENDAR (Native Style) */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="bg-bg-card w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 animate-in zoom-in duration-300">
            <div className="p-8 pb-4 flex justify-between items-center">
              <h3 className="text-xl font-black text-white">{format(viewDate, 'MMMM yyyy')}</h3>
              <button onClick={() => setShowCalendar(false)} className="p-2 bg-bg-surface rounded-full text-text-secondary">
                <X size={20} />
              </button>
            </div>
            
            <div className="px-8 pb-8 space-y-6">
              <div className="flex justify-between">
                <button onClick={() => setViewDate(subMonths(viewDate, 1))} className="p-2 bg-bg-surface rounded-xl"><ChevronLeft size={20}/></button>
                <button onClick={() => setViewDate(addMonths(viewDate, 1))} className="p-2 bg-bg-surface rounded-xl"><ChevronRight size={20}/></button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center">
                {['S','M','T','W','T','F','S'].map((d, i) => (
                  <div key={i} className="text-[10px] font-black text-text-tertiary py-2">{d}</div>
                ))}
                {calendarDays.map((date, i) => {
                  const isCurrentMonth = date.getMonth() === viewDate.getMonth();
                  const isSelected = isSameDay(date, selectedDate);
                  return (
                    <button
                      key={i}
                      onClick={() => { onSelectDate(date); setShowCalendar(false); }}
                      className={`aspect-square flex items-center justify-center text-sm rounded-xl font-bold transition-all ${
                        isSelected 
                          ? 'bg-white text-black scale-110' 
                          : isCurrentMonth ? 'text-text-primary hover:bg-bg-surface' : 'text-text-tertiary opacity-30'
                      }`}
                    >
                      {format(date, 'd')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
