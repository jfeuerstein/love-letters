'use client';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  return (
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        minHeight: '300px',
        padding: '1rem',
        border: '1px solid #ccc',
        fontFamily: 'inherit',
        fontSize: '1rem',
        resize: 'vertical'
      }}
      placeholder="Write your letter here..."
    />
  );
}
