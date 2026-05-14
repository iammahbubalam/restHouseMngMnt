'use client';

import { format, addDays, subDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface DateStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function DateStrip({ selectedDate, onSelectDate }: DateStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Generate a window of 14 days (7 before, 7 after)
  const today = new Date();
  const dates = Array.from({ length: 15 }).map((_, i) => addDays(subDays(today, 7), i));

  // Center the selected date on load
  useEffect(() => {
    if (scrollRef.current) {
      const selectedEl = scrollRef.current.querySelector('[data-selected="true"]');
      if (selectedEl) {
        selectedEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [selectedDate]);

  return (
    <div className="flex items-center w-full py-4 bg-bg-primary border-b border-border-subtle sticky top-0 z-10">
      <button 
        onClick={() => onSelectDate(subDays(selectedDate, 1))}
        className="p-2 text-text-secondary hover:text-text-primary transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      
      <div 
        ref={scrollRef}
        className="flex-1 flex overflow-x-auto no-scrollbar gap-3 px-2 snap-x"
      >
        {dates.map((date, i) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          
          return (
            <button
              key={i}
              data-selected={isSelected}
              onClick={() => onSelectDate(date)}
              className={`
                flex flex-col items-center justify-center min-w-[60px] h-[70px] rounded-xl snap-center transition-all duration-200
                ${isSelected 
                  ? 'bg-accent-green text-bg-primary shadow-[0_0_15px_rgba(52,211,153,0.3)] font-bold' 
                  : 'glass-card text-text-secondary hover:bg-bg-glass hover:text-text-primary'
                }
              `}
            >
              <span className="text-xs uppercase tracking-wider">{format(date, 'EEE')}</span>
              <span className="text-xl">{format(date, 'd')}</span>
              {isToday && !isSelected && (
                <span className="w-1 h-1 rounded-full bg-accent-amber mt-1"></span>
              )}
            </button>
          );
        })}
      </div>

      <button 
        onClick={() => onSelectDate(addDays(selectedDate, 1))}
        className="p-2 text-text-secondary hover:text-text-primary transition-colors"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
