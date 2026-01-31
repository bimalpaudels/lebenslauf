import TurndownService from "turndown";
import { marked } from "marked";
import * as yaml from "js-yaml";

// Configure marked for HTML conversion
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Configure Turndown for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
});

// Custom rule to handle line breaks properly
turndownService.addRule("lineBreak", {
  filter: "br",
  replacement: () => "\n",
});

// Custom rule to handle paragraphs with proper spacing
turndownService.addRule("paragraph", {
  filter: "p",
  replacement: (content) => {
    return content.trim() ? `\n\n${content.trim()}\n\n` : "";
  },
});

/**
 * Convert markdown body to HTML for TipTap
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown.trim()) return "";
  return marked.parse(markdown) as string;
}

/**
 * Convert HTML from TipTap to markdown
 */
export function htmlToMarkdown(html: string): string {
  if (!html.trim()) return "";
  
  // Clean up the HTML before conversion
  const cleanHtml = html
    .replace(/<p><br><\/p>/g, "\n") // Empty paragraphs to newlines
    .replace(/<br\s*\/?>/g, "\n"); // BR tags to newlines
  
  const markdown = turndownService.turndown(cleanHtml);
  
  // Clean up excessive newlines
  return markdown
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Convert full CV markdown to editor-ready HTML.
 * If frontmatter exists, it is converted to markdown content (headers, text) and appended to the body.
 */
export function cvMarkdownToEditorContent(markdown: string): {
  bodyHtml: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (match) {
    try {
      const frontmatter = yaml.load(match[1]) as Record<string, unknown>;
      const body = match[2].trim();

      // Migrate frontmatter to body
      let migratedContent = "";

      // Name -> H1
      if (typeof frontmatter.name === 'string' && frontmatter.name) {
        migratedContent += `# ${frontmatter.name}\n\n`;
      }

      // Contact info (Header items)
      if (Array.isArray(frontmatter.header)) {
        const contactLine = (frontmatter.header as { text: string }[])
          .map((item) => item.text)
          .filter(Boolean)
          .join(" • ");
        if (contactLine) {
          migratedContent += `${contactLine}\n\n`;
        }
      }

      // About
      if (typeof frontmatter.about === 'string' && frontmatter.about) {
        migratedContent += `## About\n\n${frontmatter.about}\n\n`;
      }

      // Skills
      if (Array.isArray(frontmatter.skills)) {
        migratedContent += `## Skills\n\n`;
        (frontmatter.skills as (string | { name: string; level?: string | number })[]).forEach((skill) => {
          const name = typeof skill === 'string' ? skill : skill.name;
          const level = (typeof skill !== 'string' && skill.level) ? ` (Level ${skill.level})` : "";
          migratedContent += `- ${name}${level}\n`;
        });
        migratedContent += `\n`;
      }

      // Photo - explicitly handled? 
      // User said "Photo: First Image". If it was in frontmatter 'photo', we should convert it to an image markdown.
      if (typeof frontmatter.photo === 'string' && frontmatter.photo) {
        // Prepend photo before name? or after? 
        // "Name: First H1". "Photo: First Image". 
        // Let's put photo first or second.
        // Let's put it after name for now, or before. 
        // Standard markdown: Image can be anywhere.
        migratedContent = `![](${frontmatter.photo})\n\n` + migratedContent;
      }

      const fullMarkdown = migratedContent + body;
      
      // Escape image syntax so it is treated as text in the editor
      const escapedMarkdown = fullMarkdown.replace(/!\[(.*?)\]\((.*?)\)/g, '\\![$1]($2)');
      
      return { bodyHtml: markdownToHtml(escapedMarkdown) };

    } catch {
      // If parsing fails, just return original markdown as body
       // Escape image syntax here too
      const escapedMarkdown = markdown.replace(/!\[(.*?)\]\((.*?)\)/g, '\\![$1]($2)');
      return { bodyHtml: markdownToHtml(escapedMarkdown) };
    }
  }

  // Escape image syntax for pure markdown too
  const escaped = markdown.replace(/!\[(.*?)\]\((.*?)\)/g, '\\![$1]($2)');
  return { bodyHtml: markdownToHtml(escaped) };
}

/**
 * Convert editor content back to CV markdown
 */
export function editorContentToCVMarkdown(
  bodyHtml: string
): string {
  let markdown = htmlToMarkdown(bodyHtml);
  // Unescape image syntax if it was double escaped or just ensure it's clean
  // If Tiptap rendered `![...]` as text, Turndown outputs `![...]`.
  // If we had `\!` it might be `\!`. we want to remove the backslash if present start of line or similar.
  // Actually, Turndown might escape the `[` or `!`.
  // Let's just strip the backslash escape if it precedes an image pattern
  markdown = markdown.replace(/\\!\[/g, '![');
  
  return markdown;
}
