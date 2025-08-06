export interface CVStyleConfig {
  css?: string;
  fontSize: number;
  pagePadding: number;
  lineHeight: number;
  paragraphSpacing: number;
  themeColor: string;
}

export const generateCVStyles = (config: CVStyleConfig): string => {
  const {
    css,
    fontSize,
    pagePadding,
    lineHeight,
    paragraphSpacing,
    themeColor,
  } = config;

  const processedCSS = css
    ? css
        .split("\n")
        .map((line) =>
          line.includes(".cv-container")
            ? line.replace(".cv-container", ".cv-preview-content")
            : line.startsWith(".")
            ? `.cv-preview-content ${line}`
            : line
        )
        .join("\n")
    : "";

  const baseStyles = `
    .cv-preview-content {
      padding: ${pagePadding}px !important;
      font-size: ${fontSize}px !important;
      line-height: ${lineHeight} !important;
      text-align: left !important;
    }
    
    .cv-preview-content > *:first-child {
      margin-top: 0 !important;
    }
    
    .cv-preview-content > *:last-child {
      margin-bottom: 0 !important;
    }
  `;

  const typographyStyles = `
    .cv-preview-content h1,
    .cv-preview-content .cv-header h1 {
      color: ${themeColor} !important;
      margin-top: 0 !important;
      margin-bottom: ${paragraphSpacing}rem !important;
      font-size: ${fontSize * 2.2}px !important;
      line-height: ${lineHeight} !important;
    }
    
    .cv-preview-content h2 {
      color: ${themeColor} !important;
      margin-top: ${paragraphSpacing * 1.5}rem !important;
      margin-bottom: ${paragraphSpacing * 0.5}rem !important;
      font-size: ${fontSize * 1.6}px !important;
      line-height: ${lineHeight} !important;
    }
    
    .cv-preview-content h3 {
      color: #111827 !important;
      margin-top: ${paragraphSpacing * 1.2}rem !important;
      margin-bottom: ${paragraphSpacing * 0.4}rem !important;
      font-size: ${fontSize * 1.3}px !important;
      line-height: ${lineHeight} !important;
    }
    
    .cv-preview-content p {
      color: #4b5563 !important;
      margin-bottom: ${paragraphSpacing * 0.8}rem !important;
      font-size: ${fontSize}px !important;
      line-height: ${lineHeight} !important;
    }
    
    .cv-preview-content li {
      color: #4b5563 !important;
      margin-bottom: ${paragraphSpacing * 0.3}rem !important;
      font-size: ${fontSize}px !important;
      line-height: ${lineHeight} !important;
    }
    
    .cv-preview-content a {
      color: ${themeColor} !important;
      text-decoration: underline !important;
      font-size: ${fontSize}px !important;
      line-height: ${lineHeight} !important;
    }
    
    .cv-preview-content strong {
      color: #111827 !important;
      font-size: ${fontSize}px !important;
      line-height: ${lineHeight} !important;
    }
    
    .cv-preview-content em {
      color: #6b7280 !important;
      font-size: ${fontSize}px !important;
      line-height: ${lineHeight} !important;
    }
  `;

  const listStyles = `
    .cv-preview-content ul,
    .cv-preview-content ol {
      margin: ${
        paragraphSpacing * 0.5
      }rem 0 ${paragraphSpacing}rem 1.2rem !important;
      padding: 0 !important;
    }
    
    .cv-preview-content dl {
      margin-bottom: ${paragraphSpacing}rem !important;
    }
    
    .cv-preview-content dt {
      font-weight: 600 !important;
      color: #111827 !important;
      font-size: ${fontSize}px !important;
      line-height: ${lineHeight} !important;
    }
    
    .cv-preview-content dd {
      margin-left: 0 !important;
      margin-bottom: ${paragraphSpacing * 0.5}rem !important;
      color: #6b7280 !important;
      font-size: ${fontSize}px !important;
      line-height: ${lineHeight} !important;
    }
  `;

  return `${baseStyles}${processedCSS}${typographyStyles}${listStyles}`;
};
