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

    if (!content.trim() || content === '<p></p>') {
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              ✍️ Compose a Letter
            </h1>
            <p className="text-gray-600">
              To: <span className="font-semibold">{recipient?.name}</span>
            </p>
          </div>

          <form onSubmit={handleSend} className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="Enter the subject of your letter"
                disabled={sending}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Letter
              </label>
              <RichTextEditor content={content} onChange={setContent} />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push('/inbox')}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition"
                disabled={sending}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={sending}
              >
                {sending ? 'Sending...' : 'Send Letter 💌'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">💡 Tip:</span> Use the formatting toolbar to make your letter more expressive with bold text, headings, lists, and quotes.
          </p>
        </div>
      </div>
    </div>
  );
}
