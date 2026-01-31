"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { useEditor, EditorContent, Editor, ReactRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Suggestion from "@tiptap/suggestion";
import { Extension } from "@tiptap/core";
import tippy, { Instance as TippyInstance } from "tippy.js";
import SlashCommandMenu, {
  CommandItem,
  SlashCommandMenuRef,
  HeadingIcon,
  BulletListIcon,
  NumberedListIcon,
  DividerIcon,
  ParagraphIcon,
} from "./SlashCommandMenu";
import {
  cvMarkdownToEditorContent,
  editorContentToCVMarkdown,
} from "@/lib/editor-markdown";

interface NotionEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  className?: string;
}

// Create slash command items
const getSuggestionItems = (editor: Editor): CommandItem[] => [
  {
    title: "Heading 1",
    description: "Main title (Name)",
    icon: <HeadingIcon level={1} />,
    command: () =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: "Heading 2",
    description: "Section heading",
    icon: <HeadingIcon level={2} />,
    command: () =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: "Heading 3",
    description: "Sub-section heading",
    icon: <HeadingIcon level={3} />,
    command: () =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: "Bullet List",
    description: "Create a bullet list",
    icon: <BulletListIcon />,
    command: () => editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: "Numbered List",
    description: "Create a numbered list",
    icon: <NumberedListIcon />,
    command: () => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    title: "Divider",
    description: "Visual divider",
    icon: <DividerIcon />,
    command: () => editor.chain().focus().setHorizontalRule().run(),
  },
  {
    title: "Text",
    description: "Plain text paragraph",
    icon: <ParagraphIcon />,
    command: () => editor.chain().focus().setParagraph().run(),
  },
];

// Slash commands extension
const SlashCommands = Extension.create({
  name: "slashCommands",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: { from: number; to: number };
          props: CommandItem;
        }) => {
          props.command();
          editor.chain().focus().deleteRange(range).run();
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export default function NotionEditor({
  value,
  onChange,
  className = "",
}: NotionEditorProps) {
  const lastEmittedRef = useRef<string>(value);
  const isInternalUpdate = useRef(false);
  const editorRef = useRef<Editor | null>(null);

  // Emit changes to parent
  const emitChange = useCallback(
    (html: string) => {
      const markdown = editorContentToCVMarkdown(html);
      lastEmittedRef.current = markdown;
      isInternalUpdate.current = true;
      onChange(markdown);
    },
    [onChange]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Type '/' for commands...",
        emptyEditorClass: "is-editor-empty",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#3ECF8E] underline",
        },
      }),
      SlashCommands.configure({
        suggestion: {
          char: "/",
          items: ({ editor, query }: { editor: Editor; query: string }) => {
            const items = getSuggestionItems(editor);
            return items.filter((item) =>
              item.title.toLowerCase().includes(query.toLowerCase())
            );
          },
          render: () => {
            let component: ReactRenderer<SlashCommandMenuRef> | null = null;
            let popup: TippyInstance[] | null = null;

            return {
              onStart: (props: {
                editor: Editor;
                clientRect: (() => DOMRect | null) | null;
                items: CommandItem[];
              }) => {
                component = new ReactRenderer(SlashCommandMenu, {
                  props: {
                    items: props.items,
                    onSelect: (item: CommandItem) => {
                      item.command();
                      popup?.[0]?.hide();
                    },
                  },
                  editor: props.editor,
                });

                if (!props.clientRect) {
                  return;
                }

                popup = tippy("body", {
                  getReferenceClientRect: props.clientRect as () => DOMRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: "manual",
                  placement: "bottom-start",
                });
              },

              onUpdate: (props: {
                items: CommandItem[];
                clientRect: (() => DOMRect | null) | null;
              }) => {
                component?.updateProps({
                  items: props.items,
                  onSelect: (item: CommandItem) => {
                    item.command();
                    popup?.[0]?.hide();
                  },
                });

                if (props.clientRect) {
                  popup?.[0]?.setProps({
                    getReferenceClientRect: props.clientRect as () => DOMRect,
                  });
                }
              },

              onKeyDown: (props: { event: KeyboardEvent }) => {
                if (props.event.key === "Escape") {
                  popup?.[0]?.hide();
                  return true;
                }

                return component?.ref?.onKeyDown(props.event) ?? false;
              },

              onExit: () => {
                popup?.[0]?.destroy();
                component?.destroy();
              },
            };
          },
          command: ({
            editor,
            range,
            props,
          }: {
            editor: Editor;
            range: { from: number; to: number };
            props: CommandItem;
          }) => {
            editor.chain().focus().deleteRange(range).run();
            props.command();
          },
        },
      }),
    ],
    content: (() => {
      const { bodyHtml } = cvMarkdownToEditorContent(value);
      return bodyHtml;
    })(),
    editorProps: {
      attributes: {
        class:
          "prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-2",
      },
    },
    onUpdate: ({ editor: ed }) => {
      emitChange(ed.getHTML());
    },
  });

  // Keep editor ref in sync
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Sync from external value changes
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    
    if (value !== lastEmittedRef.current && !isInternalUpdate.current) {
      const { bodyHtml } = cvMarkdownToEditorContent(value);
      editor.commands.setContent(bodyHtml);
      lastEmittedRef.current = value;
    }
    isInternalUpdate.current = false;
  }, [value, editor]);

  return (
    <div className={`h-full flex flex-col overflow-hidden ${className}`}>
      <div className="flex-1 overflow-y-auto">
        {/* Document-style editor container */}
        <div className="max-w-3xl mx-auto py-8 px-6">
          {/* Main Content Editor */}
          <div className="notion-editor">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* Editor Styles */}
      <style jsx global>{`
        .notion-editor .ProseMirror {
          min-height: 300px;
        }

        .notion-editor .ProseMirror:focus {
          outline: none;
        }

        .notion-editor .ProseMirror.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }

        .notion-editor .ProseMirror > * + * {
          margin-top: 0.75em;
        }

        .notion-editor .ProseMirror h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.1;
          color: inherit;
        }

        .notion-editor .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: inherit;
        }

        .notion-editor .ProseMirror h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.25rem;
          color: inherit;
        }

        .notion-editor .ProseMirror p {
          margin: 0.5rem 0;
        }

        .notion-editor .ProseMirror ul,
        .notion-editor .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }

        .notion-editor .ProseMirror li {
          margin: 0.25rem 0;
        }

        .notion-editor .ProseMirror hr {
          border: none;
          border-top: 1px solid #e2e8f0;
          margin: 1rem 0;
        }

        .dark .notion-editor .ProseMirror hr {
          border-top-color: #475569;
        }

        .notion-editor .ProseMirror strong {
          font-weight: 600;
        }

        .notion-editor .ProseMirror em {
          font-style: italic;
        }

        .notion-editor .ProseMirror a {
          color: #3ecf8e;
          text-decoration: underline;
        }

        .notion-editor .ProseMirror blockquote {
          border-left: 3px solid #e2e8f0;
          padding-left: 1rem;
          margin: 0.5rem 0;
          color: #64748b;
        }

        .dark .notion-editor .ProseMirror blockquote {
          border-left-color: #475569;
          color: #94a3b8;
        }
        
        .notion-editor .ProseMirror img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 1rem 0;
        }

        /* Tippy styles */
        .tippy-box[data-theme~="light-border"] {
          background-color: white;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        }

        .dark .tippy-box[data-theme~="light-border"] {
          background-color: #1e293b;
          border-color: #334155;
        }
      `}</style>
    </div>
  );
}
