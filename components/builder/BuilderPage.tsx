import React from "react";
import { cn } from "@/lib/utils";

interface BuilderPageProps {
  pageContent: string;
  index: number;
  width: number;
  height: number;
  scale: number;
}

export const BuilderPage: React.FC<BuilderPageProps> = ({
  pageContent,
  width,
  height,
  scale,
}) => {
  const pageWrapperClasses = "shrink-0";
  
  const pageClasses = cn(
    "bg-white shadow-lg rounded-none relative overflow-hidden",
    "transition-shadow duration-300 ease-in-out shrink-0 origin-top-left",
    "hover:shadow-xl"
  );

  const pageContentClasses = "h-full w-full box-border overflow-hidden relative page-content";

  return (
    <div 
      className={pageWrapperClasses}
      style={{
        width: `${width * scale}px`,
        height: `${height * scale}px`
      }}
    >
      <div 
        className={pageClasses}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scale})`
        }}
      >
        <div className={pageContentClasses}>
          <div dangerouslySetInnerHTML={{ __html: pageContent }} />
        </div>
      </div>
    </div>
  );
};