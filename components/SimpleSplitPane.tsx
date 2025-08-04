"use client";

import React, { useState, useCallback } from "react";

interface SimpleSplitPaneProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
}

const SimpleSplitPane: React.FC<SimpleSplitPaneProps> = ({
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
        ".simple-split-pane"
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
    <div className={`simple-split-pane h-full w-full ${className}`}>
      <div className="split-container h-full flex">
        <div
          className="split-pane-left overflow-hidden"
          style={{ width: `${leftSize}%` }}
        >
          {leftPanel}
        </div>

        <div
          className="split-resizer cursor-col-resize relative"
          onMouseDown={handleMouseDown}
        >
          <div className="resizer-handle absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-8 bg-slate-400 rounded-full"></div>
          </div>
        </div>

        <div
          className="split-pane-right overflow-hidden"
          style={{ width: `${100 - leftSize}%` }}
        >
          {rightPanel}
        </div>
      </div>

      <style jsx>{`
        .simple-split-pane {
          height: 100%;
          width: 100%;
        }

        .split-container {
          height: 100%;
        }

        .split-pane-left,
        .split-pane-right {
          height: 100% !important;
          overflow: hidden;
        }

        .split-resizer {
          background: #334155 !important;
          border-left: 1px solid #475569 !important;
          border-right: 1px solid #475569 !important;
          cursor: col-resize !important;
          width: 6px !important;
          transition: all 0.2s ease !important;
          position: relative !important;
          flex-shrink: 0;
        }

        .split-resizer:hover {
          background: #3ecf8e !important;
          border-color: #4be4b4 !important;
        }

        .split-resizer:active {
          background: #4be4b4 !important;
        }

        .resizer-handle {
          pointer-events: none;
        }

        /* Responsive behavior */
        @media (max-width: 768px) {
          .split-resizer {
            width: 8px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SimpleSplitPane;
