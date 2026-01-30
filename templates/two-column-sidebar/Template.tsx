"use client";

import React, { useMemo } from "react";
import { MarkdownRenderer, type ThemeConfig } from "@/components/MarkdownRenderer";
import { parseFrontmatter } from "@/lib/markdown";

export type Theme = ThemeConfig;

/** Parse markdown into sections by ## Title, then entries by ### Subtitle (dates) */
function parseSections(content: string): Map<string, { title: string; body: string }[]> {
  const sections = new Map<string, { title: string; body: string }[]>();
  const sectionRegex = /^##\s+(.+)$/gm;
  const entryRegex = /^###\s+(.+)$/gm;

  const parts = content.split(sectionRegex);
  // parts: [intro, sectionTitle1, sectionContent1, sectionTitle2, sectionContent2, ...]
  for (let i = 1; i < parts.length; i += 2) {
    const sectionTitle = parts[i]?.trim() ?? "";
    const sectionContent = (parts[i + 1] ?? "").trim();
    if (!sectionTitle) continue;

    const entries: { title: string; body: string }[] = [];
    const entryParts = sectionContent.split(entryRegex);
    for (let j = 1; j < entryParts.length; j += 2) {
      const entryTitle = entryParts[j]?.trim() ?? "";
      const entryBody = (entryParts[j + 1] ?? "").trim();
      entries.push({ title: entryTitle, body: entryBody });
    }
    if (entries.length > 0) {
      sections.set(sectionTitle, entries);
    } else if (sectionContent) {
      sections.set(sectionTitle, [{ title: "", body: sectionContent }]);
    }
  }
  return sections;
}

function SkillBar({ level }: { level: number }) {
  const filled = Math.min(5, Math.max(0, level));
  return (
    <span className="inline-flex gap-px align-middle" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="inline-block w-2 h-2 rounded-sm"
          style={{
            backgroundColor: i <= filled ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)",
          }}
        />
      ))}
    </span>
  );
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

  const sections = useMemo(() => parseSections(content), [content]);

  const fm = frontmatter as Record<string, unknown> | null;
  const name = fm?.name ? String(fm.name) : null;
  const photo = fm?.photo ? String(fm.photo) : null;
  const contact = (fm?.contact as Record<string, string> | undefined) ?? {};
  const about = fm?.about ? String(fm.about) : null;
  const skills = (Array.isArray(fm?.skills) ? fm.skills : []) as Array<{ name?: string; level?: number }>;

  const experienceEntries = sections.get("Experience") ?? sections.get("EXPERIENCE") ?? [];
  const educationEntries = sections.get("Education") ?? sections.get("EDUCATION") ?? [];

  const baseStyle = {
    fontSize: `${theme.fontSize}px`,
    lineHeight: theme.lineHeight,
  };

  const leftColBg = "#1e293b"; // slate-800
  const accentColor = theme.color;

  return (
    <div
      className="flex w-full bg-white text-slate-800"
      style={baseStyle}
    >
      {/* Left column ~33% - dark */}
      <div
        className="flex-shrink-0 flex flex-col p-4"
        style={{
          width: "34%",
          minWidth: "34%",
          backgroundColor: leftColBg,
          color: "white",
        }}
      >
        {/* Profile photo */}
        {photo && (
          <div className="flex justify-center mb-4">
            <img
              src={photo}
              alt=""
              className="rounded-full w-24 h-24 object-cover bg-slate-600"
            />
          </div>
        )}

        {/* About Me */}
        {about && (
          <section className="mb-5">
            <h2
              className="font-bold uppercase tracking-wide mb-2"
              style={{ fontSize: theme.fontSize * 0.95 }}
            >
              About Me
            </h2>
            <div
              className="text-white/90 whitespace-pre-line"
              style={{ fontSize: theme.fontSize * 0.9 }}
            >
              {about.split("\n\n").map((p, i) => (
                <p key={i} className="mb-2 last:mb-0">
                  {p}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h2
              className="font-bold uppercase tracking-wide mb-2"
              style={{ fontSize: theme.fontSize * 0.95 }}
            >
              Skills
            </h2>
            <ul className="space-y-1.5">
              {skills.map((s, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-2"
                  style={{ fontSize: theme.fontSize * 0.9 }}
                >
                  <span className="flex-shrink-0 truncate">
                    {s.name ?? ""}
                    {String(s.name).trim() && !String(s.name).endsWith(":") ? ":" : ""}
                  </span>
                  <SkillBar level={typeof s.level === "number" ? s.level : 0} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Right column ~66% - white */}
      <div
        className="flex-1 flex flex-col p-4 min-w-0"
        style={{ backgroundColor: "white", color: "#1e293b" }}
      >
        {/* Name + accent line + contact */}
        {name && (
          <header className="mb-4">
            <h1
              className="font-bold uppercase tracking-tight"
              style={{
                fontSize: theme.fontSize * 2,
                lineHeight: 1.1,
                color: "#1e293b",
                margin: 0,
              }}
            >
              {name}
            </h1>
            <div
              className="mt-1 h-1.5 rounded-full max-w-[66%]"
              style={{ backgroundColor: accentColor }}
            />
            {(contact.address || contact.phone || contact.email) && (
              <div
                className="mt-2 text-slate-600 space-y-0.5"
                style={{ fontSize: theme.fontSize * 0.9 }}
              >
                {contact.address && <div>{contact.address}</div>}
                {contact.phone && <div>phone: {contact.phone}</div>}
                {contact.email && <div>email: {contact.email}</div>}
              </div>
            )}
          </header>
        )}

        {/* Experience */}
        {experienceEntries.length > 0 && (
          <section className="mb-4">
            <h2
              className="font-bold uppercase tracking-wide mb-2"
              style={{
                fontSize: theme.fontSize * 1.1,
                color: "#1e293b",
              }}
            >
              Experience
            </h2>
            <div className="space-y-3">
              {experienceEntries.map((entry, i) => (
                <div key={i}>
                  <h3
                    className="font-bold uppercase text-slate-800"
                    style={{
                      fontSize: theme.fontSize * 1,
                      marginBottom: "0.25rem",
                    }}
                  >
                    {entry.title}
                  </h3>
                  {entry.body && (
                    <div
                      className="text-slate-600"
                      style={{ fontSize: theme.fontSize * 0.95 }}
                    >
                      <MarkdownRenderer content={entry.body} theme={theme} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {educationEntries.length > 0 && (
          <section>
            <h2
              className="font-bold uppercase tracking-wide mb-2"
              style={{
                fontSize: theme.fontSize * 1.1,
                color: "#1e293b",
              }}
            >
              Education
            </h2>
            <div className="space-y-3">
              {educationEntries.map((entry, i) => (
                <div key={i}>
                  <h3
                    className="font-bold uppercase text-slate-800"
                    style={{
                      fontSize: theme.fontSize * 1,
                      marginBottom: "0.25rem",
                    }}
                  >
                    {entry.title}
                  </h3>
                  {entry.body && (
                    <div
                      className="text-slate-600"
                      style={{ fontSize: theme.fontSize * 0.95 }}
                    >
                      <MarkdownRenderer content={entry.body} theme={theme} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Catch-all: any other ## sections from markdown */}
        {Array.from(sections.entries()).filter(
          ([title]) =>
            !["Experience", "EXPERIENCE", "Education", "EDUCATION"].includes(title)
        ).length > 0 && (
          <section className="mt-4">
            {Array.from(sections.entries())
              .filter(
                ([title]) =>
                  !["Experience", "EXPERIENCE", "Education", "EDUCATION"].includes(title)
              )
              .map(([sectionTitle, entries]) => (
                <div key={sectionTitle} className="mb-4">
                  <h2
                    className="font-bold uppercase tracking-wide mb-2"
                    style={{
                      fontSize: theme.fontSize * 1.1,
                      color: "#1e293b",
                    }}
                  >
                    {sectionTitle}
                  </h2>
                  {entries.map((entry, i) => (
                    <div key={i}>
                      {entry.title && (
                        <h3
                          className="font-bold uppercase text-slate-800"
                          style={{
                            fontSize: theme.fontSize * 1,
                            marginBottom: "0.25rem",
                          }}
                        >
                          {entry.title}
                        </h3>
                      )}
                      {entry.body && (
                        <MarkdownRenderer content={entry.body} theme={theme} />
                      )}
                    </div>
                  ))}
                </div>
              ))}
          </section>
        )}
      </div>
    </div>
  );
}

export const templateMeta = {
  id: "two-column-sidebar",
  name: "Two-Column Sidebar",
  description: "Dark sidebar with photo, about, skills; main column for experience and education",
};

export const sampleMarkdown = `---
name: Austin Bronson
photo: https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face
contact:
  address: "4710 Bus Boulevard, Flintstone, GA 30725"
  phone: "+(0) 1 2345 555"
  email: contact@yourdomain.com
about: |
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
skills:
  - name: Graphic Design
    level: 4
  - name: Web Develop
    level: 3
  - name: Lorem Ipsum
    level: 1
  - name: Dolor sit amet
    level: 3
  - name: Consectetur elit
    level: 5
---

## Experience

### SALES FORCE TEAM LEADER (2006 - NOW)

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

### SENIOR CONSULTANT (2004 - 2006)

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

### JUNIOR ANALYST (2000 - 2004)

Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.

## Education

### HIGH SCHOOL OF DESIGN (1996 - 1999)

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### CERTIFICATION PROGRAM (1994 - 1996)

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
`;
