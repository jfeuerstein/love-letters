export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
}

export interface Letter {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export const USERS: User[] = [
  {
    id: "user1",
    username: "josh",
    password: "password1",
    name: "Josh"
  },
  {
    id: "user2",
    username: "nini",
    password: "password2",
    name: "Nini"
  }
];
