'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { getInbox, markAsRead } from '@/lib/storage';
import { Letter } from '@/lib/types';
import { USERS } from '@/lib/types';

export default function InboxPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadLetters();
    }
  }, [user]);

  const loadLetters = () => {
    if (user) {
      const inbox = getInbox(user.id);
      setLetters(inbox);
    }
  };

  const handleLetterClick = (letter: Letter) => {
    setSelectedLetter(letter);
    if (!letter.read) {
      markAsRead(letter.id);
      loadLetters();
    }
  };

  const getSenderName = (senderId: string) => {
    return USERS.find((u) => u.id === senderId)?.name || 'Unknown';
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center animate-pulse" style={{
          background: 'var(--surface-glass)',
          border: '2px solid var(--border)',
          boxShadow: '0 0 40px var(--primary)'
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--primary)' }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Letters List */}
          <div className="lg:col-span-1 animate-slide-in">
            <div className="rounded-2xl shadow-xl glass-effect overflow-hidden" style={{ border: `1px solid var(--border)` }}>
              <div className="p-6" style={{
                borderBottom: `1px solid var(--border)`,
                background: 'var(--surface)'
              }}>
                <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Inbox</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{letters.length} {letters.length === 1 ? 'letter' : 'letters'}</p>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {letters.length === 0 ? (
                  <div className="p-12 text-center" style={{ color: 'var(--text-muted)' }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 opacity-30">
                      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                    </svg>
                    <p className="font-medium">No letters yet</p>
                  </div>
                ) : (
                  letters.map((letter, index) => (
                    <button
                      key={letter.id}
                      onClick={() => handleLetterClick(letter)}
                      className="w-full text-left p-5 transition-all duration-300 hover:scale-[1.02] relative group"
                      style={{
                        borderBottom: index < letters.length - 1 ? `1px solid var(--border-subtle)` : 'none',
                        background: selectedLetter?.id === letter.id
                          ? 'var(--primary)'
                          : 'transparent',
                        color: selectedLetter?.id === letter.id
                          ? 'var(--background)'
                          : 'var(--foreground)'
                      }}
                    >
                      {selectedLetter?.id === letter.id && (
                        <div className="absolute inset-0" style={{
                          background: 'var(--primary)',
                          boxShadow: '0 0 20px var(--primary)',
                          borderRadius: '0.5rem',
                          margin: '0.25rem'
                        }}></div>
                      )}
                      <div className="flex items-start justify-between relative z-10">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate text-base mb-1">
                            {letter.subject}
                          </p>
                          <p className="text-sm opacity-80">
                            From: {getSenderName(letter.from)}
                          </p>
                          <p className="text-xs opacity-60 mt-2">
                            {formatDate(letter.timestamp)}
                          </p>
                        </div>
                        {!letter.read && (
                          <div className="flex items-center space-x-2 ml-3">
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse"
                              style={{ background: 'var(--primary)' }}
                            ></span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Letter Content */}
          <div className="lg:col-span-2 animate-fade-in">
            {selectedLetter ? (
              <div className="rounded-2xl shadow-xl glass-effect p-8" style={{ border: `1px solid var(--border)` }}>
                <div className="pb-6 mb-8" style={{ borderBottom: `2px solid var(--border)` }}>
                  <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
                    {selectedLetter.subject}
                  </h1>
                  <div className="flex items-center justify-between text-sm" style={{ color: 'var(--text-muted)' }}>
                    <span className="font-medium">From: <span style={{ color: 'var(--primary)' }}>{getSenderName(selectedLetter.from)}</span></span>
                    <span>{formatDate(selectedLetter.timestamp)}</span>
                  </div>
                </div>

                <div
                  className="prose prose-lg max-w-none leading-relaxed"
                  style={{ color: 'var(--foreground)' }}
                  dangerouslySetInnerHTML={{ __html: selectedLetter.content }}
                />
              </div>
            ) : (
              <div className="rounded-2xl shadow-xl glass-effect p-16 flex flex-col items-center justify-center min-h-[500px]" style={{
                border: `1px solid var(--border)`,
                color: 'var(--text-muted)'
              }}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" className="mb-6 opacity-30" style={{ color: 'var(--primary)' }}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <p className="text-lg font-medium">Select a letter to read</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
