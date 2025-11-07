'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = login(username, password);

    if (user) {
      router.push('/inbox');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{
        background: 'radial-gradient(circle at 50% 50%, var(--primary) 0%, transparent 70%)'
      }}></div>

      <div className="w-full max-w-md p-10 rounded-2xl shadow-2xl glass-effect relative z-10 animate-fade-in" style={{
        border: `1px solid var(--border)`
      }}>
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-lg" style={{
            background: 'var(--primary)',
            boxShadow: '0 0 40px var(--primary)'
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-2 tracking-tight" style={{ color: 'var(--foreground)' }}>Love Letters</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Send heartfelt messages</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl outline-none transition-all duration-300 focus:scale-[1.02]"
              style={{
                border: `2px solid var(--border)`,
                background: 'var(--surface)',
                color: 'var(--foreground)'
              }}
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl outline-none transition-all duration-300 focus:scale-[1.02]"
              style={{
                border: `2px solid var(--border)`,
                background: 'var(--surface)',
                color: 'var(--foreground)'
              }}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="p-4 border rounded-xl text-sm font-medium animate-fade-in" style={{
              background: 'rgba(220, 38, 38, 0.1)',
              borderColor: 'rgba(220, 38, 38, 0.4)',
              color: '#ff5555'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 font-bold rounded-xl transition-all duration-300 shadow-lg hover:scale-105"
            style={{
              background: 'var(--primary)',
              color: 'var(--background)',
              boxShadow: '0 0 30px var(--primary)'
            }}
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 p-5 rounded-xl" style={{
          background: 'var(--accent)',
          border: `1px solid var(--border-subtle)`
        }}>
          <p className="text-xs text-center mb-3 font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Demo Accounts</p>
          <div className="text-sm space-y-2" style={{ color: 'var(--foreground)' }}>
            <p><span className="font-bold" style={{ color: 'var(--primary)' }}>Josh:</span> josh / password1</p>
            <p><span className="font-bold" style={{ color: 'var(--primary)' }}>Nini:</span> nini / password2</p>
          </div>
        </div>
      </div>
    </div>
  );
}
