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
      <script src="https://code.iconify.design/3/3.1.1/iconify.min.js" async />
      <div className={containerClasses} ref={containerRef}>
        {children}
      </div>
    </div>
  );
};
