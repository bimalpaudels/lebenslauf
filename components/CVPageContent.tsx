import React from "react";
import { cn } from "@/lib/utils";

interface CVPageContentProps {
  html: string;
  width: number;
  height: number;
  scale: number;
  standalone: boolean;
  className?: string;
}

export const CVPageContent: React.FC<CVPageContentProps> = ({
  html,
  width,
  height,
  scale,
  standalone,
  className = "cv-preview-content",
}) => {
  const pageClasses = cn(
    "bg-white relative overflow-hidden shrink-0 rounded",
    standalone ? "shadow-md" : "shadow-sm my-2.5"
  );

  const contentClasses = cn(
    "h-full w-full box-border overflow-hidden relative text-gray-800 bg-white break-words",
    "font-[Inter,-apple-system,BlinkMacSystemFont,Segoe_UI,Roboto,sans-serif]",
    className
  );

  return (
    <div
      className={pageClasses}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `scale(${scale})`,
        transformOrigin: standalone ? "top center" : "center center",
      }}
    >
      <div className={contentClasses}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
};
