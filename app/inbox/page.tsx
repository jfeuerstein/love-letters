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
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  if (!user) return null;

  return (
    <div>
      <Navigation />

      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          <div>
            <h2>Inbox ({letters.length})</h2>
            <div style={{ marginTop: '1rem' }}>
              {letters.length === 0 ? (
                <p>No letters yet</p>
              ) : (
                letters.map((letter) => (
                  <div
                    key={letter.id}
                    onClick={() => handleLetterClick(letter)}
                    style={{
                      padding: '1rem',
                      marginBottom: '0.5rem',
                      border: '1px solid #ccc',
                      cursor: 'pointer',
                      backgroundColor: selectedLetter?.id === letter.id ? '#f0f0f0' : 'white'
                    }}
                  >
                    <div><strong>{letter.subject}</strong></div>
                    <div>From: {getSenderName(letter.from)}</div>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>
                      {formatDate(letter.timestamp)}
                    </div>
                    {!letter.read && <span style={{ color: 'blue' }}>● New</span>}
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            {selectedLetter ? (
              <div style={{ border: '1px solid #ccc', padding: '2rem' }}>
                <h1>{selectedLetter.subject}</h1>
                <div style={{ marginBottom: '1rem', color: '#666' }}>
                  <div>From: {getSenderName(selectedLetter.from)}</div>
                  <div>{formatDate(selectedLetter.timestamp)}</div>
                </div>
                <div dangerouslySetInnerHTML={{ __html: selectedLetter.content }} />
              </div>
            ) : (
              <div style={{ border: '1px solid #ccc', padding: '2rem', textAlign: 'center' }}>
                <p>Select a letter to read</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
