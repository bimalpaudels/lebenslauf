"use client";

import React, { useRef, useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your CV in markdown...",
  className = "",
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // No auto-resize - let it scroll naturally

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const start = target.selectionStart;
    const end = target.selectionEnd;

    // Handle Tab key
    if (e.key === "Tab") {
      e.preventDefault();
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);

      // Set cursor position after the tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart =
            textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }

    // Handle Enter key for list items
    if (e.key === "Enter") {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const line = value.substring(lineStart, start);

      if (line.match(/^(\s*)[-*+]\s/)) {
        e.preventDefault();
        const indent = line.match(/^(\s*)/)?.[1] || "";
        const newValue =
          value.substring(0, start) +
          "\n" +
          indent +
          "- " +
          value.substring(end);
        onChange(newValue);

        setTimeout(() => {
          if (textareaRef.current) {
            const newPos = start + indent.length + 3;
            textareaRef.current.selectionStart =
              textareaRef.current.selectionEnd = newPos;
          }
        }, 0);
      }
    }
  };

  const insertMarkdown = (before: string, after: string = "") => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selectedText = value.substring(start, end);

      const newValue =
        value.substring(0, start) +
        before +
        selectedText +
        after +
        value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        if (textareaRef.current) {
          if (selectedText) {
            textareaRef.current.selectionStart = start;
            textareaRef.current.selectionEnd =
              start + before.length + selectedText.length + after.length;
          } else {
            textareaRef.current.selectionStart =
              textareaRef.current.selectionEnd = start + before.length;
          }
        }
      }, 0);
    }
  };

  return (
    <div className={`rich-text-editor ${className}`}>
      {/* Toolbar */}
      <div className="editor-toolbar bg-slate-800 border-b border-slate-600 px-4 py-2 flex items-center space-x-2">
        <button
          onClick={() => insertMarkdown("**", "**")}
          className="toolbar-btn"
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => insertMarkdown("*", "*")}
          className="toolbar-btn"
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <div className="w-px h-4 bg-slate-600"></div>
        <button
          onClick={() => insertMarkdown("# ")}
          className="toolbar-btn"
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => insertMarkdown("## ")}
          className="toolbar-btn"
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => insertMarkdown("### ")}
          className="toolbar-btn"
          title="Heading 3"
        >
          H3
        </button>
        <div className="w-px h-4 bg-slate-600"></div>
        <button
          onClick={() => insertMarkdown("- ")}
          className="toolbar-btn"
          title="Bullet List"
        >
          •
        </button>
        <button
          onClick={() => insertMarkdown("1. ")}
          className="toolbar-btn"
          title="Numbered List"
        >
          1.
        </button>
        <div className="w-px h-4 bg-slate-600"></div>
        <button
          onClick={() => insertMarkdown("[", "](url)")}
          className="toolbar-btn"
          title="Link"
        >
          🔗
        </button>
        <button
          onClick={() => insertMarkdown("`", "`")}
          className="toolbar-btn"
          title="Inline Code"
        >
          &lt;/&gt;
        </button>
      </div>

      {/* Editor */}
      <div className="editor-container relative h-full">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full h-full bg-slate-800 text-slate-200 border-none p-4 font-mono text-sm resize-none focus:outline-none transition-colors overflow-y-auto ${
            isFocused ? "ring-1 ring-[#3ECF8E]" : ""
          }`}
          style={{
            lineHeight: "1.6",
          }}
        />
      </div>

      <style jsx>{`
        .rich-text-editor {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .editor-toolbar {
          flex-shrink: 0;
        }

        .editor-container {
          flex: 1;
          overflow: hidden;
        }

        .toolbar-btn {
          @apply px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600 hover:text-white transition-colors;
          min-width: 32px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toolbar-btn:hover {
          @apply bg-slate-600 text-white;
        }

        textarea {
          font-family: "JetBrains Mono", "Fira Code", "Monaco", "Consolas",
            monospace;
        }

        textarea::placeholder {
          color: #64748b;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
