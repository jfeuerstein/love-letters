# 💌 Love Letters

A Next.js application for two users to exchange heartfelt letters with a rich text editor.

## Features

- **Two-User Authentication**: Simple login system for two accounts
- **Rich Text Editor**: Custom, lightweight editor with formatting options including:
  - Bold, italic, strikethrough, and underline text
  - Headings (H1, H2, H3)
  - Bullet and numbered lists
  - Blockquotes
  - Horizontal rules
  - Undo/Redo functionality
- **Inbox**: View all letters received from the other user
- **Sent Letters**: Review all letters you've sent
- **Letter Composition**: Easy-to-use interface for writing and sending letters
- **Read Status Tracking**: See which letters have been read

## Getting Started

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## User Accounts

The application comes with two pre-configured accounts:

**User 1:**
- Username: `josh`
- Password: `password1`

**User 2:**
- Username: `nini`
- Password: `password2`

## How to Use

1. **Login**: Visit the home page and log in with one of the user accounts
2. **Compose**: Click "Compose" to write a new letter using the rich text editor
3. **Send**: Fill in the subject and content, then click "Send Letter"
4. **Inbox**: View received letters in the Inbox
5. **Sent**: Review letters you've sent in the Sent section

## Technology Stack

- **Framework**: Next.js 16 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Rich Text Editor**: Custom contentEditable-based editor
- **Storage**: LocalStorage (client-side)
- **Authentication**: Cookie-based with js-cookie

## Project Structure

```
love-letters/
├── app/
│   ├── compose/          # Letter composition page
│   ├── inbox/            # Inbox page
│   ├── login/            # Login page
│   ├── sent/             # Sent letters page
│   └── page.tsx          # Home page (redirects)
├── components/
│   ├── Navigation.tsx    # Navigation bar
│   └── RichTextEditor.tsx # Rich text editor component
├── hooks/
│   └── useAuth.ts        # Authentication hook
└── lib/
    ├── auth.ts           # Authentication utilities
    ├── storage.ts        # LocalStorage utilities
    └── types.ts          # TypeScript type definitions
```

## Notes

- All letters are stored in the browser's LocalStorage
- Data persists between sessions but is browser-specific
- Each user can only see their own inbox and sent letters
- Letters are automatically marked as read when opened

## Building for Production

```bash
npm run build
npm start
```
