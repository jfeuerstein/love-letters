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
        <div className="text-6xl animate-pulse">💌</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Navigation />

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Letters List */}
          <div className="lg:col-span-1">
            <div className="rounded-lg shadow-sm" style={{ background: 'var(--surface)' }}>
              <div className="p-4" style={{ borderBottom: `1px solid var(--border)` }}>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Inbox</h2>
                <p className="text-sm opacity-70" style={{ color: 'var(--foreground)' }}>{letters.length} letters</p>
              </div>

              <div style={{ borderTop: `1px solid var(--border)` }}>
                {letters.length === 0 ? (
                  <div className="p-8 text-center opacity-60" style={{ color: 'var(--foreground)' }}>
                    <div className="text-4xl mb-2">📭</div>
                    <p>No letters yet</p>
                  </div>
                ) : (
                  letters.map((letter) => (
                    <button
                      key={letter.id}
                      onClick={() => handleLetterClick(letter)}
                      className="w-full text-left p-4 transition"
                      style={{
                        borderBottom: `1px solid var(--border)`,
                        background: selectedLetter?.id === letter.id
                          ? 'var(--primary)'
                          : !letter.read
                          ? 'var(--accent)'
                          : 'var(--surface)',
                        color: selectedLetter?.id === letter.id || !letter.read
                          ? 'var(--surface)'
                          : 'var(--foreground)',
                        opacity: selectedLetter?.id === letter.id ? 0.9 : !letter.read ? 0.15 : 1
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">
                            {letter.subject}
                          </p>
                          <p className="text-sm opacity-80">
                            From: {getSenderName(letter.from)}
                          </p>
                          <p className="text-xs opacity-60 mt-1">
                            {formatDate(letter.timestamp)}
                          </p>
                        </div>
                        {!letter.read && (
                          <span
                            className="ml-2 w-2 h-2 rounded-full flex-shrink-0 mt-2"
                            style={{ background: 'var(--accent)' }}
                          ></span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Letter Content */}
          <div className="lg:col-span-2">
            {selectedLetter ? (
              <div className="rounded-lg shadow-sm p-6" style={{ background: 'var(--surface)' }}>
                <div className="pb-4 mb-6" style={{ borderBottom: `1px solid var(--border)` }}>
                  <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                    {selectedLetter.subject}
                  </h1>
                  <div className="flex items-center justify-between text-sm opacity-70" style={{ color: 'var(--foreground)' }}>
                    <span>From: {getSenderName(selectedLetter.from)}</span>
                    <span>{formatDate(selectedLetter.timestamp)}</span>
                  </div>
                </div>

                <div
                  className="prose prose-lg max-w-none"
                  style={{ color: 'var(--foreground)' }}
                  dangerouslySetInnerHTML={{ __html: selectedLetter.content }}
                />
              </div>
            ) : (
              <div className="rounded-lg shadow-sm p-12 flex flex-col items-center justify-center opacity-60" style={{ background: 'var(--surface)', color: 'var(--foreground)' }}>
                <div className="text-6xl mb-4">💌</div>
                <p className="text-lg">Select a letter to read</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
