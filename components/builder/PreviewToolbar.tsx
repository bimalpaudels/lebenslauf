import React, { useState } from "react";

// Theme color options (same as BuilderSidebar)
const themeColors = [
  { name: "Site Theme", value: "#3ECF8E" },
  { name: "Blue", value: "#377BB5" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
];

interface PreviewToolbarProps {
  pageFormat: "A4" | "Letter";
  fontSize: number;
  pagePadding: number;
  lineHeight: number;
  paragraphSpacing: number;
  themeColor: string;
  onPageFormatChange: (format: "A4" | "Letter") => void;
  onFontSizeChange: (size: number) => void;
  onPagePaddingChange: (padding: number) => void;
  onLineHeightChange: (height: number) => void;
  onParagraphSpacingChange: (spacing: number) => void;
  onThemeColorChange: (color: string) => void;
  onExportPDF: () => void;
}

export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  pageFormat,
  fontSize,
  pagePadding,
  lineHeight,
  paragraphSpacing,
  themeColor,
  onPageFormatChange,
  onFontSizeChange,
  onPagePaddingChange,
  onLineHeightChange,
  onParagraphSpacingChange,
  onThemeColorChange,
  onExportPDF,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 flex-shrink-0">
      {/* Theme Colors */}
      <div className="flex items-center gap-1.5">
        {themeColors.map((color) => (
          <button
            key={color.value}
            onClick={() => onThemeColorChange(color.value)}
            className={`w-5 h-5 rounded-full border-2 transition-all hover:scale-110 ${
              themeColor === color.value
                ? "border-slate-800 dark:border-white scale-110"
                : "border-transparent hover:border-slate-400"
            }`}
            style={{ backgroundColor: color.value }}
            title={color.name}
          />
        ))}
        {/* Custom color picker */}
        <div className="relative ml-1">
          <input
            type="color"
            value={themeColor}
            onChange={(e) => onThemeColorChange(e.target.value)}
            className="w-5 h-5 rounded-full cursor-pointer border border-slate-300 dark:border-slate-600"
            title="Custom color"
          />
        </div>
      </div>

      {/* Right side: Settings + Export */}
      <div className="flex items-center gap-2">
        {/* Settings Popover */}
        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-md transition-colors ${
              showSettings
                ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Settings"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>

          {/* Settings Dropdown */}
          {showSettings && (
            <>
              {/* Backdrop to close on click outside */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowSettings(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-4 space-y-4 z-20">
                {/* Page Format */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Page Format
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onPageFormatChange("A4")}
                      className={`p-2 rounded text-xs transition-colors ${
                        pageFormat === "A4"
                          ? "bg-[#3ECF8E] text-slate-900 font-medium"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                      }`}
                    >
                      A4
                    </button>
                    <button
                      onClick={() => onPageFormatChange("Letter")}
                      className={`p-2 rounded text-xs transition-colors ${
                        pageFormat === "Letter"
                          ? "bg-[#3ECF8E] text-slate-900 font-medium"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                      }`}
                    >
                      Letter
                    </button>
                  </div>
                </div>

                {/* Page Padding */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Content Padding: {pagePadding}px
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="48"
                    value={pagePadding}
                    onChange={(e) => onPagePaddingChange(parseInt(e.target.value))}
                    className="w-full accent-[#3ECF8E]"
                  />
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Font Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="16"
                    value={fontSize}
                    onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
                    className="w-full accent-[#3ECF8E]"
                  />
                </div>

                {/* Line Height */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Line Height: {lineHeight}
                  </label>
                  <input
                    type="range"
                    min="1.2"
                    max="1.6"
                    step="0.1"
                    value={lineHeight}
                    onChange={(e) => onLineHeightChange(parseFloat(e.target.value))}
                    className="w-full accent-[#3ECF8E]"
                  />
                </div>

                {/* Paragraph Spacing */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Paragraph Spacing: {paragraphSpacing}rem
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.1"
                    value={paragraphSpacing}
                    onChange={(e) =>
                      onParagraphSpacingChange(parseFloat(e.target.value))
                    }
                    className="w-full accent-[#3ECF8E]"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Export PDF Button */}
        <button
          onClick={onExportPDF}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-[#3ECF8E] text-slate-900 rounded-md font-medium hover:bg-[#4BE4B4] transition-colors"
          title="Export PDF"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export
        </button>
      </div>
    </div>
  );
};
