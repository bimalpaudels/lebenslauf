"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { createMarkdownComponents, type ThemeConfig } from "@/lib/markdown-components";

export type { ThemeConfig };

interface MarkdownRendererProps {
  /** The markdown content to render */
  content: string;
  /** Theme configuration for styling */
  theme: ThemeConfig;
  /** Optional additional className for the wrapper */
  className?: string;
}

/**
 * MarkdownRenderer - Renders markdown content using react-markdown
 * with Tailwind-styled components.
 *
 * Uses rehype-raw to support raw HTML in markdown (for spans, custom classes, etc.)
 */
export function MarkdownRenderer({
  content,
  theme,
  className,
}: MarkdownRendererProps) {
  const components = useMemo(
    () => createMarkdownComponents(theme),
    [theme]
  );

  return (
    <div className={className}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/**
 * MarkdownRendererFromHtml - Renders HTML content (from page breaking)
 * using react-markdown with rehype-raw.
 *
 * This is useful for rendering pre-split HTML page content while still
 * getting the benefits of Tailwind-styled components.
 */
export function MarkdownRendererFromHtml({
  html,
  theme,
  className,
}: {
  html: string;
  theme: ThemeConfig;
  className?: string;
}) {
  const components = useMemo(
    () => createMarkdownComponents(theme),
    [theme]
  );

  // Wrap HTML in a div so react-markdown can parse it via rehype-raw
  return (
    <div className={className}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {html}
      </ReactMarkdown>
    </div>
  );
}
