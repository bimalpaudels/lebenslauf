import * as yaml from "js-yaml";
import { parseFrontmatter } from "@/lib/markdown";

export interface HeaderBlock {
  type: "header";
  name: string;
  headerItems: { text: string }[];
}

export interface SectionBlock {
  type: "section";
  id: string;
  title: string;
  content: string;
}

export type CVBlock = HeaderBlock | SectionBlock;

export function generateSectionId(): string {
  return `section-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Split body (markdown after frontmatter) into sections by ## headings.
 * Each section has a title (first line after ##) and content (rest).
 * If body has no ##, the whole body is one section with empty title.
 */
function parseBodySections(body: string): { title: string; content: string }[] {
  const trimmed = body.trim();
  if (!trimmed) return [];

  // Split by newline followed by ## and optional space
  const parts = trimmed.split(/\n##\s+/);

  return parts.map((part, index) => {
    const trimmedPart = part.trim();
    if (!trimmedPart) {
      return { title: "", content: "" };
    }
    // First part: might not have a ## prefix (content before first ##)
    if (index === 0 && !trimmed.startsWith("##")) {
      return { title: "", content: trimmedPart };
    }
    // First part may start with "## Title" when body starts with ##
    const afterHash = trimmedPart.startsWith("##")
      ? trimmedPart.replace(/^##\s*/, "")
      : trimmedPart;
    const firstNewline = afterHash.indexOf("\n");
    if (firstNewline === -1) {
      return { title: afterHash.trim(), content: "" };
    }
    const title = afterHash.slice(0, firstNewline).trim();
    const content = afterHash.slice(firstNewline + 1).trim();
    return { title, content };
  }).filter((s) => s.title !== "" || s.content !== "");
}

/**
 * Parse a full CV markdown string into blocks (Header + Section blocks).
 */
export function markdownToBlocks(markdown: string): CVBlock[] {
  const { frontmatter, content: body } = parseFrontmatter(markdown || "");

  const blocks: CVBlock[] = [];

  // Header block from frontmatter
  const name =
    frontmatter && typeof frontmatter.name === "string"
      ? frontmatter.name
      : "";
  const headerRaw = frontmatter?.header;
  const headerItems: { text: string }[] = Array.isArray(headerRaw)
    ? headerRaw.map((item: unknown) => {
        const obj = item as Record<string, unknown>;
        return { text: String(obj?.text ?? "") };
      })
    : [];

  blocks.push({ type: "header", name, headerItems });

  // Section blocks from body
  const sections = parseBodySections(body);
  for (const { title, content } of sections) {
    blocks.push({
      type: "section",
      id: generateSectionId(),
      title,
      content,
    });
  }

  return blocks;
}

/**
 * Serialize blocks back to full CV markdown (frontmatter + body).
 */
export function blocksToMarkdown(blocks: CVBlock[]): string {
  const headerBlock = blocks[0];
  if (!headerBlock || headerBlock.type !== "header") {
    // Fallback: minimal frontmatter + empty body
    return "---\nname: \"\"\nheader: []\n---\n\n";
  }

  const frontmatterObj: Record<string, unknown> = {
    name: headerBlock.name,
    header: headerBlock.headerItems.map((item) => ({
      text: item.text ?? "",
    })),
  };

  const yamlStr = yaml.dump(frontmatterObj, {
    lineWidth: -1,
    noRefs: true,
  });

  const sectionBlocks = blocks.slice(1).filter((b): b is SectionBlock => b.type === "section");
  const bodyParts = sectionBlocks.map((b) => {
    const titleLine = b.title ? `## ${b.title}` : "";
    const content = b.content.trim();
    return content ? `${titleLine}\n\n${content}` : titleLine;
  });
  const body = bodyParts.join("\n\n").trim();

  return `---\n${yamlStr.trim()}\n---\n\n${body}\n`;
}
