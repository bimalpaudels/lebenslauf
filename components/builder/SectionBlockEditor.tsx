"use client";

import React, { useRef } from "react";
import type { SectionBlock } from "@/lib/cv-blocks";

interface SectionBlockEditorProps {
  block: SectionBlock;
  onChange: (block: SectionBlock) => void;
  onRemove?: () => void;
  dragHandle?: React.ReactNode;
}

function MarkdownToolbar({
  value,
  onChange,
  textareaRef,
}: {
  value: string;
  onChange: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
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

  const btn =
    "min-w-7 h-6 px-1.5 py-0.5 text-xs bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors flex items-center justify-center";

  return (
    <div className="flex flex-wrap items-center gap-1">
      <button type="button" onClick={() => insertMarkdown("**", "**")} className={btn} title="Bold">
        <strong>B</strong>
      </button>
      <button type="button" onClick={() => insertMarkdown("*", "*")} className={btn} title="Italic">
        <em>I</em>
      </button>
      <span className="w-px h-3 bg-slate-400 dark:bg-slate-600" />
      <button type="button" onClick={() => insertMarkdown("# ")} className={btn} title="H1">H1</button>
      <button type="button" onClick={() => insertMarkdown("## ")} className={btn} title="H2">H2</button>
      <button type="button" onClick={() => insertMarkdown("### ")} className={btn} title="H3">H3</button>
      <span className="w-px h-3 bg-slate-400 dark:bg-slate-600" />
      <button type="button" onClick={() => insertMarkdown("- ")} className={btn} title="Bullet">•</button>
      <button type="button" onClick={() => insertMarkdown("1. ")} className={btn} title="Numbered">1.</button>
      <span className="w-px h-3 bg-slate-400 dark:bg-slate-600" />
      <button type="button" onClick={() => insertMarkdown("[", "](url)")} className={btn} title="Link">🔗</button>
      <button type="button" onClick={() => insertMarkdown("`", "`")} className={btn} title="Code">&lt;/&gt;</button>
    </div>
  );
}

export function SectionBlockEditor({
  block,
  onChange,
  onRemove,
  dragHandle,
}: SectionBlockEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...block, title: e.target.value });
  };

  const handleContentChange = (content: string) => {
    onChange({ ...block, content });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const value = block.content;

    if (e.key === "Tab") {
      e.preventDefault();
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      handleContentChange(newValue);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }

    if (e.key === "Enter") {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const line = value.substring(lineStart, start);
      if (line.match(/^(\s*)[-*+]\s/)) {
        e.preventDefault();
        const indent = line.match(/^(\s*)/)?.[1] || "";
        const newValue =
          value.substring(0, start) + "\n" + indent + "- " + value.substring(end);
        handleContentChange(newValue);
        setTimeout(() => {
          if (textareaRef.current) {
            const newPos = start + indent.length + 3;
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newPos;
          }
        }, 0);
      }
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50">
        {dragHandle}
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Section
        </span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-auto p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title="Remove section"
            aria-label="Remove section"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        )}
      </div>
      <div className="p-3 space-y-2">
        <input
          type="text"
          value={block.title}
          onChange={handleTitleChange}
          placeholder="Section title"
          className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-600 rounded px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#3ECF8E]"
        />
        <div className="border border-slate-200 dark:border-slate-600 rounded overflow-hidden bg-slate-100 dark:bg-slate-700">
          <div className="px-2 py-1.5 border-b border-slate-200 dark:border-slate-600">
            <MarkdownToolbar
              value={block.content}
              onChange={handleContentChange}
              textareaRef={textareaRef}
            />
          </div>
          <textarea
            ref={textareaRef}
            value={block.content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Section content (markdown...)"
            className="w-full min-h-[100px] p-3 text-sm text-slate-900 dark:text-slate-200 bg-transparent border-none resize-y focus:outline-none font-mono placeholder-slate-400 dark:placeholder-slate-500 leading-relaxed"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#3ecf8e rgb(226 232 240)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
