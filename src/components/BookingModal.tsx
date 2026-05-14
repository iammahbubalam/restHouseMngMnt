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
        className="absolute inset-0 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-500"
        onClick={onClose}
      ></div>

      {/* Realistic Compact Modal */}
      <div className="relative bg-bg-card w-full max-w-[340px] rounded-[2rem] overflow-hidden shadow-[0_64px_128px_-32px_rgba(0,0,0,0.8)] border border-white/15 animate-in zoom-in duration-300">
        
        {/* Minimalist Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-accent-blue/20 flex items-center justify-center text-accent-blue border border-accent-blue/30 shadow-inner">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-[14px] font-black text-white tracking-tight uppercase leading-none mb-1.5">Room {roomNumber}</h3>
              <p className="text-[8px] font-black text-accent-blue uppercase tracking-[0.3em]">Guest Registration</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white opacity-60"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8 space-y-8">
          <div className="space-y-3">
            <label className="text-[9px] font-black text-white uppercase tracking-[0.3em] ml-1 opacity-80">
              Guest Name & Details
            </label>
            <textarea
              autoFocus
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="E.G. JOHN DOE - VIP ACCESS"
              className="w-full h-32 bg-black/40 border border-white/15 rounded-2xl p-5 text-white text-[12px] font-black uppercase tracking-tight focus:outline-none focus:border-accent-blue transition-all resize-none placeholder:text-white/30 leading-relaxed shadow-inner"
            />
          </div>

          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all border border-white/10"
            >
              Cancel
            </button>
            <button 
              onClick={() => onConfirm(comment)}
              className="flex-[2] py-4 rounded-2xl bg-white text-black font-black text-[9px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Confirm
              <Send size={12} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
