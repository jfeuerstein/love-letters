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
      className="px-3 py-1.5 rounded transition hover:opacity-80"
      style={{
        background: 'var(--surface)',
        color: 'var(--foreground)',
        border: `1px solid var(--border)`
      }}
      type="button"
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-lg overflow-hidden" style={{
      border: `1px solid var(--border)`,
      background: 'var(--surface)'
    }}>
      <div className="p-2 flex flex-wrap gap-2" style={{
        borderBottom: `1px solid var(--border)`,
        background: 'var(--background)',
        opacity: 0.6
      }}>
        <Button onClick={() => execCommand('bold')} title="Bold">
          <span className="font-bold">B</span>
        </Button>

        <Button onClick={() => execCommand('italic')} title="Italic">
          <span className="italic">I</span>
        </Button>

        <Button onClick={() => execCommand('strikethrough')} title="Strikethrough">
          <span className="line-through">S</span>
        </Button>

        <Button onClick={() => execCommand('underline')} title="Underline">
          <span className="underline">U</span>
        </Button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <Button onClick={() => insertHeading(1)} title="Heading 1">
          H1
        </Button>

        <Button onClick={() => insertHeading(2)} title="Heading 2">
          H2
        </Button>

        <Button onClick={() => insertHeading(3)} title="Heading 3">
          H3
        </Button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <Button onClick={() => execCommand('insertUnorderedList')} title="Bullet List">
          • List
        </Button>

        <Button onClick={() => execCommand('insertOrderedList')} title="Numbered List">
          1. List
        </Button>

        <Button onClick={() => execCommand('formatBlock', '<blockquote>')} title="Quote">
          &quot;
        </Button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <Button onClick={insertHorizontalRule} title="Horizontal Rule">
          —
        </Button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <Button onClick={() => execCommand('undo')} title="Undo">
          ↶
        </Button>

        <Button onClick={() => execCommand('redo')} title="Redo">
          ↷
        </Button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4"
        style={{
          color: 'var(--foreground)',
          background: 'var(--surface)'
        }}
        suppressContentEditableWarning
      />
    </div>
  );
}
