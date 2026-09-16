'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Target, PlusCircle, Trophy, User } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const archerNav: NavItem[] = [
  { href: '/', label: 'Home', icon: <Home size={22} /> },
  { href: '/sessions', label: 'Sessions', icon: <Target size={22} /> },
  { href: '/me', label: 'My Stats', icon: <Trophy size={22} /> },
  { href: '/profile', label: 'Profile', icon: <User size={22} /> },
];

const organizerNav: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <Home size={22} /> },
  { href: '/sessions', label: 'Sessions', icon: <Target size={22} /> },
  { href: '/sessions/create', label: 'Create', icon: <PlusCircle size={22} /> },
  { href: '/me', label: 'Stats', icon: <Trophy size={22} /> },
  { href: '/profile', label: 'Profile', icon: <User size={22} /> },
];

interface BottomNavProps {
  role?: 'archer' | 'organizer';
}

export default function BottomNav({ role = 'archer' }: BottomNavProps) {
  const pathname = usePathname();
  const items = role === 'organizer' ? organizerNav : archerNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-charcoal-800">
      <div className="mx-auto max-w-lg flex items-center justify-around h-16">
        {items.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-0.5
                min-w-[56px] py-1.5 rounded-xl
                transition-all duration-200
                ${isActive
                  ? 'text-sand-400'
                  : 'text-charcoal-500 hover:text-sand-300'}
              `}
            >
              <span className={isActive ? 'scale-110 transition-transform' : ''}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
      {/* Safe area spacer for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
