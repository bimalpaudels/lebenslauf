import React from "react";

interface BuilderPageContainerProps {
  children: React.ReactNode;
  containerRef: (node: HTMLDivElement | null) => void;
  customStyles: string;
}

export const BuilderPageContainer: React.FC<BuilderPageContainerProps> = ({
  children,
  containerRef,
  customStyles,
}) => {
  const containerClasses = "preview-container";

  return (
    <div className="h-full w-full relative">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className={containerClasses} ref={containerRef}>
        {children}
      </div>
    </div>
  );
};
