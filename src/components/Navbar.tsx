'use client';

import { LayoutDashboard, BookOpen, Users, Settings, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { label: 'Bookings', icon: BookOpen, href: '/bookings' },
    { label: 'Guests', icon: Users, href: '/guests' },
    { label: 'Reports', icon: BarChart3, href: '/reports' },
    { label: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-bg-card border-t border-border-subtle pb-safe z-40 shadow-[0_-4px_6px_-1px_var(--color-shadow-subtle)]">
      <div className="max-w-screen-xl mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${
                isActive ? 'text-accent-blue' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <item.icon size={20} className={isActive ? 'scale-110' : 'opacity-70'} />
              <span className={`text-[10px] font-bold mt-1.5 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 w-8 h-0.5 bg-accent-blue rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
      {/* iOS Home Indicator Spacer */}
      <div className="h-4 w-full md:hidden"></div>
    </nav>
  );
}
