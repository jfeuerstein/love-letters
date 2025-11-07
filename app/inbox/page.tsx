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
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Letters List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Inbox</h2>
                <p className="text-sm text-gray-600">{letters.length} letters</p>
              </div>

              <div className="divide-y divide-gray-200">
                {letters.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="text-4xl mb-2">📭</div>
                    <p>No letters yet</p>
                  </div>
                ) : (
                  letters.map((letter) => (
                    <button
                      key={letter.id}
                      onClick={() => handleLetterClick(letter)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition ${
                        selectedLetter?.id === letter.id ? 'bg-purple-50' : ''
                      } ${!letter.read ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">
                            {letter.subject}
                          </p>
                          <p className="text-sm text-gray-600">
                            From: {getSenderName(letter.from)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(letter.timestamp)}
                          </p>
                        </div>
                        {!letter.read && (
                          <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></span>
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
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedLetter.subject}
                  </h1>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>From: {getSenderName(selectedLetter.from)}</span>
                    <span>{formatDate(selectedLetter.timestamp)}</span>
                  </div>
                </div>

                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedLetter.content }}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 flex flex-col items-center justify-center text-gray-500">
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
