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
          className="w-px bg-slate-200 dark:bg-slate-800 hover:bg-emerald-500 cursor-col-resize flex-shrink-0 transition-colors duration-200 relative group"
          onMouseDown={handleMouseDown}
        >
          {/* Larger hit area for dragging */}
          <div className="absolute inset-y-0 -left-1 -right-1 cursor-col-resize" />
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
