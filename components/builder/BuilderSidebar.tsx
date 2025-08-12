import React from "react";
import Link from "next/link";

// Theme color options
const themeColors = [
  { name: "Site Theme", value: "#3ECF8E" },
  { name: "Blue", value: "#377BB5" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
];

interface BuilderSidebarProps {
  pageFormat: "A4" | "Letter";
  fontSize: number;
  pagePadding: number;
  lineHeight: number;
  paragraphSpacing: number;
  themeColor: string;
  customColor: string;
  onPageFormatChange: (format: "A4" | "Letter") => void;
  onFontSizeChange: (size: number) => void;
  onPagePaddingChange: (padding: number) => void;
  onLineHeightChange: (height: number) => void;
  onParagraphSpacingChange: (spacing: number) => void;
  onThemeColorChange: (color: string) => void;
  onCustomColorChange: (color: string) => void;
}

export const BuilderSidebar: React.FC<BuilderSidebarProps> = ({
  pageFormat,
  fontSize,
  pagePadding,
  lineHeight,
  paragraphSpacing,
  themeColor,
  customColor,
  onPageFormatChange,
  onFontSizeChange,
  onPagePaddingChange,
  onLineHeightChange,
  onParagraphSpacingChange,
  onThemeColorChange,
  onCustomColorChange,
}) => {
  return (
    <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <Link href="/dashboard" className="flex items-center space-x-2 mb-3">
          <div className="w-5 h-5 bg-[#3ECF8E] rounded flex items-center justify-center">
            <span className="text-slate-900 font-bold text-xs">CV</span>
          </div>
          <span className="text-slate-900 dark:text-white font-medium text-sm">
            lebenslauf
          </span>
        </Link>
      </div>

      {/* Controls */}
      <div className="flex-1 p-4 space-y-8 overflow-y-auto">
        {/* Page Settings */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
            Page Settings
          </h3>

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
                    : "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                }`}
              >
                A4
              </button>
              <button
                onClick={() => onPageFormatChange("Letter")}
                className={`p-2 rounded text-xs transition-colors ${
                  pageFormat === "Letter"
                    ? "bg-[#3ECF8E] text-slate-900 font-medium"
                    : "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
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
        </div>

        {/* Separator */}
        <div className="border-t border-slate-200 dark:border-slate-700/50"></div>

        {/* Typography Settings */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
            Typography
          </h3>

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

        {/* Separator */}
        <div className="border-t border-slate-200 dark:border-slate-700/50"></div>

        {/* Theme Settings */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
            Theme
          </h3>

          {/* Theme Color Options */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Theme Color
            </label>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {themeColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => onThemeColorChange(color.value)}
                  className={`w-8 h-8 rounded border-2 transition-all ${
                    themeColor === color.value
                      ? "border-white scale-110"
                      : "border-slate-600 hover:border-slate-400"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Custom Color Input */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Custom Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={themeColor}
                onChange={(e) => onThemeColorChange(e.target.value)}
                className="w-8 h-8 rounded border border-slate-300 dark:border-slate-600 cursor-pointer"
              />
              <input
                type="text"
                placeholder="#3ECF8E"
                value={customColor}
                onChange={(e) => onCustomColorChange(e.target.value)}
                className="flex-1 bg-white text-slate-900 dark:bg-slate-700 dark:text-slate-300 text-xs rounded p-2 border border-slate-300 dark:border-slate-600 focus:border-[#3ECF8E] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
