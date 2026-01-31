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

export type CVFrontmatter = Record<string, unknown> & {
  name: string;
  header: { text: string }[];
};

export interface ParsedCV {
  frontmatter: CVFrontmatter;
  body: string;
}

/**
 * Parse CV markdown into frontmatter and body
 */
export function parseMarkdownContent(markdown: string): ParsedCV {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  const defaultFrontmatter: CVFrontmatter = {
    name: "",
    header: [],
  };

  if (match) {
    try {
      const parsed = yaml.load(match[1]) as Record<string, unknown>;
      return {
        frontmatter: {
          ...defaultFrontmatter,
          ...parsed,
          name: typeof parsed?.name === 'string' ? parsed.name : defaultFrontmatter.name,
          header: Array.isArray(parsed?.header) ? parsed.header : defaultFrontmatter.header,
        },
        body: match[2].trim(),
      };
    } catch {
      return {
        frontmatter: defaultFrontmatter,
        body: markdown,
      };
    }
  }

  return {
    frontmatter: defaultFrontmatter,
    body: markdown,
  };
}

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
 * Build full CV markdown from frontmatter and body
 */
export function buildCVMarkdown(frontmatter: CVFrontmatter, body: string): string {
  const yamlStr = yaml.dump(frontmatter, {
    lineWidth: -1,
    noRefs: true,
  });

  return `---\n${yamlStr.trim()}\n---\n\n${body.trim()}\n`;
}

/**
 * Convert full CV markdown to editor-ready HTML
 * Returns the frontmatter separately and HTML for the body
 */
export function cvMarkdownToEditorContent(markdown: string): {
  frontmatter: CVFrontmatter;
  bodyHtml: string;
} {
  const { frontmatter, body } = parseMarkdownContent(markdown);
  const bodyHtml = markdownToHtml(body);
  
  return { frontmatter, bodyHtml };
}

/**
 * Convert editor content back to CV markdown
 */
export function editorContentToCVMarkdown(
  frontmatter: CVFrontmatter,
  bodyHtml: string
): string {
  const body = htmlToMarkdown(bodyHtml);
  return buildCVMarkdown(frontmatter, body);
}
