"use client";

import React, { useMemo } from "react";
import { MarkdownRenderer, type ThemeConfig } from "@/components/MarkdownRenderer";
import { marked } from "marked";

export type Theme = ThemeConfig;

/** 
 * Parse full markdown into structure:
 * - name: first H1
 * - photo: first image
 * - contact: text in header area (content before first H2) excluding name/photo
 * - sections: map of H2 -> content
 */
function parseCVContent(content: string) {
  const tokens = marked.lexer(content);
  
  let name = "";
  let photo = "";
  let contact = "";
  let about = "";
  let skills: { name: string; level: number }[] = [];
  
  const sections = new Map<string, { title: string; body: string }[]>();
  
  // 1. Extract Name (first H1) & Photo (first Image)
  // And identify where the "body" starts (first H2)
  
  let currentSectionTitle = "";
  let currentEntryTitle = "";
  let currentEntryBody = "";
  
  // Helper to commit current entry
  const commitEntry = () => {
    if (!currentSectionTitle) return;
    
    // Check if this section is About or Skills and we should handle differently?
    // Actually, let's store everything in sections map first, then extract specific ones if needed.
    
    const entries = sections.get(currentSectionTitle) || [];
    // If we have an entry title or body, push it
    if (currentEntryTitle || currentEntryBody.trim()) {
       entries.push({ title: currentEntryTitle, body: currentEntryBody.trim() });
    } else if (entries.length === 0 && !currentEntryTitle && !currentEntryBody.trim()) {
       // Just initialized section
    }
    
    if (entries.length > 0) sections.set(currentSectionTitle, entries);
    
    currentEntryTitle = "";
    currentEntryBody = "";
  };

  // Header zone collection
  let inHeader = true;
  let headerTextParts: string[] = [];

  for (const token of tokens) {
    if (token.type === 'heading') {
      if (token.depth === 1 && !name) {
        name = token.text;
        continue; // Don't add name to body
      }
      if (token.depth === 2) {
        if (inHeader) {
          inHeader = false;
          // Process collected header text into contact info
          contact = headerTextParts.join("\n").trim();
        }
        commitEntry();
        currentSectionTitle = token.text;
        continue;
      }
      if (token.depth === 3) {
         commitEntry();
         currentEntryTitle = token.text;
         continue;
      }
    }
    
    // Extract photo from first image found anywhere (or just in header?) 
    // User said "First Image".
    if (token.type === 'paragraph') {
       const imgMatch = token.text.match(/!\[.*?\]\((.*?)\)/);
       if (imgMatch && !photo) {
         photo = imgMatch[1];
         // If the paragraph was JUST the image, don't add it to content?
         // If it has other text, maybe keep text?
         // For simplicity, let's assume image line is separate.
         const textWithoutImg = token.text.replace(/!\[.*?\]\((.*?)\)/, "").trim();
         if (!textWithoutImg) continue; 
         // If text remains, treat as normal token
         token.text = textWithoutImg; 
       }
    }
    
    if (inHeader) {
      if (token.type === 'paragraph' || token.type === 'text') {
        const text = (token as any).text || (token as any).raw;
        if (text) headerTextParts.push(text);
      }
      // Lists in header?
      if (token.type === 'list') {
        const items = (token as any).items.map((i: any) => i.text).join(" • ");
        headerTextParts.push(items);
      }
    } else {
      // In a section
      if (currentSectionTitle) {
        // Accumulate raw markdown for body
        currentEntryBody += (token as any).raw;
      }
    }
  }
  
  commitEntry(); // Commit last entry

  // Extract special sections
  
  // About - case insensitive check
  let aboutKey = "";
  for(const k of sections.keys()) {
     if (k.toLowerCase() === "about") { aboutKey = k; break; }
  }
  
  if (aboutKey) {
     const entries = sections.get(aboutKey);
     if (entries) {
        about = entries.map(e => e.body).join("\n\n");
     }
     sections.delete(aboutKey);
  }
  
  // Skills - case insensitive check
  let skillsKey = "";
  for (const k of sections.keys()) {
      if (k.toLowerCase() === "skills") { skillsKey = k; break; }
  }
  
  if (skillsKey) {
      const entries = sections.get(skillsKey);
      if (entries) {
        const rawSkills = entries.map(e => e.body).join("\n");
        const skillMatches = rawSkills.matchAll(/^\s*[-*]\s+(.*)$/gm);
        for (const match of skillMatches) {
           const line = match[1];
           const levelMatch = line.match(/(.*?)\s*\(Level\s*(\d+)\)/i);
           if (levelMatch) {
             skills.push({ name: levelMatch[1], level: parseInt(levelMatch[2]) });
           } else {
             skills.push({ name: line, level: 3 });
           }
        }
      }
      sections.delete(skillsKey);
  }

  return { name, photo, contact, about, skills, sections };
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
  const { name, photo, contact, about, skills, sections } = useMemo(
    () => parseCVContent(markdown || ""),
    [markdown]
  );

  const experienceEntries = sections.get("Experience") ?? sections.get("EXPERIENCE") ?? [];
  const educationEntries = sections.get("Education") ?? sections.get("EDUCATION") ?? [];

  // Identify catch-all sections (everything else)
  const otherSections = Array.from(sections.entries()).filter(
    ([title]) =>
      !["Experience", "EXPERIENCE", "Education", "EDUCATION"].includes(title)
  );

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
              <MarkdownRenderer content={about} theme={{...theme, color: "white"}} />
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
            {contact && (
              <div
                className="mt-2 text-slate-600 space-y-0.5 whitespace-pre-line"
                style={{ fontSize: theme.fontSize * 0.9 }}
              >
                  {contact}
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
        {otherSections.length > 0 && (
          <section className="mt-4">
            {otherSections.map(([sectionTitle, entries]) => (
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
  description: "Dark sidebar with photo, about, skills; main column for experience and education. Fully markdown driven.",
};

export const sampleMarkdown = `# Austin Bronson

![Profile Photo](https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face)

4710 Bus Boulevard, Flintstone, GA 30725 • +(0) 1 2345 555 • contact@yourdomain.com

## About

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Skills

- Graphic Design (Level 4)
- Web Develop (Level 3)
- Lorem Ipsum (Level 1)
- Dolor sit amet (Level 3)
- Consectetur elit (Level 5)

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
