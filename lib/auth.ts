import Cookies from 'js-cookie';
import { USERS, User } from './types';

export const AUTH_COOKIE = 'love-letters-user';

export function login(username: string, password: string): User | null {
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    Cookies.set(AUTH_COOKIE, user.id, { expires: 7 });
    return user;
  }

  return null;
}

export function logout(): void {
  Cookies.remove(AUTH_COOKIE);
}

export function getCurrentUser(): User | null {
  const userId = Cookies.get(AUTH_COOKIE);
  if (!userId) return null;

  return USERS.find((u) => u.id === userId) || null;
}

export function getOtherUser(currentUserId: string): User | null {
  return USERS.find((u) => u.id !== currentUserId) || null;
}
