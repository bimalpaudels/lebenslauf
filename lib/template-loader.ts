import { marked } from "marked";
import * as yaml from "js-yaml";

// Configure marked for better HTML output
marked.setOptions({
  breaks: true,
  gfm: true,
});

export interface FileBasedTemplate {
  id: string;
  name: string;
  description: string;
  markdownPath: string;
  cssPath: string;
}

interface ParsedMarkdown {
  frontmatter: Record<string, unknown> | null;
  content: string;
}

function parseFrontmatter(markdown: string): ParsedMarkdown {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (match) {
    try {
      const frontmatter = yaml.load(match[1]) as Record<string, unknown> | null;
      const content = match[2];
      return { frontmatter, content };
    } catch (error) {
      console.error("Error parsing YAML frontmatter:", error);
      return { frontmatter: null, content: markdown };
    }
  }

  return { frontmatter: null, content: markdown };
}

function renderHeader(frontmatter: Record<string, unknown> | null): string {
  if (!frontmatter || !frontmatter.name) return "";

  let headerHtml = `<div class="cv-header">
    <h1>${frontmatter.name as string}</h1>`;

  if (frontmatter.header && Array.isArray(frontmatter.header)) {
    (frontmatter.header as Array<Record<string, unknown>>).forEach((item) => {
      const className = (item.newLine as boolean)
        ? "header-item new-line"
        : "header-item";
      if (item.link) {
        headerHtml += `<div class="${className}"><a href="${
          item.link as string
        }">${item.text as string}</a></div>`;
      } else {
        headerHtml += `<div class="${className}">${item.text as string}</div>`;
      }
    });
  }

  headerHtml += `</div>`;
  return headerHtml;
}

export async function loadTemplateContent(template: FileBasedTemplate) {
  try {
    const [markdownResponse, cssResponse] = await Promise.all([
      fetch(template.markdownPath),
      fetch(template.cssPath),
    ]);

    if (!markdownResponse.ok || !cssResponse.ok) {
      throw new Error("Failed to load template files");
    }

    const [markdownContent, cssContent] = await Promise.all([
      markdownResponse.text(),
      cssResponse.text(),
    ]);

    return {
      markdown: markdownContent,
      css: cssContent,
      html: parseMarkdownToHtml(markdownContent),
    };
  } catch (error) {
    console.error("Error loading template:", error);
    return {
      markdown: "",
      css: "",
      html: "",
    };
  }
}

export function parseMarkdownToHtml(markdown: string): string {
  const { frontmatter, content } = parseFrontmatter(markdown);
  const headerHtml = renderHeader(frontmatter);
  const contentHtml = marked(content);

  return `<div class="cv-container">${headerHtml}${contentHtml}</div>`;
}

// Available file-based templates
export const fileBasedTemplates: FileBasedTemplate[] = [
  {
    id: "modern-professional",
    name: "Modern Professional",
    description:
      "Clean, modern design with blue accent colors and professional layout",
    markdownPath: "/templates/modern-professional/modern-professional.md",
    cssPath: "/templates/modern-professional/modern-professional.css",
  },
  {
    id: "clean-professional",
    name: "Clean Professional",
    description:
      "Traditional academic/professional layout with Times New Roman and blue accents",
    markdownPath: "/templates/clean-professional/template.md",
    cssPath: "/templates/clean-professional/template.css",
  },
];

export function getFileBasedTemplateById(
  id: string
): FileBasedTemplate | undefined {
  return fileBasedTemplates.find((template) => template.id === id);
}
