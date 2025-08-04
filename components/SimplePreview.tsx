"use client";

import React, {
  useMemo,
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { parseMarkdownToHtml } from "@/lib/template-loader";

interface SimplePreviewProps {
  markdown: string;
  templateCss: string;
  pageFormat: "A4" | "Letter";
  fontSize: number;
  pagePadding: number;
  lineHeight: number;
  paragraphSpacing?: number;
  themeColor?: string;
}

export interface SimplePreviewRef {
  exportToPDF: () => void;
}

const SimplePreview = forwardRef<SimplePreviewRef, SimplePreviewProps>(
  (
    {
      markdown,
      templateCss,
      pageFormat,
      fontSize,
      pagePadding,
      lineHeight,
      paragraphSpacing = 1,
      themeColor = "#3ECF8E",
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [pages, setPages] = useState<string[]>([]);

    const exportToPDF = () => {
      window.print();
    };

    useImperativeHandle(ref, () => ({
      exportToPDF,
    }));

    const previewHtml = useMemo(() => {
      return parseMarkdownToHtml(markdown);
    }, [markdown]);

    const pageDimensions = useMemo(() => {
      if (pageFormat === "A4") {
        return {
          width: 794,
          height: 1123,
          widthMm: 210,
          heightMm: 297,
        };
      } else {
        return {
          width: 816,
          height: 1056,
          widthMm: 216,
          heightMm: 279,
        };
      }
    }, [pageFormat]);

    useEffect(() => {
      const updateScale = () => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const availableWidth = containerWidth - 40;
        const newScale = Math.min(availableWidth / pageDimensions.width, 1);
        setScale(Math.max(0.2, newScale));
      };

      updateScale();
      const resizeObserver = new ResizeObserver(updateScale);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
      return () => resizeObserver.disconnect();
    }, [pageDimensions]);

    // --- CORRECTED PAGE BREAKING LOGIC IS HERE ---
    useEffect(() => {
      if (!previewHtml || !measureRef.current) {
        setPages(previewHtml ? [previewHtml] : []);
        return;
      }

      const measurer = measureRef.current;
      measurer.innerHTML = previewHtml;

      const pageHeight = pageDimensions.height - pagePadding * 2;

      // The measurer itself gives the total content height including all margins
      if (measurer.scrollHeight <= pageHeight) {
        setPages([previewHtml]);
        return;
      }

      const splitPages = splitContentIntoPages(measurer, pageHeight);
      setPages(splitPages);
    }, [
      previewHtml,
      pageDimensions,
      pagePadding,
      fontSize,
      lineHeight,
      templateCss,
      paragraphSpacing,
    ]);

    // --- NEW, ACCURATE PAGE SPLITTING FUNCTION ---
    const splitContentIntoPages = (
      container: HTMLElement,
      pageHeight: number
    ): string[] => {
      const pages: string[] = [];
      const elements = Array.from(container.children) as HTMLElement[];
      let currentPageContent = "";
      let currentPageHeight = 0;

      for (const element of elements) {
        const style = getComputedStyle(element);
        // Accurately get the element's full height, including vertical margins
        const elementHeight =
          element.offsetHeight +
          parseFloat(style.marginTop) +
          parseFloat(style.marginBottom);

        // If the current page has content and the next element overflows,
        // finalize the current page and start a new one.
        if (
          currentPageHeight + elementHeight > pageHeight &&
          currentPageContent !== ""
        ) {
          pages.push(currentPageContent);
          currentPageContent = element.outerHTML;
          currentPageHeight = elementHeight;
        } else {
          // Otherwise, add the element to the current page.
          currentPageContent += element.outerHTML;
          currentPageHeight += elementHeight;
        }
      }

      // Add the last page to the array if it has content.
      if (currentPageContent !== "") {
        pages.push(currentPageContent);
      }

      return pages.length > 0 ? pages : [container.innerHTML];
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
      
      ${templateCss
        .split("\n")
        .map((line) => {
          if (line.includes(".cv-container")) {
            return line.replace(".cv-container", ".page-content");
          }
          return line.startsWith(".") ? `.page-content ${line}` : line;
        })
        .join("\n")}
      
      ${templateCss
        .split("\n")
        .map((line) => {
          if (line.includes(".cv-container")) {
            return line.replace(".cv-container", ".measuring-container");
          }
          return line.startsWith(".") ? `.measuring-container ${line}` : line;
        })
        .join("\n")}
      
      .page-content, .measuring-container {
        color: #1f2937;
      }
      
      .page-content h1, .measuring-container h1 {
        color: ${themeColor};
        margin-top: 0;
        margin-bottom: ${paragraphSpacing}rem;
        line-height: ${lineHeight};
      }
      
      .page-content h2, .measuring-container h2 {
        color: ${themeColor};
        margin-top: ${paragraphSpacing * 1.5}rem;
        margin-bottom: ${paragraphSpacing * 0.5}rem;
        line-height: ${lineHeight};
      }
      
      .page-content h3, .measuring-container h3 {
        color: #111827;
        margin-top: ${paragraphSpacing * 1.2}rem;
        margin-bottom: ${paragraphSpacing * 0.4}rem;
        line-height: ${lineHeight};
      }
      
      .page-content p, .measuring-container p {
        color: #4b5563;
        margin-bottom: ${paragraphSpacing * 0.8}rem;
        line-height: ${lineHeight};
      }
      
      .page-content li, .measuring-container li {
        color: #4b5563;
        margin-bottom: ${paragraphSpacing * 0.3}rem;
        line-height: ${lineHeight};
      }
      
      .page-content ul, .measuring-container ul,
      .page-content ol, .measuring-container ol {
        margin-bottom: ${paragraphSpacing}rem;
        line-height: ${lineHeight};
      }
      
      .page-content dl, .measuring-container dl {
        margin-bottom: ${paragraphSpacing}rem;
        line-height: ${lineHeight};
      }
      
      .page-content dt, .measuring-container dt {
        font-weight: 600;
        color: #111827;
        line-height: ${lineHeight};
      }
      
      .page-content dd, .measuring-container dd {
        margin-left: 0;
        margin-bottom: ${paragraphSpacing * 0.5}rem;
        color: #6b7280;
        line-height: ${lineHeight};
      }
      
      .page-content strong, .measuring-container strong {
        color: #111827;
        line-height: ${lineHeight};
      }
      
      .page-content em, .measuring-container em {
        color: #6b7280;
        line-height: ${lineHeight};
      }
      
      .page-content a, .measuring-container a {
        color: ${themeColor};
        text-decoration: underline;
        line-height: ${lineHeight};
      }
      

      
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
      

      
      @page {
        size: ${pageFormat === "A4" ? "A4" : "letter"};
        margin: 0;
      }
      
      @media print {
        .page-number {
          display: none !important;
        }
        
        .preview-container {
          position: static !important;
          background: none !important;
          padding: 0 !important;
          gap: 0 !important;
          overflow: visible !important;
          display: block !important;
        }
        
        .page {
          box-shadow: none !important;
          border-radius: 0 !important;
          margin: 0 !important;
          transform: none !important;
          page-break-after: always;
          width: 100% !important;
          height: 100% !important;
          max-width: none !important;
          max-height: none !important;
          display: block !important;
          position: relative !important;
          visibility: visible !important;
          overflow: visible !important;
        }
        
        .page:last-child {
          page-break-after: avoid;
        }
        
        .page-content {
          overflow: visible !important;
          height: 100% !important;
          width: 100% !important;
          padding: ${pagePadding}px !important;
          font-size: ${fontSize}px !important;
          line-height: ${lineHeight} !important;
          color: #1f2937 !important;
          visibility: visible !important;
        }
        
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        ${templateCss
          .split("\n")
          .map((line) => {
            if (line.includes(".cv-container")) {
              return line.replace(".cv-container", ".page-content");
            }
            return line.startsWith(".") ? `.page-content ${line}` : line;
          })
          .join("\n")}
        
        .page-content h1 {
          color: ${themeColor} !important;
          margin-top: 0 !important;
          margin-bottom: ${paragraphSpacing}rem !important;
          line-height: ${lineHeight} !important;
        }
        
        .page-content h2 {
          color: ${themeColor} !important;
          margin-top: ${paragraphSpacing * 1.5}rem !important;
          margin-bottom: ${paragraphSpacing * 0.5}rem !important;
          line-height: ${lineHeight} !important;
        }
        
        .page-content h3 {
          color: #111827 !important;
          margin-top: ${paragraphSpacing * 1.2}rem !important;
          margin-bottom: ${paragraphSpacing * 0.4}rem !important;
          line-height: ${lineHeight} !important;
        }
        
        .page-content p {
          color: #4b5563 !important;
          margin-bottom: ${paragraphSpacing * 0.8}rem !important;
          line-height: ${lineHeight} !important;
        }
        
        .page-content li {
          color: #4b5563 !important;
          margin-bottom: ${paragraphSpacing * 0.3}rem !important;
          line-height: ${lineHeight} !important;
        }
        
        .page-content ul, 
        .page-content ol {
          margin-bottom: ${paragraphSpacing}rem !important;
          line-height: ${lineHeight} !important;
        }
        
        .page-content dl {
          margin-bottom: ${paragraphSpacing}rem !important;
          line-height: ${lineHeight} !important;
        }
        
        .page-content dt {
          font-weight: 600 !important;
          color: #111827 !important;
          line-height: ${lineHeight} !important;
        }
        
        .page-content dd {
          margin-left: 0 !important;
          margin-bottom: ${paragraphSpacing * 0.5}rem !important;
          color: #6b7280 !important;
          line-height: ${lineHeight} !important;
        }
        
        .page-content strong {
          color: #111827 !important;
          line-height: ${lineHeight} !important;
        }
        
        .page-content em {
          color: #6b7280 !important;
          line-height: ${lineHeight} !important;
        }
        
        .page-content a {
          color: ${themeColor} !important;
          text-decoration: underline !important;
          line-height: ${lineHeight} !important;
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
      paragraphSpacing,
      themeColor,
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
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />

        <script
          src="https://code.iconify.design/3/3.1.1/iconify.min.js"
          async
        />

        <div ref={measureRef} className="measuring-container" />

        <div className="preview-container" ref={containerRef}>
          {renderContent()}
        </div>
      </div>
    );
  }
);

export default SimplePreview;
