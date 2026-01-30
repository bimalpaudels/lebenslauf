"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  markdownToBlocks,
  blocksToMarkdown,
  generateSectionId,
  type CVBlock,
  type HeaderBlock,
  type SectionBlock,
} from "@/lib/cv-blocks";
import { HeaderBlockEditor } from "./HeaderBlockEditor";
import { SectionBlockEditor } from "./SectionBlockEditor";

interface BlockEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  className?: string;
}

export default function BlockEditor({
  value,
  onChange,
  className = "",
}: BlockEditorProps) {
  const [blocks, setBlocks] = useState<CVBlock[]>(() => markdownToBlocks(value));
  const lastEmittedRef = useRef<string>(value);

  // Sync from external value (e.g. initial load or external update)
  useEffect(() => {
    if (value !== lastEmittedRef.current) {
      lastEmittedRef.current = value;
      setBlocks(markdownToBlocks(value));
    }
  }, [value]);

  const emit = useCallback(
    (newBlocks: CVBlock[]) => {
      const md = blocksToMarkdown(newBlocks);
      lastEmittedRef.current = md;
      onChange(md);
      setBlocks(newBlocks);
    },
    [onChange]
  );

  const updateBlock = useCallback(
    (index: number, updated: CVBlock) => {
      const next = [...blocks];
      next[index] = updated;
      emit(next);
    },
    [blocks, emit]
  );

  const addSection = useCallback(() => {
    const newSection: SectionBlock = {
      type: "section",
      id: generateSectionId(),
      title: "New section",
      content: "",
    };
    emit([...blocks, newSection]);
  }, [blocks, emit]);

  const removeSection = useCallback(
    (sectionIndex: number) => {
      const blockIndex = sectionIndex + 1; // +1 for header
      const next = blocks.filter((_, i) => i !== blockIndex);
      emit(next);
    },
    [blocks, emit]
  );

  const handleDragStart = (e: React.DragEvent, blockIndex: number) => {
    e.dataTransfer.setData("application/x-block-index", String(blockIndex));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetBlockIndex: number) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData("application/x-block-index"), 10);
    if (Number.isNaN(fromIndex) || fromIndex === targetBlockIndex) return;
    if (fromIndex < 1 || targetBlockIndex < 1) return; // only reorder sections
    const next = [...blocks];
    const [moved] = next.splice(fromIndex, 1);
    const toIndex = fromIndex < targetBlockIndex ? targetBlockIndex - 1 : targetBlockIndex;
    next.splice(toIndex, 0, moved);
    emit(next);
  };

  const sectionBlocks = blocks.slice(1).filter((b): b is SectionBlock => b.type === "section");
  const headerBlock = blocks[0]?.type === "header" ? (blocks[0] as HeaderBlock) : null;

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {headerBlock && (
          <HeaderBlockEditor
            block={headerBlock}
            onChange={(block) => updateBlock(0, block)}
          />
        )}
        {sectionBlocks.map((block, sectionIndex) => {
          const blockIndex = sectionIndex + 1;
          return (
            <div
              key={block.id}
              draggable
              onDragStart={(e) => handleDragStart(e, blockIndex)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, blockIndex)}
              className="cursor-grab active:cursor-grabbing rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-colors"
            >
              <SectionBlockEditor
                block={block}
                onChange={(updated) => updateBlock(blockIndex, updated)}
                onRemove={() => removeSection(sectionIndex)}
                dragHandle={
                  <div
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-grab active:cursor-grabbing"
                    title="Drag to reorder"
                    aria-label="Drag to reorder"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="9" cy="6" r="1.5" />
                      <circle cx="9" cy="12" r="1.5" />
                      <circle cx="9" cy="18" r="1.5" />
                      <circle cx="15" cy="6" r="1.5" />
                      <circle cx="15" cy="12" r="1.5" />
                      <circle cx="15" cy="18" r="1.5" />
                    </svg>
                  </div>
                }
              />
            </div>
          );
        })}
        <button
          type="button"
          onClick={addSection}
          className="w-full py-3 text-sm text-slate-500 dark:text-slate-400 hover:text-[#3ECF8E] border border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-[#3ECF8E] transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-lg">+</span>
          Add section
        </button>
      </div>
    </div>
  );
}
