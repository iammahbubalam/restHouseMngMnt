'use client';

import { useState } from 'react';
import { User, Clock, FileText, ChevronRight } from 'lucide-react';

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

interface RoomCardProps {
  room: Room;
  currentUserId: string;
  onBook: () => void;
  onCancel: () => void;
}

export default function RoomCard({ room, currentUserId, onBook, onCancel }: RoomCardProps) {
  const isBookedByMe = room.isBooked && room.booking?.bookedById === currentUserId;

  return (
    <div 
      className={`native-card p-3 flex flex-col justify-between min-h-[100px] transition-all bg-bg-card/40 ${
        !room.isBooked ? 'active:scale-[0.98] cursor-pointer' : ''
      }`}
      onClick={room.isBooked ? undefined : onBook}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[6px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-30 mb-0.5">Unit</p>
          <h3 className="text-lg font-black text-white tracking-tighter leading-none uppercase">{room.roomNumber}</h3>
        </div>
        
        <div className={`status-pill !px-1.5 !py-0.5 !text-[5px] border ${
          room.isBooked 
            ? (isBookedByMe ? 'bg-accent-blue/10 text-accent-blue border-accent-blue/20' : 'bg-accent-red/10 text-accent-red border-accent-red/20') 
            : 'bg-accent-green/10 text-accent-green border-accent-green/20'
        }`}>
          {room.isBooked ? 'BOOKED' : 'AVAILABLE'}
        </div>
      </div>

      <div className="mt-2">
        {room.isBooked ? (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 opacity-40">
              <User size={8} />
              <span className="text-[7px] font-black uppercase tracking-widest text-text-secondary truncate">
                {room.booking?.bookedByName}
              </span>
            </div>
            
            {isBookedByMe && (
              <button 
                onClick={(e) => { e.stopPropagation(); onCancel(); }}
                className="w-full py-1.5 rounded-lg bg-accent-red/5 text-accent-red text-[6px] font-black uppercase tracking-widest active:scale-90 transition-transform border border-accent-red/10"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between w-full group text-accent-blue opacity-70">
            <span className="text-[7px] font-black uppercase tracking-widest">Book Unit</span>
            <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        )}
      </div>
    </div>
  );
}
