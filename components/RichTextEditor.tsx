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
    <div className={`h-full flex flex-col ${className}`}>
      {/* Toolbar */}
      <div className="flex-shrink-0 bg-slate-800 border-b border-slate-600 px-4 py-2 flex items-center space-x-2">
        <button
          onClick={() => insertMarkdown("**", "**")}
          className="min-w-8 h-7 px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600 hover:text-white transition-colors flex items-center justify-center"
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => insertMarkdown("*", "*")}
          className="min-w-8 h-7 px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600 hover:text-white transition-colors flex items-center justify-center"
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <div className="w-px h-4 bg-slate-600"></div>
        <button
          onClick={() => insertMarkdown("# ")}
          className="min-w-8 h-7 px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600 hover:text-white transition-colors flex items-center justify-center"
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => insertMarkdown("## ")}
          className="min-w-8 h-7 px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600 hover:text-white transition-colors flex items-center justify-center"
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => insertMarkdown("### ")}
          className="min-w-8 h-7 px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600 hover:text-white transition-colors flex items-center justify-center"
          title="Heading 3"
        >
          H3
        </button>
        <div className="w-px h-4 bg-slate-600"></div>
        <button
          onClick={() => insertMarkdown("- ")}
          className="min-w-8 h-7 px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600 hover:text-white transition-colors flex items-center justify-center"
          title="Bullet List"
        >
          •
        </button>
        <button
          onClick={() => insertMarkdown("1. ")}
          className="min-w-8 h-7 px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600 hover:text-white transition-colors flex items-center justify-center"
          title="Numbered List"
        >
          1.
        </button>
        <div className="w-px h-4 bg-slate-600"></div>
        <button
          onClick={() => insertMarkdown("[", "](url)")}
          className="min-w-8 h-7 px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600 hover:text-white transition-colors flex items-center justify-center"
          title="Link"
        >
          🔗
        </button>
        <button
          onClick={() => insertMarkdown("`", "`")}
          className="min-w-8 h-7 px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600 hover:text-white transition-colors flex items-center justify-center"
          title="Inline Code"
        >
          &lt;/&gt;
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full h-full bg-slate-800 text-slate-200 border-none p-4 text-sm resize-none focus:outline-none transition-colors overflow-y-auto font-mono placeholder-slate-500 leading-relaxed ${
            isFocused ? "ring-1 ring-emerald-400" : ""
          }`}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#3ecf8e #1e293b",
          }}
        />
      </div>

      <style jsx>{`
        textarea::-webkit-scrollbar {
          width: 8px;
        }

        textarea::-webkit-scrollbar-track {
          background: #1e293b;
        }

        textarea::-webkit-scrollbar-thumb {
          background: #3ecf8e;
          border-radius: 4px;
        }

        textarea::-webkit-scrollbar-thumb:hover {
          background: #4be4b4;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
