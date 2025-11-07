'use client';

import { useRef, useEffect, useCallback } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML && !isUpdatingRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      onChange(editorRef.current.innerHTML);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  }, [onChange]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  const insertHeading = useCallback((level: number) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const node = range.commonAncestorContainer;
    const blockElement = node.nodeType === Node.TEXT_NODE ? node.parentElement : node as HTMLElement;

    if (blockElement) {
      const heading = document.createElement(`h${level}`);
      heading.innerHTML = blockElement.innerHTML || '<br>';
      blockElement.replaceWith(heading);

      const newRange = document.createRange();
      newRange.selectNodeContents(heading);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    handleInput();
  }, [handleInput]);

  const insertHorizontalRule = useCallback(() => {
    execCommand('insertHorizontalRule');
  }, [execCommand]);

  const Button = ({
    onClick,
    children,
    title,
  }: {
    onClick: () => void;
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className="px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 font-medium"
      style={{
        background: 'var(--accent)',
        color: 'var(--foreground)',
        border: `1px solid var(--border-subtle)`
      }}
      type="button"
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-xl overflow-hidden glass-effect shadow-xl" style={{
      border: `1px solid var(--border)`
    }}>
      <div className="p-3 flex flex-wrap gap-2" style={{
        borderBottom: `1px solid var(--border)`,
        background: 'var(--surface)'
      }}>
        <Button onClick={() => execCommand('bold')} title="Bold">
          <span className="font-bold text-sm">B</span>
        </Button>

        <Button onClick={() => execCommand('italic')} title="Italic">
          <span className="italic text-sm">I</span>
        </Button>

        <Button onClick={() => execCommand('strikethrough')} title="Strikethrough">
          <span className="line-through text-sm">S</span>
        </Button>

        <Button onClick={() => execCommand('underline')} title="Underline">
          <span className="underline text-sm">U</span>
        </Button>

        <div className="w-px mx-1" style={{ background: 'var(--border)' }}></div>

        <Button onClick={() => insertHeading(1)} title="Heading 1">
          <span className="text-sm font-bold">H1</span>
        </Button>

        <Button onClick={() => insertHeading(2)} title="Heading 2">
          <span className="text-sm font-bold">H2</span>
        </Button>

        <Button onClick={() => insertHeading(3)} title="Heading 3">
          <span className="text-sm font-bold">H3</span>
        </Button>

        <div className="w-px mx-1" style={{ background: 'var(--border)' }}></div>

        <Button onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
          <span className="text-sm">• List</span>
        </Button>

        <Button onClick={() => execCommand('insertOrderedList')} title="Numbered List">
          <span className="text-sm">1. List</span>
        </Button>

        <Button onClick={() => execCommand('formatBlock', '<blockquote>')} title="Quote">
          <span className="text-sm">&quot;</span>
        </Button>

        <div className="w-px mx-1" style={{ background: 'var(--border)' }}></div>

        <Button onClick={insertHorizontalRule} title="Horizontal Rule">
          <span className="text-sm">—</span>
        </Button>

        <div className="w-px mx-1" style={{ background: 'var(--border)' }}></div>

        <Button onClick={() => execCommand('undo')} title="Undo">
          <span className="text-sm">↶</span>
        </Button>

        <Button onClick={() => execCommand('redo')} title="Redo">
          <span className="text-sm">↷</span>
        </Button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6 transition-all"
        style={{
          color: 'var(--foreground)',
          background: 'var(--surface)'
        }}
        suppressContentEditableWarning
      />
    </div>
  );
}
