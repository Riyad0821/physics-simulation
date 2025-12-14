'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Physics Simulation', icon: '⚛️' },
  { href: '/solar-system', label: 'Solar System', icon: '🪐' },
  { href: '/galaxy', label: 'Galaxy', icon: '🌌' },
  { href: '/realistic-galaxy', label: 'Realistic Galaxy', icon: '✨' },
  { href: '/linux-simulation', label: 'Linux Simulator', icon: '🐧' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo / Title */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-white font-medium hover:text-blue-400 transition-colors"
          >
            <span className="text-xl">🌌</span>
            <span className="text-sm tracking-wide">WebGL Simulations</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
