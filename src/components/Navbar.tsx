'use client';

import { useState } from 'react';
import { Home, Calendar, Users, Settings, FileText } from 'lucide-react';

export default function Navbar() {
  const [active, setActive] = useState('Home');

  const navItems = [
    { name: 'Home', icon: Home },
    { name: 'Bookings', icon: Calendar },
    { name: 'Guests', icon: Users },
    { name: 'Reports', icon: FileText },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-header px-6 pb-8 pt-4">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {navItems.map((item) => {
          const IsActive = active === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className="flex flex-col items-center gap-1 relative group"
            >
              <div className={`
                p-2 rounded-2xl transition-all duration-300
                ${IsActive ? 'bg-white text-black scale-110 shadow-xl shadow-white/10' : 'text-text-secondary opacity-40'}
              `}>
                <item.icon size={22} strokeWidth={IsActive ? 2.5 : 2} />
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest transition-opacity duration-300 ${IsActive ? 'opacity-100 mt-1' : 'opacity-0'}`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
      <div className="h-4 w-full md:hidden"></div>
    </nav>
  );
}
