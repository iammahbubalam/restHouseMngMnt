'use client';

import { Home, Calendar, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 w-full glass-card border-t border-border-subtle pb-safe pt-2 px-6 z-40 bg-bg-card/80 backdrop-blur-xl">
      <div className="max-w-md mx-auto flex justify-between items-center h-14">
        <button className="flex flex-col items-center justify-center w-16 text-accent-green">
          <Home size={24} />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </button>
        
        <button className="flex flex-col items-center justify-center w-16 text-text-secondary hover:text-text-primary transition-colors">
          <Calendar size={24} />
          <span className="text-[10px] font-medium mt-1">History</span>
        </button>
        
        <button className="flex flex-col items-center justify-center w-16 text-text-secondary hover:text-text-primary transition-colors">
          <User size={24} />
          <span className="text-[10px] font-medium mt-1">Profile</span>
        </button>
      </div>
      {/* Safe area spacing for iOS home indicator */}
      <div className="h-6 w-full"></div>
    </nav>
  );
}
