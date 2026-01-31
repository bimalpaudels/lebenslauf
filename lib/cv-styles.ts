import type { ThemeConfig } from "./markdown-components";

/**
 * Generates CSS typography styles for CV elements.
 * Used for consistent styling across page breaking measurement, preview, and PDF export.
 */
export function generateTypographyStyles(
  theme: ThemeConfig,
  selector: string
): string {
  const { color, fontSize, lineHeight, paragraphSpacing } = theme;

  return `
    ${selector} h1 {
      color: ${color};
      margin-top: 0;
      margin-bottom: ${paragraphSpacing}rem;
      line-height: ${lineHeight};
      font-size: ${fontSize * 1.8}px !important;
      font-weight: bold;
    }
    
    ${selector} h2 {
      color: ${color};
      margin-top: ${paragraphSpacing * 1.5}rem;
      margin-bottom: ${paragraphSpacing * 0.5}rem;
      line-height: ${lineHeight};
      font-size: ${fontSize * 1.4}px !important;
      font-weight: bold;
    }
    
    ${selector} h3 {
      color: #111827;
      margin-top: ${paragraphSpacing * 1.2}rem;
      margin-bottom: ${paragraphSpacing * 0.4}rem;
      line-height: ${lineHeight};
      font-size: ${fontSize * 1.2}px !important;
      font-weight: 600;
    }
    
    ${selector} p {
      color: #4b5563;
      margin-bottom: ${paragraphSpacing * 0.8}rem;
      line-height: ${lineHeight};
      font-size: ${fontSize}px !important;
    }
    
    ${selector} li {
      color: #4b5563;
      margin-bottom: ${paragraphSpacing * 0.3}rem;
      line-height: ${lineHeight};
      font-size: ${fontSize}px !important;
    }
    
    ${selector} ul, ${selector} ol {
      margin-bottom: ${paragraphSpacing}rem;
      padding-left: 1.5rem;
      line-height: ${lineHeight};
      font-size: ${fontSize}px !important;
    }
    
    ${selector} a {
      color: ${color};
      text-decoration: underline;
      line-height: ${lineHeight};
      font-size: ${fontSize}px !important;
    }
    
    ${selector} strong {
      color: #111827;
      font-weight: 600;
      line-height: ${lineHeight};
      font-size: ${fontSize}px !important;
    }
    
    ${selector} em {
      color: #6b7280;
      font-style: italic;
      line-height: ${lineHeight};
      font-size: ${fontSize}px !important;
    }
    
    ${selector} dl {
      margin-bottom: ${paragraphSpacing}rem;
      line-height: ${lineHeight};
      font-size: ${fontSize}px !important;
    }
    
    ${selector} dt {
      font-weight: 600;
      color: #111827;
      line-height: ${lineHeight};
      font-size: ${fontSize}px !important;
    }
    
    ${selector} dd {
      margin-left: 0;
      margin-bottom: ${paragraphSpacing * 0.5}rem;
      color: #6b7280;
      line-height: ${lineHeight};
      font-size: ${fontSize}px !important;
    }
    
    ${selector} blockquote {
      border-left: 4px solid ${color};
      padding-left: 1rem;
      font-style: italic;
      color: #4b5563;
      margin-bottom: ${paragraphSpacing}rem;
    }
    
    ${selector} code {
      background: #f3f4f6;
      border-radius: 0.25rem;
      padding: 0 0.25rem;
      font-family: monospace;
      font-size: ${fontSize * 0.9}px;
    }
    
    ${selector} pre {
      background: #f3f4f6;
      border-radius: 0.25rem;
      padding: 0.75rem;
      overflow-x: auto;
      font-family: monospace;
      font-size: ${fontSize * 0.9}px;
      margin-bottom: ${paragraphSpacing}rem;
    }
    
    ${selector} hr {
      border: none;
      border-top: 1px solid #d1d5db;
      margin: ${paragraphSpacing}rem 0;
    }
  `;
}

/**
 * Scopes template CSS to a specific selector.
 */
export function scopeTemplateCss(
  templateCss: string,
  selector: string
): string {
  return templateCss
    .split("\n")
    .map((line) => {
      if (line.includes(".cv-container")) {
        return line.replace(".cv-container", selector);
      }
      if (line.trim().startsWith(".") && !line.includes(selector)) {
        return `${selector} ${line}`;
      }
      return line;
    })
    .join("\n");
}
