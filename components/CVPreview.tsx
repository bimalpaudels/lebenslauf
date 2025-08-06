"use client";

import React, { useMemo, useState } from "react";
import { parseMarkdownToHtml } from "@/lib/template-loader";
import { cn } from "@/lib/utils";
import { useViewportScaling } from "../hooks/useViewportScaling";
import { generateCVStyles, CVStyleConfig } from "../utils/cvStyleGenerator";
import { CVEmptyState } from "./CVEmptyState";
import { CVPageContent } from "./CVPageContent";

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
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  const { scale, pageDimensions } = useViewportScaling({
    containerRef,
    pageFormat,
    standalone,
  });

  const styleConfig: CVStyleConfig = {
    css,
    fontSize,
    pagePadding,
    lineHeight,
    paragraphSpacing,
    themeColor,
  };

  const customStyles = useMemo(
    () => generateCVStyles(styleConfig),
    [css, fontSize, pagePadding, lineHeight, paragraphSpacing, themeColor]
  );

  const previewHtml = useMemo(() => parseMarkdownToHtml(markdown), [markdown]);

  const containerClasses = cn(
    "h-full w-full flex flex-col items-center relative",
    standalone
      ? "bg-transparent overflow-hidden p-2.5 justify-start"
      : "bg-gray-50 overflow-hidden p-5 justify-center rounded-lg",
    className
  );

  const renderContent = () => {
    if (!previewHtml) {
      return (
        <CVEmptyState
          width={pageDimensions.width}
          height={pageDimensions.height}
          scale={scale}
          standalone={standalone}
        />
      );
    }

    return (
      <CVPageContent
        html={previewHtml}
        width={pageDimensions.width}
        height={pageDimensions.height}
        scale={scale}
        standalone={standalone}
      />
    );
  };

  return (
    <div className={containerClasses} ref={setContainerRef}>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <script src="https://code.iconify.design/3/3.1.1/iconify.min.js" async />
      {renderContent()}
    </div>
  );
};

export default CVPreview;
