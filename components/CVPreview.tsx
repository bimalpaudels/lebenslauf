"use client";

import React, { useMemo, useState, useEffect } from "react";
import { parseMarkdownToHtml } from "@/lib/template-loader";

interface CVPreviewProps {
  markdown: string;
  css: string;
  pageFormat?: "A4" | "Letter";
  fontSize?: number;
  pagePadding?: number;
  lineHeight?: number;
  paragraphSpacing?: number;
  themeColor?: string;
  className?: string;
  standalone?: boolean;
}

const CVPreview: React.FC<CVPreviewProps> = ({
  markdown,
  css,
  pageFormat = "A4",
  fontSize = 12,
  pagePadding = 16,
  lineHeight = 1.4,
  paragraphSpacing = 1,
  themeColor = "#3ECF8E",
  className = "",
  standalone = false,
}) => {
  const [scale, setScale] = useState(standalone ? 0.3 : 0.4);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef) return;
      const container = containerRef;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      if (standalone) {
        // For dashboard previews, calculate scale to fit the card properly
        const pageWidth = pageFormat === "A4" ? 794 : 816;
        const pageHeight = pageFormat === "A4" ? 1123 : 1056;
        
        // Leave minimal padding for dashboard cards
        const availableWidth = containerWidth - 20;
        const availableHeight = containerHeight - 20;
        
        const scaleX = availableWidth / pageWidth;
        const scaleY = availableHeight / pageHeight;
        
        // Use smaller scale but ensure readability
        const newScale = Math.min(scaleX, scaleY, 0.5);
        setScale(Math.max(0.2, newScale));
      } else {
        // For full editor preview, use different logic
        const pageWidth = pageFormat === "A4" ? 794 : 816;
        const pageHeight = pageFormat === "A4" ? 1123 : 1056;
        
        const availableWidth = containerWidth - 40;
        const availableHeight = containerHeight - 40;
        
        const scaleX = availableWidth / pageWidth;
        const scaleY = availableHeight / pageHeight;
        
        const newScale = Math.min(scaleX, scaleY, 1);
        setScale(Math.max(0.3, newScale));
      }
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef) {
      resizeObserver.observe(containerRef);
    }
    return () => resizeObserver.disconnect();
  }, [containerRef, pageFormat, standalone]);

  const pageDimensions = useMemo(() => {
    if (pageFormat === "A4") {
      return {
        width: 794,
        height: 1123,
      };
    } else {
      return {
        width: 816,
        height: 1056,
      };
    }
  }, [pageFormat]);

  const customStyles = useMemo(() => {
    return `
      .cv-preview-container {
        height: 100%;
        width: 100%;
        ${standalone ? "background: transparent;" : "background: #f8f9fa;"}
        ${standalone ? "overflow: hidden;" : "overflow: hidden;"}
        ${standalone ? "padding: 10px;" : "padding: 20px;"}
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: ${standalone ? "flex-start" : "center"};
        ${standalone ? "" : "border-radius: 8px;"}
        position: relative;
      }
      
      .cv-preview-page {
        background: white;
        box-shadow: ${standalone ? "0 2px 8px -2px rgba(0, 0, 0, 0.1)" : "0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)"};
        border-radius: ${standalone ? "4px" : "4px"};
        width: ${pageDimensions.width}px;
        height: ${pageDimensions.height}px;
        position: relative;
        overflow: hidden;
        transform-origin: ${standalone ? "top center" : "center center"};
        transform: scale(${scale});
        margin: ${standalone ? "0" : "10px 0"};
        flex-shrink: 0;
      }
      
      .cv-preview-content {
        padding: ${pagePadding}px !important;
        font-size: ${fontSize}px !important;
        line-height: ${lineHeight} !important;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
        color: #1f2937;
      }
      
      ${css
        .split("\n")
        .map((line) => {
          if (line.includes(".cv-container")) {
            return line.replace(".cv-container", ".cv-preview-content");
          }
          return line.startsWith(".") ? `.cv-preview-content ${line}` : line;
        })
        .join("\n")}
      
      .cv-preview-content h1 {
        color: ${themeColor} !important;
        margin-top: 0 !important;
        margin-bottom: ${paragraphSpacing}rem !important;
        line-height: ${lineHeight} !important;
      }
      
      .cv-preview-content h2 {
        color: ${themeColor} !important;
        margin-top: ${paragraphSpacing * 1.5}rem !important;
        margin-bottom: ${paragraphSpacing * 0.5}rem !important;
        line-height: ${lineHeight} !important;
      }
      
      .cv-preview-content h3 {
        color: #111827;
        margin-top: ${paragraphSpacing * 1.2}rem;
        margin-bottom: ${paragraphSpacing * 0.4}rem;
        line-height: ${lineHeight};
      }
      
      .cv-preview-content p {
        color: #4b5563;
        margin-bottom: ${paragraphSpacing * 0.8}rem;
        line-height: ${lineHeight};
      }
      
      .cv-preview-content li {
        color: #4b5563;
        margin-bottom: ${paragraphSpacing * 0.3}rem;
        line-height: ${lineHeight};
      }
      
      .cv-preview-content ul,
      .cv-preview-content ol {
        margin-bottom: ${paragraphSpacing}rem;
        line-height: ${lineHeight};
      }
      
      .cv-preview-content dl {
        margin-bottom: ${paragraphSpacing}rem;
        line-height: ${lineHeight};
      }
      
      .cv-preview-content dt {
        font-weight: 600;
        color: #111827;
        line-height: ${lineHeight};
      }
      
      .cv-preview-content dd {
        margin-left: 0;
        margin-bottom: ${paragraphSpacing * 0.5}rem;
        color: #6b7280;
        line-height: ${lineHeight};
      }
      
      .cv-preview-content strong {
        color: #111827;
        line-height: ${lineHeight};
      }
      
      .cv-preview-content em {
        color: #6b7280;
        line-height: ${lineHeight};
      }
      
      .cv-preview-content a {
        color: ${themeColor} !important;
        text-decoration: underline;
        line-height: ${lineHeight} !important;
      }
      
      .cv-preview-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: ${pageDimensions.height * scale}px;
        width: ${pageDimensions.width * scale}px;
        color: #6b7280;
        text-align: center;
        background: white;
        border-radius: ${standalone ? "0" : "8px"};
        box-shadow: ${standalone ? "0 2px 4px -1px rgba(0, 0, 0, 0.1)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"};
        transform: scale(${scale});
        transform-origin: ${standalone ? "top center" : "center center"};
        margin: ${standalone ? "0" : "10px 0"};
      }
      
      .cv-preview-empty svg {
        width: 32px;
        height: 32px;
        margin-bottom: 12px;
        opacity: 0.5;
      }
    `;
  }, [
    css,
    fontSize,
    pagePadding,
    lineHeight,
    scale,
    paragraphSpacing,
    themeColor,
    standalone,
    pageDimensions.height,
    pageDimensions.width,
  ]);

  const previewHtml = useMemo(() => {
    return parseMarkdownToHtml(markdown);
  }, [markdown]);

  const renderContent = () => {
    if (!previewHtml) {
      return (
        <div className="cv-preview-empty">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0.621 0 1.125-.504 1.125-1.125V9.375c0-.621.504-1.125 1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>
          <p className="text-sm font-medium">No content</p>
        </div>
      );
    }

    return (
      <div className="cv-preview-page">
        <div className="cv-preview-content">
          <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      </div>
    );
  };

  return (
    <div className={`cv-preview-container ${className}`} ref={setContainerRef}>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <script src="https://code.iconify.design/3/3.1.1/iconify.min.js" async />
      {renderContent()}
    </div>
  );
};

export default CVPreview;
