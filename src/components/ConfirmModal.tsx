'use client';

import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  isDestructive?: boolean;
}

export default function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  onClose, 
  onConfirm, 
  confirmLabel = 'Confirm',
  isDestructive = false
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      {/* Premium Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Compact Native Modal */}
      <div className="relative bg-bg-card w-full max-w-[320px] rounded-xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-white/5 animate-in zoom-in duration-200">
        <div className="p-6 text-center space-y-4">
          {/* Icon */}
          <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center border ${
            isDestructive ? 'bg-accent-red/10 border-accent-red/20 text-accent-red' : 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue'
          }`}>
            <AlertTriangle size={24} />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-black text-white tracking-tight uppercase">{title}</h3>
            <p className="text-[10px] font-medium text-text-secondary leading-relaxed px-2">
              {message}
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button 
              onClick={onConfirm}
              className={`w-full py-3 rounded-lg font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all shadow-lg ${
                isDestructive ? 'bg-accent-red text-white' : 'bg-white text-black'
              }`}
            >
              {confirmLabel}
            </button>
            <button 
              onClick={onClose}
              className="w-full py-3 rounded-lg bg-white/5 text-text-secondary font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
