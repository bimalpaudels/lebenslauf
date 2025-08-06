"use client";

import React, { useMemo, useState } from "react";
import { parseMarkdownToHtml } from "@/lib/template-loader";
import { cn } from "@/lib/utils";
import { useViewportScaling } from "../hooks/useViewportScaling";
import { generateCVStyles, CVStyleConfig } from "../utils/cvStyleGenerator";
import { CVEmptyState } from "./CVEmptyState";
import { CVPageContent } from "./CVPageContent";

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
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  const { scale, pageDimensions } = useViewportScaling({
    containerRef,
    pageFormat,
    standalone: true, // SavedCVPreview always acts like standalone
  });

  const styleConfig: CVStyleConfig = {
    css,
    fontSize,
    pagePadding,
    lineHeight,
    paragraphSpacing,
    themeColor,
    className: "saved-cv-preview-content",
  };

  const customStyles = useMemo(
    () => generateCVStyles(styleConfig),
    [css, fontSize, pagePadding, lineHeight, paragraphSpacing, themeColor]
  );

  const previewHtml = useMemo(() => parseMarkdownToHtml(markdown), [markdown]);

  const containerClasses = cn(
    "h-full w-full bg-transparent overflow-hidden",
    "p-2.5 flex flex-col items-center justify-start relative",
    className
  );

  const renderContent = () => {
    if (!previewHtml) {
      return (
        <CVEmptyState
          width={pageDimensions.width}
          height={pageDimensions.height}
          scale={scale}
          standalone={true}
        />
      );
    }

    return (
      <CVPageContent
        html={previewHtml}
        width={pageDimensions.width}
        height={pageDimensions.height}
        scale={scale}
        standalone={true}
        className="saved-cv-preview-content"
      />
    );
  };

  return (
    <div className={containerClasses} ref={setContainerRef}>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      {renderContent()}
    </div>
  );
};

export default SavedCVPreview;
