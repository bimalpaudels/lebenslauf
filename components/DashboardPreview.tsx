"use client";

import React, { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { TemplateHost } from "@/components/builder/TemplateHost";

interface DashboardPreviewProps {
  markdown: string;
  css?: string; // optional in TSX template mode
  pageFormat?: "A4" | "Letter";
  fontSize?: number;
  pagePadding?: number;
  lineHeight?: number;
  paragraphSpacing?: number;
  themeColor?: string;
  className?: string;
  variant?: "saved" | "template";
  templateId?: string; // when previewing TSX template
  contentOverlay?: React.ReactNode; // renders inside the page content (top-right)
}

const DashboardPreview: React.FC<DashboardPreviewProps> = ({
  markdown,
  css,
  pageFormat = "A4",
  fontSize = 12,
  pagePadding = 16,
  lineHeight = 1.4,
  paragraphSpacing = 1,
  themeColor = "#3ECF8E",
  className = "",
  variant = "template",
  templateId,
  contentOverlay,
}) => {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.3);

  // Page dimensions based on format
  const pageDimensions = useMemo(() => {
    return pageFormat === "A4"
      ? { width: 794, height: 1123 }
      : { width: 816, height: 1056 };
  }, [pageFormat]);

  // Dashboard-specific scaling logic (always small, fits container)
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef) return;

      const containerWidth = containerRef.clientWidth;
      const containerHeight = containerRef.clientHeight;

      const scaleX = containerWidth / pageDimensions.width;
      const scaleY = containerHeight / pageDimensions.height;

      // Fill available space without exceeding 1:1
      const newScale = Math.min(scaleX, scaleY, 1);
      setScale(Math.max(0.2, newScale));
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef) {
      resizeObserver.observe(containerRef);
    }
    return () => resizeObserver.disconnect();
  }, [containerRef, pageDimensions]);

  // Generate styles with appropriate CSS class name
  const cssClassName =
    variant === "saved" ? "saved-cv-preview-content" : "cv-preview-content";

  const customStyles = useMemo(() => {
    const processedCSS = css
      ? css
          .split("\n")
          .map((line) =>
            line.includes(".cv-container")
              ? line.replace(".cv-container", `.${cssClassName}`)
              : line.startsWith(".")
              ? `.${cssClassName} ${line}`
              : line
          )
          .join("\n")
      : "";

    return `
      .${cssClassName} {
        padding: ${pagePadding}px !important;
        font-size: ${fontSize}px !important;
        line-height: ${lineHeight} !important;
      }
      
      ${processedCSS}
      
      .${cssClassName} h1,
      .${cssClassName} .cv-header h1 {
        color: ${themeColor} !important;
        margin-top: 0 !important;
        margin-bottom: ${paragraphSpacing}rem !important;
        font-size: ${fontSize * 2.2}px !important;
        line-height: ${lineHeight} !important;
      }
      
      .${cssClassName} h2 {
        color: ${themeColor} !important;
        margin-top: ${paragraphSpacing * 1.5}rem !important;
        margin-bottom: ${paragraphSpacing * 0.5}rem !important;
        font-size: ${fontSize * 1.6}px !important;
        line-height: ${lineHeight} !important;
      }
      
      .${cssClassName} h3 {
        color: #111827 !important;
        margin-top: ${paragraphSpacing * 1.2}rem !important;
        margin-bottom: ${paragraphSpacing * 0.4}rem !important;
        font-size: ${fontSize * 1.3}px !important;
        line-height: ${lineHeight} !important;
      }
      
      .${cssClassName} p {
        color: #4b5563 !important;
        margin-bottom: ${paragraphSpacing * 0.8}rem !important;
        font-size: ${fontSize}px !important;
        line-height: ${lineHeight} !important;
      }
      
      .${cssClassName} li {
        color: #4b5563 !important;
        margin-bottom: ${paragraphSpacing * 0.3}rem !important;
        font-size: ${fontSize}px !important;
        line-height: ${lineHeight} !important;
      }
      
      .${cssClassName} a {
        color: ${themeColor} !important;
        text-decoration: underline !important;
        font-size: ${fontSize}px !important;
        line-height: ${lineHeight} !important;
      }
      
      .${cssClassName} strong {
        color: #111827 !important;
        font-size: ${fontSize}px !important;
        line-height: ${lineHeight} !important;
      }
      
      .${cssClassName} .company,
      .${cssClassName} .job-date,
      .${cssClassName} .location-date,
      .${cssClassName} .award-year,
      .${cssClassName} .header-item {
        font-size: ${fontSize}px !important;
        line-height: ${lineHeight} !important;
      }
    `;
  }, [
    css,
    fontSize,
    pagePadding,
    lineHeight,
    paragraphSpacing,
    themeColor,
    cssClassName,
  ]);

  const containerClasses = cn(
    "h-full w-full bg-transparent overflow-hidden",
    "flex flex-col items-start justify-start relative",
    className
  );

  const pageClasses = "relative overflow-hidden shrink-0";
  const contentClasses = cn(
    "h-full w-full box-border overflow-hidden relative text-gray-800 bg-white break-words",
    "font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]",
    cssClassName
  );

  return (
    <div className={containerClasses} ref={setContainerRef}>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div
        className={pageClasses}
        style={{
          width: `${pageDimensions.width}px`,
          height: `${pageDimensions.height}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <div className={cn(contentClasses, "h-full px-[var(--padding)]")}>
          {contentOverlay ? (
            <div
              className="absolute top-2 right-2 z-10 pointer-events-auto"
              style={{
                transform: `scale(${1 / Math.max(0.2, Math.min(1, scale))})`,
                transformOrigin: "top right",
              }}
            >
              {contentOverlay}
            </div>
          ) : null}
          {templateId ? (
            <TemplateHost
              templateId={templateId}
              markdown={markdown}
              theme={{
                color: themeColor,
                fontSize,
                lineHeight,
                pagePadding,
                paragraphSpacing,
              }}
            />
          ) : (
            <MarkdownRenderer 
              content={markdown} 
              theme={{
                color: themeColor,
                fontSize,
                lineHeight,
                pagePadding,
                paragraphSpacing,
              }} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
