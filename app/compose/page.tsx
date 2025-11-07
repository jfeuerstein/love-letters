'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import RichTextEditor from '@/components/RichTextEditor';
import { sendLetter } from '@/lib/storage';
import { getOtherUser } from '@/lib/auth';

export default function ComposePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!subject.trim()) {
      setError('Please enter a subject');
      return;
    }

    const isEmpty = !content.trim() ||
      content === '<p></p>' ||
      content === '<br>' ||
      content === '<div><br></div>' ||
      content.replace(/<[^>]*>/g, '').trim() === '';

    if (isEmpty) {
      setError('Please write your letter');
      return;
    }

    if (!user) return;

    setSending(true);

    try {
      const recipient = getOtherUser(user.id);
      if (!recipient) {
        setError('Could not find recipient');
        return;
      }

      sendLetter({
        from: user.id,
        to: recipient.id,
        subject,
        content,
      });

      // Clear form
      setSubject('');
      setContent('');

      // Show success and redirect
      setTimeout(() => {
        router.push('/sent');
      }, 500);
    } catch (err) {
      setError('Failed to send letter. Please try again.');
    } finally {
      setSending(false);
    }
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

  const recipient = getOtherUser(user.id);

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="max-w-5xl mx-auto p-8">
        <div className="rounded-2xl shadow-2xl glass-effect p-8 animate-fade-in" style={{ border: `1px solid var(--border)` }}>
          <div className="mb-8 pb-6" style={{ borderBottom: `2px solid var(--border)` }}>
            <div className="flex items-center space-x-3 mb-3">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                Compose a Letter
              </h1>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              To: <span className="font-bold text-base" style={{ color: 'var(--primary)' }}>{recipient?.name}</span>
            </p>
          </div>

          <form onSubmit={handleSend} className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-bold mb-3" style={{ color: 'var(--foreground)' }}>
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-5 py-4 rounded-xl outline-none transition-all duration-300 focus:scale-[1.01]"
                style={{
                  border: `2px solid var(--border)`,
                  background: 'var(--surface)',
                  color: 'var(--foreground)'
                }}
                placeholder="Enter the subject of your letter"
                disabled={sending}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-3" style={{ color: 'var(--foreground)' }}>
                Your Letter
              </label>
              <RichTextEditor content={content} onChange={setContent} />
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

            <div className="flex justify-between items-center pt-6" style={{ borderTop: `2px solid var(--border)` }}>
              <button
                type="button"
                onClick={() => router.push('/inbox')}
                className="px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 font-medium"
                style={{
                  color: 'var(--text-muted)',
                  background: 'var(--accent)'
                }}
                disabled={sending}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-10 py-4 font-bold rounded-xl transition-all duration-300 shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
                style={{
                  background: 'var(--primary)',
                  color: 'var(--background)',
                  boxShadow: '0 0 30px var(--primary)'
                }}
                disabled={sending}
              >
                <span>{sending ? 'Sending...' : 'Send Letter'}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 p-6 rounded-xl glass-effect animate-fade-in" style={{
          border: `1px solid var(--border-subtle)`
        }}>
          <div className="flex items-start space-x-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5" style={{ color: 'var(--primary)' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              <span className="font-bold" style={{ color: 'var(--foreground)' }}>Tip:</span> Use the formatting toolbar to make your letter more expressive with bold text, headings, lists, and quotes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
