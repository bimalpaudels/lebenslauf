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
  function SimplePreview(
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
  ) {
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

        // Calculate scale to fit width with some padding
        const availableWidth = containerWidth - 80; // 40px padding on each side
        const scaleX = availableWidth / pageDimensions.width;

        // For split pane, we want to show full page at reasonable scale
        const newScale = Math.min(scaleX, 1);
        setScale(Math.max(0.3, newScale));
      };

      updateScale();
      const resizeObserver = new ResizeObserver(updateScale);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
      return () => resizeObserver.disconnect();
    }, [pageDimensions]);

    // FIXED PAGE BREAKING LOGIC
    useEffect(() => {
      if (!previewHtml || !measureRef.current) {
        setPages(previewHtml ? [previewHtml] : []);
        return;
      }

      const measurer = measureRef.current;

      // Clear and set content
      measurer.innerHTML = "";
      measurer.style.width = `${pageDimensions.width - pagePadding * 2}px`;
      measurer.style.padding = `${pagePadding}px`;
      measurer.style.fontSize = `${fontSize}px`;
      measurer.style.lineHeight = `${lineHeight}`;
      measurer.style.fontFamily =
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      measurer.style.color = "#1f2937";
      measurer.style.background = "white";
      measurer.style.boxSizing = "border-box";
      measurer.style.position = "absolute";
      measurer.style.top = "-9999px";
      measurer.style.left = "-9999px";
      measurer.style.visibility = "hidden";
      measurer.style.overflow = "visible";

      // Apply template CSS to the measurer
      const styleElement = document.createElement("style");
      styleElement.textContent = templateCss
        .split("\n")
        .map((line) => {
          if (line.includes(".cv-container")) {
            return line.replace(".cv-container", ".measuring-container");
          }
          return line.startsWith(".") ? `.measuring-container ${line}` : line;
        })
        .join("\n");
      document.head.appendChild(styleElement);

      measurer.innerHTML = previewHtml;

      // Force layout calculation
      measurer.offsetHeight;

      const availableHeight = pageDimensions.height - pagePadding * 2;

      // Check if content fits in one page
      const totalHeight = measurer.scrollHeight;
      console.log(
        `Content height: ${totalHeight}, Available height: ${availableHeight}`
      );
      console.log(
        `Page dimensions: ${pageDimensions.width}x${pageDimensions.height}`
      );
      console.log(`Page padding: ${pagePadding}`);
      console.log(
        `Content preview:`,
        measurer.innerHTML.substring(0, 200) + "..."
      );

      if (totalHeight <= availableHeight) {
        console.log("Content fits in single page");
        document.head.removeChild(styleElement);
        setPages([previewHtml]);
        return;
      }

      console.log("Content needs to be split across multiple pages");
      // Split content into pages
      const splitPages = splitContentIntoPages(
        measurer,
        availableHeight,
        pageDimensions.height
      );
      console.log(`Created ${splitPages.length} pages`);

      // Clean up
      document.head.removeChild(styleElement);
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

    // IMPROVED PAGE SPLITTING FUNCTION
    const splitContentIntoPages = (
      container: HTMLElement,
      availableHeight: number,
      pageHeight: number
    ): string[] => {
      const pages: string[] = [];
      const elements = Array.from(container.children) as HTMLElement[];

      if (elements.length === 0) {
        return [container.innerHTML];
      }

      // If we only have one element and it's too large, look inside it
      if (elements.length === 1 && elements[0].children.length > 0) {
        console.log(
          "Single large container detected, looking inside for smaller elements"
        );
        const innerElements = Array.from(elements[0].children) as HTMLElement[];
        return splitContentIntoPagesInner(
          innerElements,
          availableHeight,
          pageHeight,
          elements[0].tagName
        );
      }

      return splitContentIntoPagesInner(elements, availableHeight, pageHeight);
    };

    const splitContentIntoPagesInner = (
      elements: HTMLElement[],
      availableHeight: number,
      pageHeight: number,
      wrapperTag: string = "div"
    ): string[] => {
      const pages: string[] = [];
      let currentPageElements: HTMLElement[] = [];
      let currentPageHeight = 0;

      // Create a temporary container for measuring with proper styles
      const tempContainer = document.createElement("div");
      tempContainer.style.cssText = `
        position: absolute;
        top: -9999px;
        left: -9999px;
        width: ${pageDimensions.width - pagePadding * 2}px;
        padding: ${pagePadding}px;
        font-size: ${fontSize}px;
        line-height: ${lineHeight};
        visibility: hidden;
        background: white;
        color: #1f2937;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-sizing: border-box;
        overflow: visible;
      `;

      // Apply template CSS to temp container
      const styleElement = document.createElement("style");
      styleElement.textContent = templateCss
        .split("\n")
        .map((line) => {
          if (line.includes(".cv-container")) {
            return line.replace(".cv-container", ".temp-measuring-container");
          }
          return line.startsWith(".")
            ? `.temp-measuring-container ${line}`
            : line;
        })
        .join("\n");
      document.head.appendChild(styleElement);

      tempContainer.className = "temp-measuring-container";
      document.body.appendChild(tempContainer);

      console.log(`Splitting ${elements.length} elements across pages`);

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const clonedElement = element.cloneNode(true) as HTMLElement;

        // Clear temp container and add current page elements plus new element
        tempContainer.innerHTML = "";
        currentPageElements.forEach((el) => {
          tempContainer.appendChild(el.cloneNode(true));
        });
        tempContainer.appendChild(clonedElement);

        // Get the actual rendered height
        const measuredHeight = tempContainer.scrollHeight;
        console.log(
          `Element ${i} (${element.tagName}): measuredHeight=${measuredHeight}, availableHeight=${availableHeight}`
        );

        // Check if adding this element would exceed page height
        if (
          measuredHeight > availableHeight &&
          currentPageElements.length > 0
        ) {
          console.log(`Page break at element ${i}, creating new page`);
          // Save current page
          const pageContent = currentPageElements
            .map((el) => el.outerHTML)
            .join("");
          if (wrapperTag !== "div") {
            // Wrap in the original container tag
            pages.push(`<${wrapperTag}>${pageContent}</${wrapperTag}>`);
          } else {
            pages.push(pageContent);
          }

          // Start new page with current element
          currentPageElements = [element];
          tempContainer.innerHTML = "";
          tempContainer.appendChild(element.cloneNode(true));
          currentPageHeight = tempContainer.scrollHeight;
        } else {
          // Add element to current page
          currentPageElements.push(element);
          currentPageHeight = measuredHeight;
        }
      }

      // Add remaining elements as last page
      if (currentPageElements.length > 0) {
        const pageContent = currentPageElements
          .map((el) => el.outerHTML)
          .join("");
        if (wrapperTag !== "div") {
          // Wrap in the original container tag
          pages.push(`<${wrapperTag}>${pageContent}</${wrapperTag}>`);
        } else {
          pages.push(pageContent);
        }
      }

      // Clean up temporary container and style
      document.body.removeChild(tempContainer);
      document.head.removeChild(styleElement);

      console.log(`Created ${pages.length} pages`);
      return pages.length > 0 ? pages : [""];
    };

    const customStyles = useMemo(() => {
      return `
      .preview-container {
        height: 100%;
        background: #f8f9fa;
        overflow-x: hidden;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #3ECF8E #1e293b;
        padding: 20px 0;
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
      
      .page-wrapper {
        width: ${pageDimensions.width * scale}px;
        height: ${pageDimensions.height * scale}px;
        flex-shrink: 0;
      }
      
      .page {
        background: white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border-radius: 0;
        width: ${pageDimensions.width}px;
        height: ${pageDimensions.height}px;
        position: relative;
        overflow: hidden;
        transition: box-shadow 0.3s ease;
        transform-origin: top left;
        transform: scale(${scale});
        flex-shrink: 0;
      }
      
      .page:hover {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
      
      .page-content {
        padding: ${pagePadding}px !important;
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
        padding: ${pagePadding}px !important;
        font-size: ${fontSize}px !important;
        line-height: ${lineHeight};
        visibility: hidden;
        overflow: visible;
        background: white;
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
      
      /* Override template padding and font-size to ensure dynamic controls work */
      .page-content {
        padding: ${pagePadding}px !important;
        font-size: ${fontSize}px !important;
      }
      
      .measuring-container {
        padding: ${pagePadding}px !important;
        font-size: ${fontSize}px !important;
      }
      
      .page-content, .measuring-container {
        color: #1f2937;
      }
      
      .page-content h1, .measuring-container h1 {
        color: ${themeColor};
        margin-top: 0;
        margin-bottom: ${paragraphSpacing}rem;
        line-height: ${lineHeight};
        font-size: ${fontSize * 1.8}px !important;
      }
      
      .page-content h2, .measuring-container h2 {
        color: ${themeColor};
        margin-top: ${paragraphSpacing * 1.5}rem;
        margin-bottom: ${paragraphSpacing * 0.5}rem;
        line-height: ${lineHeight};
        font-size: ${fontSize * 1.4}px !important;
      }
      
      .page-content h3, .measuring-container h3 {
        color: #111827;
        margin-top: ${paragraphSpacing * 1.2}rem;
        margin-bottom: ${paragraphSpacing * 0.4}rem;
        line-height: ${lineHeight};
        font-size: ${fontSize * 1.2}px !important;
      }
      
      .page-content p, .measuring-container p {
        color: #4b5563;
        margin-bottom: ${paragraphSpacing * 0.8}rem;
        line-height: ${lineHeight};
        font-size: ${fontSize}px !important;
      }
      
      .page-content li, .measuring-container li {
        color: #4b5563;
        margin-bottom: ${paragraphSpacing * 0.3}rem;
        line-height: ${lineHeight};
        font-size: ${fontSize}px !important;
      }
      
      .page-content ul, .measuring-container ul,
      .page-content ol, .measuring-container ol {
        margin-bottom: ${paragraphSpacing}rem;
        line-height: ${lineHeight};
        font-size: ${fontSize}px !important;
      }
      
      .page-content dl, .measuring-container dl {
        margin-bottom: ${paragraphSpacing}rem;
        line-height: ${lineHeight};
        font-size: ${fontSize}px !important;
      }
      
      .page-content dt, .measuring-container dt {
        font-weight: 600;
        color: #111827;
        line-height: ${lineHeight};
        font-size: ${fontSize}px !important;
      }
      
      .page-content dd, .measuring-container dd {
        margin-left: 0;
        margin-bottom: ${paragraphSpacing * 0.5}rem;
        color: #6b7280;
        line-height: ${lineHeight};
        font-size: ${fontSize}px !important;
      }
      
      .page-content strong, .measuring-container strong {
        color: #111827;
        line-height: ${lineHeight};
        font-size: ${fontSize}px !important;
      }
      
      .page-content em, .measuring-container em {
        color: #6b7280;
        line-height: ${lineHeight};
        font-size: ${fontSize}px !important;
      }
      
      .page-content a, .measuring-container a {
        color: ${themeColor};
        text-decoration: underline;
        line-height: ${lineHeight};
        font-size: ${fontSize}px !important;
      }
      
      .empty-state-wrapper {
        width: ${pageDimensions.width * scale}px;
        height: ${pageDimensions.height * scale}px;
        flex-shrink: 0;
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
        border-radius: 0;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transform-origin: top left;
        transform: scale(${scale});
        margin: 20px 0;
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
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          height: auto !important;
          overflow: visible !important;
        }
        
        .preview-container {
          display: block !important;
          position: static !important;
          background: none !important;
          padding: 0 !important;
          margin: 0 !important;
          gap: 0 !important;
          overflow: visible !important;
          height: auto !important;
          width: 100% !important;
        }
        
        .page-wrapper {
          width: 100% !important;
          height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
          display: block !important;
          page-break-after: always !important;
          page-break-inside: avoid !important;
          position: relative !important;
        }
        
        .page-wrapper:last-child {
          page-break-after: avoid !important;
        }
        
        .page {
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          transform: none !important;
          position: relative !important;
          overflow: visible !important;
          background: white !important;
          display: block !important;
        }
        
        .page-content {
          width: 100% !important;
          height: 100% !important;
          padding: ${pagePadding}px !important;
          margin: 0 !important;
          font-size: ${fontSize}px !important;
          line-height: ${lineHeight} !important;
          color: #1f2937 !important;
          background: white !important;
          box-sizing: border-box !important;
          overflow: visible !important;
          position: relative !important;
        }
        
        .page-number {
          display: none !important;
        }
        
        .empty-state-wrapper,
        .empty-state {
          display: none !important;
        }
        
        /* Ensure all content is visible */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        /* Hide any scrollbars or overflow issues */
        ::-webkit-scrollbar {
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
      paragraphSpacing,
      themeColor,
    ]);

    const renderContent = () => {
      if (!previewHtml) {
        return (
          <div className="empty-state-wrapper">
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
          </div>
        );
      }

      return (
        <>
          {pages.map((pageContent, index) => (
            <div key={index} className="page-wrapper">
              <div className="page">
                <div className="page-content">
                  <div dangerouslySetInnerHTML={{ __html: pageContent }} />
                </div>
              </div>
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
