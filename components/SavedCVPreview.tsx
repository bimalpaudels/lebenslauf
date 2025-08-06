"use client";

import React, { useMemo, useState, useEffect } from "react";
import { parseMarkdownToHtml } from "@/lib/template-loader";
import { cn } from "@/lib/utils";

interface SavedCVPreviewProps {
  markdown: string;
  css: string;
  pageFormat?: "A4" | "Letter";
  fontSize?: number;
  pagePadding?: number;
  lineHeight?: number;
  paragraphSpacing?: number;
  themeColor?: string;
  className?: string;
}

const SavedCVPreview: React.FC<SavedCVPreviewProps> = ({
  markdown,
  css,
  pageFormat = "A4",
  fontSize = 12,
  pagePadding = 16,
  lineHeight = 1.4,
  paragraphSpacing = 1,
  themeColor = "#3ECF8E",
  className = "",
}) => {
  const [scale, setScale] = useState(0.3);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef) return;
      const container = containerRef;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

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
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef) {
      resizeObserver.observe(containerRef);
    }
    return () => resizeObserver.disconnect();
  }, [containerRef, pageFormat]);

  const pageDimensions = useMemo(() => {
    if (pageFormat === "A4") {
      return { width: 794, height: 1123 };
    } else {
      return { width: 816, height: 1056 };
    }
  }, [pageFormat]);

  const containerClasses = cn(
    "h-full w-full bg-transparent overflow-hidden",
    "p-2.5 flex flex-col items-center justify-start relative",
    className
  );

  const pageClasses =
    "bg-white shadow-md rounded border-0 relative overflow-hidden shrink-0";

  const contentClasses =
    "h-full w-full box-border overflow-hidden relative text-gray-800 bg-white break-words font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]";

  const processedCSS = useMemo(() => {
    if (!css) return "";

    return css
      .split("\n")
      .map((line) => {
        if (line.includes(".cv-container")) {
          return line.replace(".cv-container", ".saved-cv-preview-content");
        }
        return line.startsWith(".")
          ? `.saved-cv-preview-content ${line}`
          : line;
      })
      .join("\n");
  }, [css]);

  const customPropertyStyles = `
    .saved-cv-preview-content,
    .saved-cv-preview-content * {
      font-size: ${fontSize}px !important;
      line-height: ${lineHeight} !important;
    }
    
    .saved-cv-preview-content {
      padding: ${pagePadding}px !important;
    }
    
    .saved-cv-preview-content h1,
    .saved-cv-preview-content .cv-header h1 {
      color: ${themeColor} !important;
      margin-top: 0 !important;
      margin-bottom: ${paragraphSpacing}rem !important;
      line-height: ${lineHeight} !important;
      font-size: ${fontSize * 2.2}px !important;
    }
    
    .saved-cv-preview-content h2 {
      color: ${themeColor} !important;
      margin-top: ${paragraphSpacing * 1.5}rem !important;
      margin-bottom: ${paragraphSpacing * 0.5}rem !important;
      line-height: ${lineHeight} !important;
      font-size: ${fontSize * 1.6}px !important;
    }
    
    .saved-cv-preview-content h3 {
      color: #111827 !important;
      margin-top: ${paragraphSpacing * 1.2}rem !important;
      margin-bottom: ${paragraphSpacing * 0.4}rem !important;
      line-height: ${lineHeight} !important;
      font-size: ${fontSize * 1.3}px !important;
    }
    
    .saved-cv-preview-content p {
      color: #4b5563 !important;
      margin-bottom: ${paragraphSpacing * 0.8}rem !important;
      line-height: ${lineHeight} !important;
      font-size: ${fontSize}px !important;
    }
    
    .saved-cv-preview-content li {
      color: #4b5563 !important;
      margin-bottom: ${paragraphSpacing * 0.3}rem !important;
      line-height: ${lineHeight} !important;
      font-size: ${fontSize}px !important;
    }
    
    .saved-cv-preview-content a {
      color: ${themeColor} !important;
      text-decoration: underline !important;
      line-height: ${lineHeight} !important;
      font-size: ${fontSize}px !important;
    }
    
    .saved-cv-preview-content .company,
    .saved-cv-preview-content .job-date,
    .saved-cv-preview-content .location-date,
    .saved-cv-preview-content .award-year,
    .saved-cv-preview-content .header-item {
      font-size: ${fontSize}px !important;
      line-height: ${lineHeight} !important;
    }
  `;

  const previewHtml = useMemo(() => {
    return parseMarkdownToHtml(markdown);
  }, [markdown]);

  const allStyles = `
    ${processedCSS}
    ${customPropertyStyles}
  `;

  if (!previewHtml) {
    return (
      <div className={containerClasses} ref={setContainerRef}>
        <style dangerouslySetInnerHTML={{ __html: allStyles }} />
        <div
          className={pageClasses}
          style={{
            transform: `scale(${scale})`,
            width: `${pageDimensions.width}px`,
            height: `${pageDimensions.height}px`,
            transformOrigin: "top center",
          }}
        >
          <div className={cn(contentClasses, "saved-cv-preview-content")}>
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
              <svg
                className="w-8 h-8 mb-3 opacity-50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0.621 0 1.125-.504 1.125-1.125V9.375c0-.621.504-1.125 1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
              <p className="text-sm font-medium">No content</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses} ref={setContainerRef}>
      <style dangerouslySetInnerHTML={{ __html: allStyles }} />
      <div
        className={pageClasses}
        style={{
          transform: `scale(${scale})`,
          width: `${pageDimensions.width}px`,
          height: `${pageDimensions.height}px`,
          transformOrigin: "top center",
        }}
      >
        <div className={cn(contentClasses, "saved-cv-preview-content")}>
          <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      </div>
    </div>
  );
};

export default SavedCVPreview;
