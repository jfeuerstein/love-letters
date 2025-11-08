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

    if (!content.trim()) {
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

      setSubject('');
      setContent('');

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
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  if (!user) return null;

  const recipient = getOtherUser(user.id);

  return (
    <div>
      <Navigation />

      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Compose a Letter</h1>
        <p>To: {recipient?.name}</p>

        <form onSubmit={handleSend} style={{ marginTop: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="subject" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ccc',
                fontSize: '1rem'
              }}
              placeholder="Enter the subject"
              disabled={sending}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Your Letter
            </label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          {error && (
            <div style={{ padding: '0.5rem', border: '1px solid red', color: 'red', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => router.push('/inbox')}
              style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
              disabled={sending}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
              disabled={sending}
            >
              {sending ? 'Sending...' : 'Send Letter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
