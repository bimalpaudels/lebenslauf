"use client";

import React from "react";
import type { HeaderBlock } from "@/lib/cv-blocks";

interface HeaderBlockEditorProps {
  block: HeaderBlock;
  onChange: (block: HeaderBlock) => void;
}

export function HeaderBlockEditor({ block, onChange }: HeaderBlockEditorProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...block, name: e.target.value });
  };

  const handleItemChange = (index: number, text: string) => {
    const next = [...block.headerItems];
    next[index] = { text };
    onChange({ ...block, headerItems: next });
  };

  const addItem = () => {
    onChange({
      ...block,
      headerItems: [...block.headerItems, { text: "" }],
    });
  };

  const removeItem = (index: number) => {
    const next = block.headerItems.filter((_, i) => i !== index);
    onChange({ ...block, headerItems: next });
  };

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-3 space-y-3">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <span className="text-[#3ECF8E]">Header</span>
      </div>
      <input
        type="text"
        value={block.name}
        onChange={handleNameChange}
        placeholder="Your name"
        className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-600 rounded px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#3ECF8E]"
      />
      <div className="space-y-2">
        {block.headerItems.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              value={item.text}
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder="e.g. email, phone, location"
              className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-600 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#3ECF8E]"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              title="Remove line"
              aria-label="Remove line"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="w-full py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-[#3ECF8E] border border-dashed border-slate-300 dark:border-slate-600 rounded hover:border-[#3ECF8E] transition-colors"
        >
          + Add line
        </button>
      </div>
    </div>
  );
}
