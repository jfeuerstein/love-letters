import { Letter } from './types';

const STORAGE_KEY = 'love-letters-data';

export function getLetters(): Letter[] {
  if (typeof window === 'undefined') return [];

  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveLetters(letters: Letter[]): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
}

export function getInbox(userId: string): Letter[] {
  return getLetters()
    .filter((letter) => letter.to === userId)
    .sort((a, b) => b.timestamp - a.timestamp);
}

export function getSentLetters(userId: string): Letter[] {
  return getLetters()
    .filter((letter) => letter.from === userId)
    .sort((a, b) => b.timestamp - a.timestamp);
}

export function sendLetter(letter: Omit<Letter, 'id' | 'timestamp' | 'read'>): void {
  const letters = getLetters();
  const newLetter: Letter = {
    ...letter,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
    read: false,
  };

  letters.push(newLetter);
  saveLetters(letters);
}

export function markAsRead(letterId: string): void {
  const letters = getLetters();
  const letter = letters.find((l) => l.id === letterId);

  if (letter) {
    letter.read = true;
    saveLetters(letters);
  }
}
