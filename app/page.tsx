'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/inbox');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--background-gradient-from) 0%, var(--background-gradient-to) 100%)' }}>
      <div className="text-center animate-fade-in">
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center animate-pulse" style={{
            background: 'var(--surface-glass)',
            border: '2px solid var(--border)',
            boxShadow: '0 0 40px var(--primary)'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" className="animate-pulse-glow" style={{ color: 'var(--primary)' }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
        </div>
        <p className="text-lg font-medium" style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    </div>
  );
}
