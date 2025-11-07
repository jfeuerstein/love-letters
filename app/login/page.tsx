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
    <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>💌</h1>
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>Love Letters</h2>
          <p className="mt-2 opacity-70" style={{ color: 'var(--foreground)' }}>Send heartfelt messages</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg outline-none transition"
              style={{
                border: `1px solid var(--border)`,
                background: 'var(--surface)',
                color: 'var(--foreground)'
              }}
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg outline-none transition"
              style={{
                border: `1px solid var(--border)`,
                background: 'var(--surface)',
                color: 'var(--foreground)'
              }}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="p-3 border rounded-lg text-sm" style={{
              background: 'rgba(220, 38, 38, 0.1)',
              borderColor: 'rgba(220, 38, 38, 0.3)',
              color: '#991b1b'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
            style={{
              background: 'var(--primary)',
              color: 'var(--surface)'
            }}
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 p-4 rounded-lg" style={{ background: 'var(--background)', borderColor: 'var(--border)' }}>
          <p className="text-xs text-center mb-2 font-semibold opacity-70" style={{ color: 'var(--foreground)' }}>Demo Accounts:</p>
          <div className="text-xs space-y-1 opacity-70" style={{ color: 'var(--foreground)' }}>
            <p><span className="font-medium">Josh:</span> josh / password1</p>
            <p><span className="font-medium">Nini:</span> nini / password2</p>
          </div>
        </div>
      </div>
    </div>
  );
}
