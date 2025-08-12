import * as yaml from "js-yaml";

export type ParsedFrontmatter = {
  frontmatter: any | null;
  content: string;
};

export function parseFrontmatter(markdown: string): ParsedFrontmatter {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (match) {
    try {
      const frontmatter = yaml.load(match[1]);
      const content = match[2];
      return { frontmatter, content };
    } catch {
      return { frontmatter: null, content: markdown };
    }
  }

  return { frontmatter: null, content: markdown };
}
