"use client";

import React from "react";
import type { Components } from "react-markdown";

export type ThemeConfig = {
  color: string;
  fontSize: number;
  lineHeight: number;
  pagePadding: number;
  paragraphSpacing: number;
};

/**
 * Creates react-markdown component mappings with Tailwind styling.
 * Theme values are applied via inline styles for dynamic customization.
 */
export function createMarkdownComponents(theme: ThemeConfig): Components {
  return {
    h1: ({ children }) => (
      <h1
        className="font-extrabold tracking-tight"
        style={{
          color: theme.color,
          fontSize: `${theme.fontSize * 1.8}px`,
          lineHeight: theme.lineHeight,
          marginTop: 0,
          marginBottom: `${theme.paragraphSpacing}rem`,
        }}
      >
        {children}
      </h1>
    ),

    h2: ({ children }) => (
      <h2
        className="font-bold"
        style={{
          color: theme.color,
          fontSize: `${theme.fontSize * 1.4}px`,
          lineHeight: theme.lineHeight,
          marginTop: `${theme.paragraphSpacing * 1.5}rem`,
          marginBottom: `${theme.paragraphSpacing * 0.5}rem`,
        }}
      >
        {children}
      </h2>
    ),

    h3: ({ children }) => (
      <h3
        className="font-semibold text-gray-900"
        style={{
          fontSize: `${theme.fontSize * 1.2}px`,
          lineHeight: theme.lineHeight,
          marginTop: `${theme.paragraphSpacing * 1.2}rem`,
          marginBottom: `${theme.paragraphSpacing * 0.4}rem`,
        }}
      >
        {children}
      </h3>
    ),

    p: ({ children }) => (
      <p
        className="text-gray-600"
        style={{
          fontSize: `${theme.fontSize}px`,
          lineHeight: theme.lineHeight,
          marginBottom: `${theme.paragraphSpacing * 0.8}rem`,
        }}
      >
        {children}
      </p>
    ),

    ul: ({ children }) => (
      <ul
        className="list-disc pl-5"
        style={{
          fontSize: `${theme.fontSize}px`,
          lineHeight: theme.lineHeight,
          marginBottom: `${theme.paragraphSpacing}rem`,
        }}
      >
        {children}
      </ul>
    ),

    ol: ({ children }) => (
      <ol
        className="list-decimal pl-5"
        style={{
          fontSize: `${theme.fontSize}px`,
          lineHeight: theme.lineHeight,
          marginBottom: `${theme.paragraphSpacing}rem`,
        }}
      >
        {children}
      </ol>
    ),

    li: ({ children }) => (
      <li
        className="text-gray-600"
        style={{
          fontSize: `${theme.fontSize}px`,
          lineHeight: theme.lineHeight,
          marginBottom: `${theme.paragraphSpacing * 0.3}rem`,
        }}
      >
        {children}
      </li>
    ),

    a: ({ href, children }) => (
      <a
        href={href}
        className="underline"
        style={{
          color: theme.color,
          fontSize: `${theme.fontSize}px`,
          lineHeight: theme.lineHeight,
        }}
      >
        {children}
      </a>
    ),

    strong: ({ children }) => (
      <strong
        className="font-semibold text-gray-900"
        style={{
          fontSize: `${theme.fontSize}px`,
          lineHeight: theme.lineHeight,
        }}
      >
        {children}
      </strong>
    ),

    em: ({ children }) => (
      <em
        className="italic text-gray-500"
        style={{
          fontSize: `${theme.fontSize}px`,
          lineHeight: theme.lineHeight,
        }}
      >
        {children}
      </em>
    ),

    blockquote: ({ children }) => (
      <blockquote
        className="border-l-4 pl-4 italic text-gray-600"
        style={{
          borderColor: theme.color,
          fontSize: `${theme.fontSize}px`,
          lineHeight: theme.lineHeight,
          marginBottom: `${theme.paragraphSpacing}rem`,
        }}
      >
        {children}
      </blockquote>
    ),

    code: ({ children }) => (
      <code
        className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm"
        style={{
          fontSize: `${theme.fontSize * 0.9}px`,
        }}
      >
        {children}
      </code>
    ),

    pre: ({ children }) => (
      <pre
        className="bg-gray-100 rounded p-3 overflow-x-auto font-mono"
        style={{
          fontSize: `${theme.fontSize * 0.9}px`,
          lineHeight: theme.lineHeight,
          marginBottom: `${theme.paragraphSpacing}rem`,
        }}
      >
        {children}
      </pre>
    ),

    hr: () => (
      <hr
        className="border-gray-300"
        style={{
          marginTop: `${theme.paragraphSpacing}rem`,
          marginBottom: `${theme.paragraphSpacing}rem`,
        }}
      />
    ),

    // Definition list support (for custom HTML in markdown)
    dl: ({ children }) => (
      <dl
        style={{
          fontSize: `${theme.fontSize}px`,
          lineHeight: theme.lineHeight,
          marginBottom: `${theme.paragraphSpacing}rem`,
        }}
      >
        {children}
      </dl>
    ),

    dt: ({ children }) => (
      <dt
        className="font-semibold text-gray-900"
        style={{
          fontSize: `${theme.fontSize}px`,
          lineHeight: theme.lineHeight,
        }}
      >
        {children}
      </dt>
    ),

    dd: ({ children }) => (
      <dd
        className="text-gray-500 ml-0"
        style={{
          fontSize: `${theme.fontSize}px`,
          lineHeight: theme.lineHeight,
          marginBottom: `${theme.paragraphSpacing * 0.5}rem`,
        }}
      >
        {children}
      </dd>
    ),

    // Span for inline styling (used by custom classes like .company, .job-date, etc.)
    span: ({ className, children, style }) => {
      // Handle custom CV classes
      const customStyles: React.CSSProperties = { ...style };

      if (className?.includes("company")) {
        return (
          <span className="font-semibold text-gray-900" style={customStyles}>
            {children}
          </span>
        );
      }

      if (className?.includes("job-date") || className?.includes("location-date")) {
        return (
          <span className="text-gray-500" style={customStyles}>
            {children}
          </span>
        );
      }

      if (className?.includes("highlight")) {
        return (
          <span
            className="px-1 rounded"
            style={{
              ...customStyles,
              backgroundColor: `${theme.color}26`, // 15% opacity
              color: theme.color,
            }}
          >
            {children}
          </span>
        );
      }

      return (
        <span className={className} style={customStyles}>
          {children}
        </span>
      );
    },

    // Div for block-level custom elements
    div: ({ className, children, style }) => {
      if (className?.includes("cv-header")) {
        return (
          <div className="border-b pb-3 mb-4" style={style}>
            {children}
          </div>
        );
      }

      if (className?.includes("header-item")) {
        return (
          <div className="text-gray-600" style={{ fontSize: "0.95em", ...style }}>
            {children}
          </div>
        );
      }

      return (
        <div className={className} style={style}>
          {children}
        </div>
      );
    },

    // Break tag for line breaks in header items
    br: () => <br />,
  };
}
