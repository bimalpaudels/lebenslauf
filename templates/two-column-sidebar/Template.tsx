"use client";

import React, { useMemo } from "react";
import { MarkdownRenderer, type ThemeConfig } from "@/components/MarkdownRenderer";
import { marked } from "marked";

export type Theme = ThemeConfig;

/** 
 * Parse full markdown into structure:
 * - name: first H1
 * - photo: first image found
 * - contact: text in header area (content before first H2 or H3)
 * - leftSections: H2 sections (## Title) and their content
 * - rightSections: H3 sections (### Title) and their content
 */
function parseCVContent(content: string) {
  const tokens = marked.lexer(content);
  
  let name = "";
  let photo = "";
  let contact = "";
  
  const leftSections: { title: string; body: string }[] = [];
  const rightSections: { title: string; body: string }[] = [];
  
  // Current section pointer
  let currentSection: { title: string; body: string } | null = null;
  
  // Header zone collection
  let inHeader = true;
  let headerTextParts: string[] = [];

  for (const token of tokens) {
    if (token.type === 'heading') {
      if (token.depth === 1 && !name) {
        name = token.text;
        continue; // Don't add name to body
      }
      
      // H2 -> Left Column
      if (token.depth === 2) {
        if (inHeader) {
          inHeader = false;
          contact = headerTextParts.join("\n").trim();
        }
        currentSection = { title: token.text, body: "" };
        leftSections.push(currentSection);
        continue;
      }
      
      // H3 -> Right Column
      if (token.depth === 3) {
         if (inHeader) {
          inHeader = false;
          contact = headerTextParts.join("\n").trim();
        }
        currentSection = { title: token.text, body: "" };
        rightSections.push(currentSection);
        continue;
      }
      
      // H4+ -> Treated as content inside the current section
      // Will be appended via default case relative to token.raw
    }
    
    // Extract photo from first image found
    if (token.type === 'paragraph' || token.type === 'image') {
       // Check for image syntax in text if it's a paragraph
       const text = (token as any).text || "";
       const imgMatch = text.match(/!\[.*?\]\((.*?)\)/);
       
       if (imgMatch && !photo) {
         photo = imgMatch[1];
         // Remove image from text to avoid duplicating it in the body/header
         const textWithoutImg = text.replace(/!\[.*?\]\((.*?)\)/, "").trim();
         
         if (!textWithoutImg) continue; // If only image, skip adding this token to body
         // Update token text to be the remainder
         (token as any).text = textWithoutImg; 
         // Note: token.raw usually contains the original. 
         // If we rely on token.raw for body appending, we might duplicate the image if we aren't careful.
         // But for simplicity, if we are in a section, we often append token.raw.
         // Let's modify token.raw too if possible or handle appending carefully.
         // This is a bit hacky, but 'marked' tokens are mutable.
       }
    }
    
    if (inHeader) {
      if (token.type === 'paragraph' || token.type === 'text') {
        const text = (token as any).text || (token as any).raw;
        // Don't include the image mark we just extracted
        const cleanText = text.replace(/!\[.*?\]\((.*?)\)/, "").trim();
        if (cleanText) headerTextParts.push(cleanText);
      }
      if (token.type === 'list') {
        const items = (token as any).items.map((i: any) => i.text).join(" • ");
        headerTextParts.push(items);
      }
    } else {
      // In a section (Left or Right)
      if (currentSection) {
        // Look out for the image we extracted so we don't re-render it
        let rawContent = (token as any).raw;
        // Simple heuristic: if raw content contains the exact photo URL and we found it, 
        // we might NOT want to include it.
        // But for consistency: user might want image in body too?
        // Usually sidebar photo is removed from body.
        if (photo && rawContent.includes(photo)) {
            // strip it locally
            // This regex covers standard image syntax
            rawContent = rawContent.replace(/!\[.*?\]\(.*?\)/, "").trim();
        }
        
        currentSection.body += rawContent;
      }
    }
  }
  
  // If we ended still in header (no sections)
  if (inHeader) {
     contact = headerTextParts.join("\n").trim();
  }

  return { name, photo, contact, leftSections, rightSections };
}

export default function Template({
  markdown,
  theme,
}: {
  markdown: string;
  theme: Theme;
}) {
  const { name, photo, contact, leftSections, rightSections } = useMemo(
    () => parseCVContent(markdown || ""),
    [markdown]
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
      id="cv-template"
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

        {/* Left Sections (##) */}
        {leftSections.map((section, i) => (
            <section key={i} className="mb-5">
                <h2
                className="font-bold uppercase tracking-wide mb-2"
                style={{ fontSize: theme.fontSize * 0.95 }}
                >
                {section.title}
                </h2>
                <div
                className="text-white/90 whitespace-pre-line"
                style={{ fontSize: theme.fontSize * 0.9 }}
                >
                {/* Force white text theme for left column */}
                <MarkdownRenderer content={section.body} theme={{...theme, color: "white"}} />
                </div>
            </section>
        ))}

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

        {/* Right Sections (###) */}
        {rightSections.map((section, i) => (
             <section key={i} className="mb-4">
             <h2
               className="font-bold uppercase tracking-wide mb-2"
               style={{
                 fontSize: theme.fontSize * 1.1,
                 color: "#1e293b",
               }}
             >
               {section.title}
             </h2>
             <div className="text-slate-600" style={{ fontSize: theme.fontSize * 0.95 }}>
               <MarkdownRenderer content={section.body} theme={theme} />
             </div>
           </section>
        ))}
      </div>
    </div>
  );
}

export const templateMeta = {
  id: "two-column-sidebar",
  name: "Two-Column Sidebar",
  description: "Dark sidebar (## headers) and main column (### headers). Fully flexible two-column layout.",
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

### Experience

#### SALES FORCE TEAM LEADER (2006 - NOW)

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

#### SENIOR CONSULTANT (2004 - 2006)

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

#### JUNIOR ANALYST (2000 - 2004)

Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.

### Education

#### HIGH SCHOOL OF DESIGN (1996 - 1999)

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

#### CERTIFICATION PROGRAM (1994 - 1996)

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
`;
