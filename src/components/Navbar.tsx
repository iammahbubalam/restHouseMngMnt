'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Users, Settings, FileText } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'History', icon: Calendar, path: '/bookings' },
    { name: 'Staff', icon: Users, path: '/guests' },
    { name: 'Reports', icon: FileText, path: '/reports' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-3xl px-6 pb-10 pt-6 border-t border-white/10 shadow-[0_-20px_40px_rgba(0,0,0,0.4)]">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className="flex flex-col items-center gap-2.5 relative group active:scale-90 transition-transform"
            >
              <div className={`
                p-3 rounded-2xl transition-all duration-500
                ${isActive ? 'bg-white text-black scale-110 shadow-[0_0_30px_rgba(255,255,255,0.3)]' : 'text-white opacity-50 group-hover:opacity-100'}
              `}>
                <item.icon size={22} strokeWidth={isActive ? 3 : 2.5} />
              </div>
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${isActive ? 'text-white scale-110' : 'text-white/40 group-hover:text-white/80'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
