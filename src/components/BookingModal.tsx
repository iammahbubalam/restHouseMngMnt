'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { X, Calendar as CalendarIcon, User } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => Promise<void>;
  roomNumber: string;
  date: Date;
  isSubmitting: boolean;
}

export default function BookingModal({ isOpen, onClose, onConfirm, roomNumber, date, isSubmitting }: BookingModalProps) {
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/80 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-border-subtle bg-bg-card/50">
          <h2 className="text-xl font-bold text-text-primary">Book Room {roomNumber}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-glass transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          <div className="flex items-center gap-4 p-4 rounded-xl bg-bg-glass/50 border border-border-subtle/50">
            <div className="w-12 h-12 rounded-full bg-accent-green/20 flex items-center justify-center text-accent-green">
              <CalendarIcon size={24} />
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider">Date</p>
              <p className="text-lg font-medium text-text-primary">{format(date, 'EEEE, MMMM d, yyyy')}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
              <User size={16} /> Guest Details & Comments
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="E.g., John Doe - Needs extra pillows"
              className="w-full min-h-[120px] p-4 rounded-xl bg-bg-primary border border-border-subtle text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent-green/50 transition-all resize-none"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border-subtle flex gap-3 bg-bg-card/50">
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-xl font-medium text-text-secondary hover:text-text-primary hover:bg-bg-glass transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={() => onConfirm(comment)}
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-xl font-bold bg-accent-green text-bg-primary hover:bg-accent-green/90 transition-colors disabled:opacity-50 shadow-[0_4px_14px_0_rgba(52,211,153,0.39)] flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-bg-primary border-t-transparent rounded-full animate-spin"></span>
            ) : 'Confirm Booking'}
          </button>
        </div>

      </div>
    </div>
  );
}
