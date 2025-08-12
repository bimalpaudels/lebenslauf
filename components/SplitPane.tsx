"use client";

import React, { useState, useCallback } from "react";

interface SplitPaneProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
}

const SplitPane: React.FC<SplitPaneProps> = ({
  leftPanel,
  rightPanel,
  defaultSize = 50,
  minSize = 30,
  maxSize = 70,
  className = "",
}) => {
  const [leftSize, setLeftSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const container = document.querySelector(
        ".split-pane-container"
      ) as HTMLElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;

      const clampedPercentage = Math.max(
        minSize,
        Math.min(maxSize, percentage)
      );
      setLeftSize(clampedPercentage);
    },
    [isDragging, minSize, maxSize]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className={`split-pane-container h-full w-full ${className}`}>
      <div className="h-full flex">
        <div
          className="h-full overflow-hidden"
          style={{ width: `${leftSize}%` }}
        >
          {leftPanel}
        </div>

        <div
          className="bg-slate-400 dark:bg-slate-600 border-l border-r border-slate-300 dark:border-slate-500 cursor-col-resize w-1.5 md:w-2 flex-shrink-0 relative transition-all duration-200 ease-in-out hover:bg-emerald-400 hover:border-emerald-300 active:bg-emerald-300"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-0.5 h-8 bg-slate-300 dark:bg-slate-400 rounded-full"></div>
          </div>
        </div>

        <div
          className="h-full overflow-hidden"
          style={{ width: `${100 - leftSize}%` }}
        >
          {rightPanel}
        </div>
      </div>
    </div>
  );
};

export default SplitPane;
