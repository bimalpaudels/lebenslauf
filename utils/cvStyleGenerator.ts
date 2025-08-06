export interface CVStyleConfig {
  css?: string;
  fontSize: number;
  pagePadding: number;
  lineHeight: number;
  paragraphSpacing: number;
  themeColor: string;
  className?: string;
}

export const generateCVStyles = (config: CVStyleConfig): string => {
  const {
    css,
    fontSize,
    pagePadding,
    lineHeight,
    paragraphSpacing,
    themeColor,
    className = "cv-preview-content",
  } = config;

  const processedCSS = css
    ? css
        .split("\n")
        .map((line) =>
          line.includes(".cv-container")
            ? line.replace(".cv-container", `.${className}`)
            : line.startsWith(".")
            ? `.${className} ${line}`
            : line
        )
        .join("\n")
    : "";

  const baseStyles = `
    .${className} {
      padding: ${pagePadding}px !important;
      font-size: ${fontSize}px !important;
      line-height: ${lineHeight} !important;
      text-align: left !important;
    }
    
    .${className} > *:first-child {
      margin-top: 0 !important;
    }
    
    .${className} > *:last-child {
      margin-bottom: 0 !important;
    }
  `;

  const typographyStyles = `
    .${className} h1,
    .${className} .cv-header h1 {
      color: ${themeColor} !important;
      margin-top: 0 !important;
      margin-bottom: ${paragraphSpacing}rem !important;
      font-size: ${fontSize * 2.2}px !important;
      line-height: ${lineHeight} !important;
    }
    
    .${className} h2 {
      color: ${themeColor} !important;
      margin-top: ${paragraphSpacing * 1.5}rem !important;
      margin-bottom: ${paragraphSpacing * 0.5}rem !important;
      font-size: ${fontSize * 1.6}px !important;
      line-height: ${lineHeight} !important;
    }
    
    .${className} h3 {
      color: #111827 !important;
      margin-top: ${paragraphSpacing * 1.2}rem !important;
      margin-bottom: ${paragraphSpacing * 0.4}rem !important;
      font-size: ${fontSize * 1.3}px !important;
      line-height: ${lineHeight} !important;
    }
    
    .${className} p {
      color: #4b5563 !important;
      margin-bottom: ${paragraphSpacing * 0.8}rem !important;
      font-size: ${fontSize}px !important;
      line-height: ${lineHeight} !important;
    }
    
    .${className} li {
      color: #4b5563 !important;
      margin-bottom: ${paragraphSpacing * 0.3}rem !important;
      font-size: ${fontSize}px !important;
      line-height: ${lineHeight} !important;
    }
    
    .${className} a {
      color: ${themeColor} !important;
      text-decoration: underline !important;
      font-size: ${fontSize}px !important;
      line-height: ${lineHeight} !important;
    }
    
    .${className} strong {
      color: #111827 !important;
      font-size: ${fontSize}px !important;
      line-height: ${lineHeight} !important;
    }
    
    .${className} em {
      color: #6b7280 !important;
      font-size: ${fontSize}px !important;
      line-height: ${lineHeight} !important;
    }
  `;

  const listStyles = `
    .${className} ul,
    .${className} ol {
      margin: ${
        paragraphSpacing * 0.5
      }rem 0 ${paragraphSpacing}rem 1.2rem !important;
      padding: 0 !important;
    }
    
    .${className} dl {
      margin-bottom: ${paragraphSpacing}rem !important;
    }
    
    .${className} dt {
      font-weight: 600 !important;
      color: #111827 !important;
      font-size: ${fontSize}px !important;
      line-height: ${lineHeight} !important;
    }
    
    .${className} dd {
      margin-left: 0 !important;
      margin-bottom: ${paragraphSpacing * 0.5}rem !important;
      color: #6b7280 !important;
      font-size: ${fontSize}px !important;
      line-height: ${lineHeight} !important;
    }
    
    .${className} .company,
    .${className} .job-date,
    .${className} .location-date,
    .${className} .award-year,
    .${className} .header-item {
      font-size: ${fontSize}px !important;
      line-height: ${lineHeight} !important;
    }
  `;

  return `${baseStyles}${processedCSS}${typographyStyles}${listStyles}`;
};
