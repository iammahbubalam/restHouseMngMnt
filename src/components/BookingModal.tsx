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

  // Clear comment when modal opens/closes
  useEffect(() => {
    if (!isOpen) setComment('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-bg-card w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in duration-300">
        <div className="p-6 bg-accent-blue text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight leading-none">Book Room {roomNumber}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mt-1">Guest Entry</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-1">
              Guest Details / Remarks
            </label>
            <textarea
              autoFocus
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter guest name or special requests..."
              className="w-full h-32 bg-bg-secondary border border-border-subtle rounded-2xl p-4 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all resize-none placeholder:text-text-secondary/40 font-medium"
            />
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-bg-secondary text-text-secondary font-black text-xs uppercase tracking-widest hover:bg-border-subtle transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={() => onConfirm(comment)}
              className="flex-[2] py-4 rounded-2xl bg-text-primary text-bg-primary font-black text-xs uppercase tracking-widest shadow-xl shadow-text-primary/20 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Confirm Booking
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
