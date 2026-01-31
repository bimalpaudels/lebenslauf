"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { MarkdownRendererFromHtml, type ThemeConfig } from "@/components/MarkdownRenderer";

interface BuilderPageProps {
  pageContent: string;
  index: number;
  width: number;
  height: number;
  scale: number;
  theme: ThemeConfig;
}

export const BuilderPage: React.FC<BuilderPageProps> = ({
  pageContent,
  width,
  height,
  scale,
  theme,
}) => {
  const pageWrapperClasses = "shrink-0";

  const pageClasses = cn(
    "bg-white shadow-lg rounded-none relative overflow-hidden",
    "transition-shadow duration-300 ease-in-out shrink-0 origin-top-left",
    "hover:shadow-xl"
  );

  const pageContentClasses =
    "h-full w-full box-border overflow-hidden relative page-content";

  return (
    <div
      className={pageWrapperClasses}
      style={{
        width: `${width * scale}px`,
        height: `${height * scale}px`,
      }}
    >
      <div
        className={pageClasses}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scale})`,
        }}
      >
        <div
          className={cn(pageContentClasses, "h-full")}
          style={{
            padding: `${theme.pagePadding}px`,
            fontSize: `${theme.fontSize}px`,
            lineHeight: theme.lineHeight,
          }}
        >
          <MarkdownRendererFromHtml
            html={pageContent}
            theme={theme}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};
