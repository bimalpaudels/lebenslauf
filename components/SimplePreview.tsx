"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import { parseMarkdownToHtml } from "@/lib/template-loader";

interface SimplePreviewProps {
  markdown: string;
  templateCss: string;
  pageFormat: "A4" | "Letter";
  fontSize: number;
  pagePadding: number;
  lineHeight: number;
}

const SimplePreview: React.FC<SimplePreviewProps> = ({
  markdown,
  templateCss,
  pageFormat,
  fontSize,
  pagePadding,
  lineHeight,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pages, setPages] = useState<string[]>([]);

  const previewHtml = useMemo(() => {
    return parseMarkdownToHtml(markdown);
  }, [markdown]);

  // Fixed page dimensions in pixels (for print accuracy)
  const pageDimensions = useMemo(() => {
    if (pageFormat === "A4") {
      return {
        width: 794, // 210mm at 96 DPI
        height: 1123, // 297mm at 96 DPI
        widthMm: 210,
        heightMm: 297,
      };
    } else {
      return {
        width: 816, // 8.5in at 96 DPI
        height: 1056, // 11in at 96 DPI
        widthMm: 216, // 8.5in in mm
        heightMm: 279, // 11in in mm
      };
    }
  }, [pageFormat]);

  // Calculate scale to fit width with some margin
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.clientWidth;

      // Calculate scale to fit width with margins (40px total)
      const availableWidth = containerWidth - 40;
      const newScale = Math.min(availableWidth / pageDimensions.width, 1);

      // Set minimum scale to prevent too small pages
      setScale(Math.max(0.2, newScale));
    };

    updateScale();

    // Update scale on container resize
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [pageDimensions]);

  // Split content into pages when it overflows
  useEffect(() => {
    if (!previewHtml || !measureRef.current) {
      setPages(previewHtml ? [previewHtml] : []);
      return;
    }

    // Set up measuring container with exact page dimensions
    const measurer = measureRef.current;
    measurer.innerHTML = previewHtml;

    const contentHeight = measurer.scrollHeight;
    const pageHeight = pageDimensions.height - pagePadding * 2;

    if (contentHeight <= pageHeight) {
      // Content fits in one page
      setPages([previewHtml]);
      return;
    }

    // Content needs to be split across multiple pages
    const splitPages = splitContentIntoPages(measurer, pageHeight);
    setPages(splitPages);
  }, [previewHtml, pageDimensions, pagePadding, fontSize, lineHeight]);

  // Function to split content into pages
  const splitContentIntoPages = (
    container: HTMLElement,
    pageHeight: number
  ): string[] => {
    const pages: string[] = [];
    const elements = Array.from(container.children);
    let currentPageContent = "";
    let currentPageHeight = 0;

    // Create a temporary div to measure heights
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.visibility = "hidden";
    tempDiv.style.width = `${pageDimensions.width - pagePadding * 2}px`;
    tempDiv.style.fontSize = `${fontSize}px`;
    tempDiv.style.lineHeight = `${lineHeight}`;
    document.body.appendChild(tempDiv);

    try {
      for (const element of elements) {
        const elementHtml = element.outerHTML;
        tempDiv.innerHTML = elementHtml;
        const elementHeight = tempDiv.scrollHeight;

        // Check if adding this element would exceed page height
        if (
          currentPageHeight + elementHeight > pageHeight &&
          currentPageContent
        ) {
          // Save current page and start new one
          pages.push(currentPageContent);
          currentPageContent = elementHtml;
          currentPageHeight = elementHeight;
        } else {
          // Add element to current page
          currentPageContent += elementHtml;
          currentPageHeight += elementHeight;
        }
      }

      // Add the last page if it has content
      if (currentPageContent) {
        pages.push(currentPageContent);
      }
    } finally {
      document.body.removeChild(tempDiv);
    }

    return pages.length > 0 ? pages : [previewHtml];
  };

  const customStyles = useMemo(() => {
    return `
      .preview-container {
        height: 100%;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        overflow-x: hidden;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #3ECF8E #1e293b;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
      }
      
      .preview-container::-webkit-scrollbar {
        width: 8px;
      }
      
      .preview-container::-webkit-scrollbar-track {
        background: #1e293b;
      }
      
      .preview-container::-webkit-scrollbar-thumb {
        background: #3ECF8E;
        border-radius: 4px;
      }
      
      .preview-container::-webkit-scrollbar-thumb:hover {
        background: #4BE4B4;
      }
      
      .page {
        background: white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border-radius: 8px;
        width: ${pageDimensions.width}px;
        height: ${pageDimensions.height}px;
        position: relative;
        overflow: hidden;
        transition: box-shadow 0.3s ease;
        transform-origin: top center;
        transform: scale(${scale});
        flex-shrink: 0;
      }
      
      .page:hover {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
      
      .page-content {
        padding: ${pagePadding}px;
        font-size: ${fontSize}px;
        line-height: ${lineHeight};
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
      }
      
      .page-number {
        position: absolute;
        bottom: 8px;
        right: 12px;
        font-size: 10px;
        color: #9ca3af;
        background: rgba(249, 250, 251, 0.9);
        padding: 2px 6px;
        border-radius: 4px;
        font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      }
      
      .measuring-container {
        position: absolute;
        top: -9999px;
        left: -9999px;
        width: ${pageDimensions.width - pagePadding * 2}px;
        padding: ${pagePadding}px;
        font-size: ${fontSize}px;
        line-height: ${lineHeight};
        visibility: hidden;
        overflow: visible;
      }
      
      /* Apply template CSS with proper scoping */
      ${templateCss
        .split("\n")
        .map((line) => {
          if (line.includes(".cv-container")) {
            return line.replace(".cv-container", ".page-content");
          }
          return line.startsWith(".") ? `.page-content ${line}` : line;
        })
        .join("\n")}
      
      /* Also apply to measuring container */
      ${templateCss
        .split("\n")
        .map((line) => {
          if (line.includes(".cv-container")) {
            return line.replace(".cv-container", ".measuring-container");
          }
          return line.startsWith(".") ? `.measuring-container ${line}` : line;
        })
        .join("\n")}
      
      /* Ensure proper text visibility and styling */
      .page-content, .measuring-container {
        color: #1f2937;
      }
      
      .page-content h1, .measuring-container h1 {
        color: #111827;
        margin-top: 0;
      }
      
      .page-content h2, .measuring-container h2 {
        color: #3b82f6;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
      }
      
      .page-content h3, .measuring-container h3 {
        color: #111827;
        margin-top: 1.2em;
        margin-bottom: 0.4em;
      }
      
      .page-content p, .measuring-container p {
        color: #4b5563;
        margin-bottom: 0.8em;
      }
      
      .page-content li, .measuring-container li {
        color: #4b5563;
        margin-bottom: 0.3em;
      }
      
      .page-content ul, .measuring-container ul,
      .page-content ol, .measuring-container ol {
        margin-bottom: 1em;
      }
      
      .page-content dl, .measuring-container dl {
        margin-bottom: 1em;
      }
      
      .page-content dt, .measuring-container dt {
        font-weight: 600;
        color: #111827;
      }
      
      .page-content dd, .measuring-container dd {
        margin-left: 0;
        margin-bottom: 0.5em;
        color: #6b7280;
      }
      
      .page-content strong, .measuring-container strong {
        color: #111827;
      }
      
      .page-content em, .measuring-container em {
        color: #6b7280;
      }
      
      .page-content a, .measuring-container a {
        color: #3b82f6;
        text-decoration: underline;
      }
      
      /* Scale indicator */
      .scale-indicator {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        z-index: 1000;
        backdrop-filter: blur(4px);
      }
      
      /* Empty state */
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: ${pageDimensions.height}px;
        width: ${pageDimensions.width}px;
        color: #6b7280;
        text-align: center;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transform: scale(${scale});
        transform-origin: top center;
      }
      
      .empty-state svg {
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
      }
      
      /* Page info */
      .page-info {
        text-align: center;
        color: #6b7280;
        font-size: 12px;
        font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        margin-top: 10px;
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 6px;
        backdrop-filter: blur(4px);
      }
      
      /* Print styles */
      @page {
        size: ${pageFormat === "A4" ? "A4" : "letter"};
        margin: 0;
      }
      
      @media print {
        .preview-container {
          background: white !important;
          padding: 0 !important;
          gap: 0 !important;
        }
        
        .page {
          box-shadow: none !important;
          border-radius: 0 !important;
          margin: 0 !important;
          transform: none !important;
          page-break-after: always;
          width: 100% !important;
          height: 100% !important;
        }
        
        .page:last-child {
          page-break-after: avoid;
        }
        
        .page-content {
          overflow: visible !important;
        }
        
        .scale-indicator,
        .page-info,
        .page-number {
          display: none !important;
        }
      }
    `;
  }, [
    templateCss,
    pageFormat,
    fontSize,
    pagePadding,
    lineHeight,
    pageDimensions,
    scale,
  ]);

  const renderContent = () => {
    if (!previewHtml) {
      return (
        <div className="empty-state">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0.621 0 1.125-.504 1.125-1.125V9.375c0-.621.504-1.125 1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>
          <p className="text-lg font-medium">No content to preview</p>
          <p className="text-sm opacity-75 mt-2">
            Start typing in the editor to see your CV come to life
          </p>
        </div>
      );
    }

    return (
      <>
        {pages.map((pageContent, index) => (
          <div key={index} className="page">
            <div className="page-content">
              <div dangerouslySetInnerHTML={{ __html: pageContent }} />
            </div>
            {pages.length > 1 && (
              <div className="page-number">Page {index + 1}</div>
            )}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="h-full w-full relative">
      {/* Inject custom styles */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* Load external dependencies */}
      <script src="https://code.iconify.design/3/3.1.1/iconify.min.js" async />

      {/* Hidden measuring container for calculating page breaks */}
      <div
        ref={measureRef}
        className="measuring-container"
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          width: `${pageDimensions.width - pagePadding * 2}px`,
          padding: `${pagePadding}px`,
          fontSize: `${fontSize}px`,
          lineHeight: lineHeight,
          visibility: "hidden",
          overflow: "visible",
        }}
      />

      <div className="preview-container" ref={containerRef}>
        {/* Scale indicator */}
        <div className="scale-indicator">
          {Math.round(scale * 100)}% • {pageFormat}
        </div>

        {renderContent()}

        {/* Page info */}
        {pages.length > 0 && (
          <div className="page-info">
            {pages.length} page{pages.length !== 1 ? "s" : ""} • {pageFormat}{" "}
            format • {fontSize}px font
          </div>
        )}
      </div>
    </div>
  );
};

export default SimplePreview;
