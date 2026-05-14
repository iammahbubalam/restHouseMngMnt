'use client';

import { useState } from 'react';
import { User, Clock, FileText, ChevronRight } from 'lucide-react';

interface RoomCardProps {
  room: {
    id: number;
    roomNumber: string;
    isBooked: boolean;
    booking: any;
  };
  currentUserId: string;
  onBook: () => void;
  onCancel: () => void;
}

export default function RoomCard({ room, currentUserId, onBook, onCancel }: RoomCardProps) {
  const isBookedByMe = room.isBooked && room.booking?.bookedById === currentUserId;

  return (
    <div 
      className="premium-card p-4 group flex flex-col justify-between min-h-[140px]"
      onClick={room.isBooked ? undefined : onBook}
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[8px] font-black uppercase tracking-widest text-text-secondary opacity-40">Room</span>
          <h3 className="text-xl font-black text-text-primary tracking-tighter">{room.roomNumber}</h3>
        </div>
        
        <div className={`status-badge text-[7px] py-0.5 px-2 ${
          room.isBooked 
            ? (isBookedByMe ? 'bg-accent-blue/10 text-accent-blue' : 'bg-accent-red/10 text-accent-red') 
            : 'bg-accent-green/10 text-accent-green'
        }`}>
          {room.isBooked ? (isBookedByMe ? 'MINE' : 'OCC') : 'AVAIL'}
        </div>
      </div>

      <div className="mt-3">
        {room.isBooked ? (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] text-text-secondary">
              <User size={10} className="opacity-40" />
              <span className="font-bold text-text-primary truncate">{room.booking?.bookedByName}</span>
            </div>
            
            {isBookedByMe && (
              <button 
                onClick={(e) => { e.stopPropagation(); onCancel(); }}
                className="w-full py-1.5 rounded-lg border border-accent-red/20 text-accent-red text-[8px] font-black uppercase tracking-widest hover:bg-accent-red hover:text-white transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[8px] text-accent-blue font-black uppercase tracking-widest group-hover:gap-1.5 transition-all">
              Book Now
              <ChevronRight size={12} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
