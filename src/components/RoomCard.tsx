'use client';

import { format } from 'date-fns';
import { useState } from 'react';

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
  const [isHovered, setIsHovered] = useState(false);

  let cardStyle = "glass-card hover:border-border-subtle";
  if (room.isBooked) {
    cardStyle = isBookedByMe ? "room-booked-self border-accent-amber" : "room-booked border-accent-red";
  } else {
    cardStyle = "room-available border-accent-green";
  }

  return (
    <div 
      className={`relative p-4 rounded-2xl transition-all duration-300 ${cardStyle} overflow-hidden cursor-pointer group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={room.isBooked ? undefined : onBook}
    >
      {/* Decorative gradient orb */}
      <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full blur-xl opacity-20 transition-all duration-500 ${isHovered ? 'scale-150' : 'scale-100'} ${room.isBooked ? (isBookedByMe ? 'bg-accent-amber' : 'bg-accent-red') : 'bg-accent-green'}`}></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-sm text-text-secondary font-medium tracking-wider uppercase mb-1">Room</p>
          <h3 className="text-3xl font-bold text-text-primary tracking-tight">{room.roomNumber}</h3>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${room.isBooked ? (isBookedByMe ? 'bg-accent-amber/20 text-accent-amber' : 'bg-accent-red/20 text-accent-red') : 'bg-accent-green/20 text-accent-green'}`}>
          {room.isBooked ? 'Occupied' : 'Available'}
        </div>
      </div>

      <div className="relative z-10">
        {room.isBooked ? (
          <div className="space-y-2">
            <div>
              <p className="text-xs text-text-secondary">Guest/Booked By</p>
              <p className="font-medium text-text-primary truncate">{room.booking?.bookedByName}</p>
            </div>
            
            {room.booking?.comment && (
              <div>
                <p className="text-xs text-text-secondary">Details</p>
                <p className="text-sm text-text-primary/80 line-clamp-2 italic">"{room.booking.comment}"</p>
              </div>
            )}
            
            {isBookedByMe && (
              <button 
                onClick={(e) => { e.stopPropagation(); onCancel(); }}
                className="w-full mt-3 py-2 rounded-lg bg-bg-card border border-accent-red/50 text-accent-red text-sm font-semibold hover:bg-accent-red/10 transition-colors"
              >
                Cancel Booking
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-text-secondary">Ready for guest</span>
            <button className="px-4 py-2 bg-accent-green text-bg-primary font-bold rounded-lg transform group-hover:-translate-y-1 transition-all duration-200 shadow-[0_4px_14px_0_rgba(52,211,153,0.39)]">
              Book Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
