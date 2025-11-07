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
    username: "alex",
    password: "password1",
    name: "Alex"
  },
  {
    id: "user2",
    username: "jordan",
    password: "password2",
    name: "Jordan"
  }
];
