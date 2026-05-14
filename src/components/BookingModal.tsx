'use client';

import { X, Send, User } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
  roomNumber: string;
}

export default function BookingModal({ isOpen, onClose, onConfirm, roomNumber }: BookingModalProps) {
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!isOpen) setComment('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* High-End Backdrop blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500"
        onClick={onClose}
      ></div>

      {/* Realistic Compact Modal */}
      <div className="relative bg-bg-card w-full max-w-[340px] rounded-xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-white/5 animate-in zoom-in duration-300">
        
        {/* Minimalist Header */}
        <div className="p-5 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-accent-blue border border-white/5">
              <User size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-tight uppercase">Room {roomNumber}</h3>
              <p className="text-[7px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-40">Guest Registration</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/5 rounded-md transition-colors text-text-secondary"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 space-y-5">
          <div className="space-y-2">
            <label className="text-[7px] font-black text-text-secondary uppercase tracking-[0.2em] ml-1">
              Guest Name & Details
            </label>
            <textarea
              autoFocus
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. John Doe - VIP Guest"
              className="w-full h-24 bg-bg-surface border border-white/5 rounded-lg p-3 text-white text-[11px] focus:outline-none focus:ring-1 focus:ring-accent-blue/50 transition-all resize-none placeholder:text-text-tertiary font-medium leading-relaxed"
            />
          </div>

          <div className="flex gap-2">
            <button 
              onClick={onClose}
              className="flex-1 py-3 rounded-lg bg-white/5 text-text-secondary font-black text-[8px] uppercase tracking-widest active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={() => onConfirm(comment)}
              className="flex-[2] py-3 rounded-lg bg-white text-black font-black text-[8px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Confirm Booking
              <Send size={10} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
