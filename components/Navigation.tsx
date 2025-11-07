'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { logout } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';

// Modern SVG Icons
const InboxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
  </svg>
);

const SentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const ComposeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  const navItems = [
    { href: '/inbox', label: 'Inbox', icon: <InboxIcon /> },
    { href: '/sent', label: 'Sent', icon: <SentIcon /> },
    { href: '/compose', label: 'Compose', icon: <ComposeIcon /> },
  ];

  return (
    <nav className="glass-effect shadow-lg relative" style={{ borderBottom: `1px solid var(--border)` }}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent opacity-5" style={{ '--tw-gradient-from': 'var(--primary)', '--tw-gradient-to': 'var(--primary)' } as React.CSSProperties}></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-12">
            <Link href="/inbox" className="flex items-center space-x-3 group transition-all hover:scale-105">
              <div className="text-primary transition-all group-hover:scale-110" style={{ color: 'var(--primary)' }}>
                <HeartIcon />
              </div>
              <span className="text-2xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
                Love Letters
              </span>
            </Link>

            <div className="flex space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-5 py-2.5 rounded-xl flex items-center space-x-2.5 transition-all duration-300 font-medium ${
                    pathname === item.href ? 'shadow-lg' : 'hover:scale-105'
                  }`}
                  style={pathname === item.href ? {
                    background: 'var(--primary)',
                    color: 'var(--background)',
                    boxShadow: '0 0 20px var(--primary)'
                  } : {
                    color: 'var(--text-muted)',
                    background: 'transparent'
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{user.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm rounded-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2 group"
              style={{
                color: 'var(--text-muted)',
                background: 'var(--accent)'
              }}
            >
              <LogoutIcon />
              <span className="group-hover:text-foreground transition-colors" style={{ color: 'var(--foreground)' }}>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
