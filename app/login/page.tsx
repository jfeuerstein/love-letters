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
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Love Letters</h1>
      <p>Login</p>

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc'
            }}
            required
          />
        </div>

        {error && (
          <div style={{ padding: '0.5rem', border: '1px solid red', color: 'red', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <button type="submit" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Sign In
        </button>
      </form>

      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
        <p style={{ marginBottom: '0.5rem' }}><strong>Demo Accounts:</strong></p>
        <p>Josh: josh / password1</p>
        <p>Nini: nini / password2</p>
      </div>
    </div>
  );
}
