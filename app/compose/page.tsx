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
        <div className="text-6xl animate-pulse">💌</div>
      </div>
    );
  }

  if (!user) return null;

  const recipient = getOtherUser(user.id);

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Navigation />

      <div className="max-w-4xl mx-auto p-6">
        <div className="rounded-lg shadow-sm p-6" style={{ background: 'var(--surface)' }}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
              ✍️ Compose a Letter
            </h1>
            <p className="opacity-70" style={{ color: 'var(--foreground)' }}>
              To: <span className="font-semibold">{recipient?.name}</span>
            </p>
          </div>

          <form onSubmit={handleSend} className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-lg outline-none transition"
                style={{
                  border: `1px solid var(--border)`,
                  background: 'var(--surface)',
                  color: 'var(--foreground)'
                }}
                placeholder="Enter the subject of your letter"
                disabled={sending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Your Letter
              </label>
              <RichTextEditor content={content} onChange={setContent} />
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

            <div className="flex justify-between items-center pt-4" style={{ borderTop: `1px solid var(--border)` }}>
              <button
                type="button"
                onClick={() => router.push('/inbox')}
                className="px-6 py-3 transition opacity-70 hover:opacity-100"
                style={{ color: 'var(--foreground)' }}
                disabled={sending}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-8 py-3 font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'var(--primary)',
                  color: 'var(--surface)'
                }}
                disabled={sending}
              >
                {sending ? 'Sending...' : 'Send Letter 💌'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 p-4 rounded-lg" style={{
          background: 'var(--accent)',
          borderColor: 'var(--border)',
          opacity: 0.15
        }}>
          <p className="text-sm" style={{ color: 'var(--foreground)' }}>
            <span className="font-semibold">💡 Tip:</span> Use the formatting toolbar to make your letter more expressive with bold text, headings, lists, and quotes.
          </p>
        </div>
      </div>
    </div>
  );
}
