"use client";
import React from "react";
import { marked } from "marked";

type MarkdownRendererProps = {
  markdown: string;
  components?: Record<string, React.ElementType>;
};

export function MarkdownRenderer({ markdown }: MarkdownRendererProps) {
  const html = marked.parse(markdown || "");
  return <div dangerouslySetInnerHTML={{ __html: html as string }} />;
}
