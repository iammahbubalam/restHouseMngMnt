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
  
  // STRICT 7-day window starting from Today
  const today = new Date();
  const next7Days = Array.from({ length: 7 }).map((_, i) => addDays(today, i));

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(viewDate)),
    end: endOfWeek(endOfMonth(viewDate))
  });

  return (
    <div className="bg-bg-primary sticky top-0 z-30 border-b border-border-subtle px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-text-primary">
          {format(selectedDate, 'MMMM yyyy')}
        </h2>
        <button 
          onClick={() => setShowCalendar(true)}
          className="p-2.5 rounded-xl bg-bg-secondary border border-border-subtle text-text-primary shadow-sm hover:scale-105 transition-transform"
        >
          <CalendarIcon size={20} />
        </button>
      </div>
      
      {/* STRICT 7-DAY GRID (No Scrolling) */}
      <div className="grid grid-cols-7 gap-2">
        {next7Days.map((date, i) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          
          return (
            <button
              key={i}
              onClick={() => onSelectDate(date)}
              className={`
                flex flex-col items-center justify-center py-3 rounded-2xl transition-all duration-200
                ${isSelected 
                  ? 'bg-accent-blue text-white font-bold shadow-lg shadow-accent-blue/30' 
                  : 'bg-bg-secondary text-text-secondary border border-transparent'
                }
              `}
            >
              <span className={`text-[10px] font-black uppercase tracking-tighter mb-1 ${isSelected ? 'text-white/70' : 'text-text-secondary/50'}`}>
                {format(date, 'EEE')}
              </span>
              <span className="text-base leading-none">{format(date, 'd')}</span>
            </button>
          );
        })}
      </div>

      {/* FULL SCREEN CALENDAR OVERLAY */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-bg-card w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in duration-300">
            <div className="p-6 bg-accent-blue text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black">{format(viewDate, 'MMMM yyyy')}</h3>
                <p className="text-xs opacity-70">Select any date</p>
              </div>
              <button onClick={() => setShowCalendar(false)} className="p-2 hover:bg-white/20 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <button onClick={() => setViewDate(subMonths(viewDate, 1))} className="p-1"><ChevronLeft /></button>
                <button onClick={() => setViewDate(addMonths(viewDate, 1))} className="p-1"><ChevronRight /></button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center">
                {['S','M','T','W','T','F','S'].map((d, i) => (
                  <div key={i} className="text-[10px] font-black text-text-secondary py-2">{d}</div>
                ))}
                {calendarDays.map((date, i) => {
                  const isCurrentMonth = date.getMonth() === viewDate.getMonth();
                  const isSelected = isSameDay(date, selectedDate);
                  return (
                    <button
                      key={i}
                      onClick={() => { onSelectDate(date); setShowCalendar(false); }}
                      className={`aspect-square flex items-center justify-center text-sm rounded-xl transition-all ${
                        isSelected 
                          ? 'bg-accent-blue text-white font-bold' 
                          : isCurrentMonth ? 'text-text-primary hover:bg-bg-secondary' : 'text-text-secondary opacity-30'
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
