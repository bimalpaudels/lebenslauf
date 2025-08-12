import React, { useMemo } from "react";
import { marked } from "marked";
import * as yaml from "js-yaml";

type Theme = {
  color: string;
  fontSize: number;
  lineHeight: number;
  pagePadding: number;
  paragraphSpacing: number;
};

function parseFrontmatter(md: string): {
  frontmatter: any | null;
  content: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = md.match(frontmatterRegex);
  if (match) {
    try {
      const frontmatter = yaml.load(match[1]);
      const content = match[2];
      return { frontmatter, content };
    } catch {
      return { frontmatter: null, content: md };
    }
  }
  return { frontmatter: null, content: md };
}

export default function Template({
  markdown,
  theme,
}: {
  markdown: string;
  theme: Theme;
}) {
  const { frontmatter, content } = useMemo(
    () => parseFrontmatter(markdown || ""),
    [markdown]
  );
  const html = useMemo(() => marked.parse(content || "") as string, [content]);

  return (
    <div
      className="bg-white text-slate-800"
      style={{
        padding: `${theme.pagePadding}px`,
        fontSize: `${theme.fontSize}px`,
        lineHeight: theme.lineHeight,
      }}
    >
      {frontmatter?.name && (
        <div className="border-b pb-3 mb-4">
          <div className="cv-header">
            <h1
              className="font-extrabold tracking-tight"
              style={{
                color: theme.color,
                margin: 0,
                fontSize: theme.fontSize * 2,
              }}
            >
              {String(frontmatter.name)}
            </h1>
            {Array.isArray((frontmatter as any).header) && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[0.95em] text-slate-600">
                {(frontmatter as any).header.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="header-item"
                    dangerouslySetInnerHTML={{
                      __html: String(item.text || ""),
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style>
        {`
          h1 { color: ${theme.color}; margin: 0 0 ${
          theme.paragraphSpacing
        }rem; font-size: ${theme.fontSize * 1.8}px; }
          h2 { color: ${theme.color}; margin: ${
          theme.paragraphSpacing * 1.5
        }rem 0 ${theme.paragraphSpacing * 0.5}rem; font-size: ${
          theme.fontSize * 1.4
        }px; }
          h3 { color: #111827; margin: ${theme.paragraphSpacing * 1.2}rem 0 ${
          theme.paragraphSpacing * 0.4
        }rem; font-size: ${theme.fontSize * 1.2}px; }
          p  { color: #4b5563; margin: 0 0 ${theme.paragraphSpacing * 0.8}rem; }
          ul, ol { margin: 0 0 ${
            theme.paragraphSpacing
          }rem; padding-left: 1.25rem; }
          li { margin-bottom: ${theme.paragraphSpacing * 0.3}rem; }
          a { color: ${theme.color}; text-decoration: underline; }
          .company { color: #111827; font-weight: 600; }
          .job-date, .location-date { color: #6b7280; }
          .highlight { background: rgba(62, 207, 142, 0.15); color: #065f46; padding: 0 0.25rem; border-radius: 0.25rem; }
        `}
      </style>

      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
