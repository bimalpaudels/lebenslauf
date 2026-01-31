"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

// Theme color options (same as BuilderSidebar)
const themeColors = [
  { name: "Site Theme", value: "#3ECF8E" },
  { name: "Blue", value: "#377BB5" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
];

type OpenMenu =
  | "colors"
  | "pageFormat"
  | "padding"
  | "fontSize"
  | "lineHeight"
  | "paragraphSpacing"
  | null;

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

const DROPDOWN_Z = 9999;

function useDropdownPosition(anchorRef: React.RefObject<HTMLElement | null>, isOpen: boolean) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!isOpen || !anchorRef.current) return;
    const el = anchorRef.current;
    const rect = el.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 6,
      left: rect.left,
    });
  }, [isOpen, anchorRef]);

  return position;
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
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const colorsRef = useRef<HTMLButtonElement>(null);
  const pageFormatRef = useRef<HTMLButtonElement>(null);
  const paddingRef = useRef<HTMLButtonElement>(null);
  const fontSizeRef = useRef<HTMLButtonElement>(null);
  const lineHeightRef = useRef<HTMLButtonElement>(null);
  const paragraphRef = useRef<HTMLButtonElement>(null);

  const colorsPos = useDropdownPosition(colorsRef, openMenu === "colors");
  const pageFormatPos = useDropdownPosition(pageFormatRef, openMenu === "pageFormat");
  const paddingPos = useDropdownPosition(paddingRef, openMenu === "padding");
  const fontSizePos = useDropdownPosition(fontSizeRef, openMenu === "fontSize");
  const lineHeightPos = useDropdownPosition(lineHeightRef, openMenu === "lineHeight");
  const paragraphPos = useDropdownPosition(paragraphRef, openMenu === "paragraphSpacing");

  const closeMenu = () => setOpenMenu(null);
  const toggleMenu = (menu: OpenMenu) => setOpenMenu((m) => (m === menu ? null : menu));

  // Close on escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const iconButtonClass = (menu: OpenMenu) =>
    `p-2 rounded-md transition-colors ${
      openMenu === menu
        ? "bg-slate-600/80 text-white"
        : "text-slate-200 hover:bg-slate-700/80 hover:text-white"
    }`;

  const dropdownPanelClass =
    "bg-slate-800 rounded-lg shadow-xl border border-slate-600/50 p-4 min-w-[180px]";

  const separator = <div className="h-5 w-px bg-slate-600/70 flex-shrink-0" aria-hidden />;

  const renderBackdrop = () =>
    createPortal(
      <div
        className="fixed inset-0"
        style={{ zIndex: DROPDOWN_Z - 1 }}
        onClick={closeMenu}
        aria-hidden="true"
      />,
      document.body
    );

  return (
    <div className="flex items-center gap-0.5 px-2 py-1.5 rounded-full bg-slate-800/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-600/50 shadow-lg flex-shrink-0 w-max">
      {/* Color palette icon → dropdown */}
      <div className="relative">
        <button
          ref={colorsRef}
          type="button"
          onClick={() => toggleMenu("colors")}
          className={iconButtonClass("colors")}
          title="Theme color"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="9" cy="9" r="1.5" fill="currentColor" />
            <circle cx="15" cy="10" r="1.5" fill="currentColor" />
            <circle cx="11" cy="15" r="1.5" fill="currentColor" />
          </svg>
        </button>
      </div>
      {separator}

      {/* Page format icon → dropdown */}
      <div className="relative">
        <button
          ref={pageFormatRef}
          type="button"
          onClick={() => toggleMenu("pageFormat")}
          className={iconButtonClass("pageFormat")}
          title="Page format"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </button>
      </div>

      {/* Padding icon → dropdown */}
      <div className="relative">
        <button
          ref={paddingRef}
          type="button"
          onClick={() => toggleMenu("padding")}
          className={iconButtonClass("padding")}
          title="Content padding"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
          </svg>
        </button>
      </div>
      {separator}

      {/* Font size icon → dropdown */}
      <div className="relative">
        <button
          ref={fontSizeRef}
          type="button"
          onClick={() => toggleMenu("fontSize")}
          className={iconButtonClass("fontSize")}
          title="Font size"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16M12 4v16" />
          </svg>
        </button>
      </div>

      {/* Line height icon → dropdown */}
      <div className="relative">
        <button
          ref={lineHeightRef}
          type="button"
          onClick={() => toggleMenu("lineHeight")}
          className={iconButtonClass("lineHeight")}
          title="Line height"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>

      {/* Paragraph spacing icon → dropdown */}
      <div className="relative">
        <button
          ref={paragraphRef}
          type="button"
          onClick={() => toggleMenu("paragraphSpacing")}
          className={iconButtonClass("paragraphSpacing")}
          title="Paragraph spacing"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 5h10M7 12h10M7 19h10" />
          </svg>
        </button>
      </div>
      {separator}

      {/* Export icon - solid accent button */}
      <button
        type="button"
        onClick={onExportPDF}
        className="p-2 rounded-full bg-violet-500 hover:bg-violet-400 text-white transition-colors"
        title="Export PDF"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </button>

      {/* Dropdowns via portal so they are never clipped and always on top */}
      {openMenu !== null && renderBackdrop()}

      {openMenu === "colors" &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={dropdownPanelClass}
            style={{
              position: "fixed",
              top: colorsPos.top,
              left: colorsPos.left,
              zIndex: DROPDOWN_Z,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-medium text-slate-200 mb-3">Theme color</p>
            <div className="flex flex-wrap gap-2">
              {themeColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => {
                    onThemeColorChange(color.value);
                    closeMenu();
                  }}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    themeColor === color.value
                      ? "border-white scale-110"
                      : "border-transparent hover:border-slate-400"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-600">
              <label className="block text-xs font-medium text-slate-200 mb-2">Custom</label>
              <input
                type="color"
                value={themeColor}
                onChange={(e) => onThemeColorChange(e.target.value)}
                className="w-full h-8 rounded border border-slate-300 dark:border-slate-600 cursor-pointer"
              />
            </div>
          </div>,
          document.body
        )}

      {openMenu === "pageFormat" &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={dropdownPanelClass}
            style={{
              position: "fixed",
              top: pageFormatPos.top,
              left: pageFormatPos.left,
              zIndex: DROPDOWN_Z,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-medium text-slate-200 mb-3">Page format</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onPageFormatChange("A4");
                  closeMenu();
                }}
                className={`p-2 rounded text-xs transition-colors ${
                  pageFormat === "A4"
                    ? "bg-violet-500 text-white font-medium"
                    : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                }`}
              >
                A4
              </button>
              <button
                type="button"
                onClick={() => {
                  onPageFormatChange("Letter");
                  closeMenu();
                }}
                className={`p-2 rounded text-xs transition-colors ${
                  pageFormat === "Letter"
                    ? "bg-violet-500 text-white font-medium"
                    : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                }`}
              >
                Letter
              </button>
            </div>
          </div>,
          document.body
        )}

      {openMenu === "padding" &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={dropdownPanelClass}
            style={{
              position: "fixed",
              top: paddingPos.top,
              left: paddingPos.left,
              zIndex: DROPDOWN_Z,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-medium text-slate-200 mb-2">
              Content padding: {pagePadding}px
            </p>
            <input
              type="range"
              min="8"
              max="48"
              value={pagePadding}
              onChange={(e) => onPagePaddingChange(parseInt(e.target.value))}
              className="w-full accent-violet-500"
            />
          </div>,
          document.body
        )}

      {openMenu === "fontSize" &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={dropdownPanelClass}
            style={{
              position: "fixed",
              top: fontSizePos.top,
              left: fontSizePos.left,
              zIndex: DROPDOWN_Z,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-medium text-slate-200 mb-2">Font size: {fontSize}px</p>
            <input
              type="range"
              min="10"
              max="16"
              value={fontSize}
              onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
              className="w-full accent-violet-500"
            />
          </div>,
          document.body
        )}

      {openMenu === "lineHeight" &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={dropdownPanelClass}
            style={{
              position: "fixed",
              top: lineHeightPos.top,
              left: lineHeightPos.left,
              zIndex: DROPDOWN_Z,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-medium text-slate-200 mb-2">Line height: {lineHeight}</p>
            <input
              type="range"
              min="1.2"
              max="1.6"
              step="0.1"
              value={lineHeight}
              onChange={(e) => onLineHeightChange(parseFloat(e.target.value))}
              className="w-full accent-violet-500"
            />
          </div>,
          document.body
        )}

      {openMenu === "paragraphSpacing" &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={dropdownPanelClass}
            style={{
              position: "fixed",
              top: paragraphPos.top,
              left: paragraphPos.left,
              zIndex: DROPDOWN_Z,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-medium text-slate-200 mb-2">
              Paragraph spacing: {paragraphSpacing}rem
            </p>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={paragraphSpacing}
              onChange={(e) => onParagraphSpacingChange(parseFloat(e.target.value))}
              className="w-full accent-violet-500"
            />
          </div>,
          document.body
        )}
    </div>
  );
};
