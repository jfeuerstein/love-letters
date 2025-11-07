'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Remove any existing theme classes
      document.documentElement.classList.remove('theme-josh', 'theme-nini');

      // Add theme class based on user ID
      if (user?.id === 'user1') {
        document.documentElement.classList.add('theme-josh');
      } else if (user?.id === 'user2') {
        document.documentElement.classList.add('theme-nini');
      }
    }
  }, [user, loading]);

  return <>{children}</>;
}
