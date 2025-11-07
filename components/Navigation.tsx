'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { logout } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';

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
    { href: '/inbox', label: 'Inbox', icon: '📥' },
    { href: '/sent', label: 'Sent', icon: '📤' },
    { href: '/compose', label: 'Compose', icon: '✍️' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/inbox" className="flex items-center space-x-2">
              <span className="text-2xl">💌</span>
              <span className="text-xl font-bold text-gray-800">Love Letters</span>
            </Link>

            <div className="flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition ${
                    pathname === item.href
                      ? 'bg-purple-100 text-purple-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, <span className="font-semibold">{user.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
