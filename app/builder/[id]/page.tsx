"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { loadCV, updateCV, type CVData } from "@/lib/storage";
import RichTextEditor from "@/components/RichTextEditor";
import SimplePreview, { SimplePreviewRef } from "@/components/SimplePreview";
import SimpleSplitPane from "@/components/SimpleSplitPane";

interface BuilderPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Theme color options
const themeColors = [
  { name: "Site Theme", value: "#3ECF8E" },
  { name: "Blue", value: "#377BB5" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
];

export default function BuilderPage({ params }: BuilderPageProps) {
  const [pageFormat, setPageFormat] = useState<"A4" | "Letter">("A4");
  const [fontSize, setFontSize] = useState(12);
  const [cvId, setCvId] = useState<string>("");
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [templateMarkdown, setTemplateMarkdown] = useState<string>("");
  const [templateCss, setTemplateCss] = useState<string>("");
  const [templateName, setTemplateName] = useState<string>("");
  const [pagePadding, setPagePadding] = useState(16);
  const [paragraphSpacing, setParagraphSpacing] = useState(1);
  const [lineHeight, setLineHeight] = useState(1.4);
  const [themeColor, setThemeColor] = useState("#3ECF8E");
  const [customColor, setCustomColor] = useState("");

  // Auto-save timer ref
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Ref to access the SimplePreview export functionality
  const previewRef = useRef<SimplePreviewRef>(null);

  useEffect(() => {
    const initializeBuilder = async () => {
      try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        setCvId(id);

        // Load CV data from localForage
        const savedCV = await loadCV(id);
        if (savedCV) {
          setCvData(savedCV);
          setTemplateMarkdown(savedCV.content);
          setTemplateCss(savedCV.design);
          setTemplateName(savedCV.name);

          // Load styles from saved data
          if (savedCV.style) {
            setFontSize(savedCV.style.fontSize);
            setLineHeight(savedCV.style.lineHeight);
            setPagePadding(savedCV.style.marginV);
            setParagraphSpacing(savedCV.style.paragraphSpace);
            setPageFormat(savedCV.style.pageSize as "A4" | "Letter");
            setThemeColor(savedCV.style.theme);
          }
        } else {
          // CV not found, redirect to dashboard
          window.location.href = "/dashboard";
          return;
        }
      } catch (error) {
        console.error("Error loading CV:", error);
        window.location.href = "/dashboard";
        return;
      } finally {
        setLoading(false);
      }
    };

    initializeBuilder();
  }, [params]);

  // Auto-save function with 3-second delay
  const autoSave = useCallback(
    async (markdown: string) => {
      if (!cvId || !cvData) return;

      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer
      autoSaveTimerRef.current = setTimeout(async () => {
        try {
          setIsSaving(true);
          await updateCV(cvId, {
            content: markdown,
            updated_at: Date.now().toString(),
          });
        } catch (error) {
          console.error("Error auto-saving CV:", error);
        } finally {
          setIsSaving(false);
        }
      }, 3000);
    },
    [cvId, cvData]
  );

  // Handle markdown changes with auto-save
  const handleMarkdownChange = (newMarkdown: string) => {
    setTemplateMarkdown(newMarkdown);
    autoSave(newMarkdown);
  };

  // Handle font size change
  const handleFontSizeChange = (value: number) => {
    setFontSize(value);
    if (cvId && cvData) {
      updateCV(cvId, {
        style: {
          ...cvData.style,
          fontSize: value,
        },
      });
    }
  };

  // Handle page format change
  const handlePageFormatChange = (format: "A4" | "Letter") => {
    setPageFormat(format);
    if (cvId && cvData) {
      updateCV(cvId, {
        style: {
          ...cvData.style,
          pageSize: format,
        },
      });
    }
  };

  // Handle page padding change
  const handlePagePaddingChange = (value: number) => {
    setPagePadding(value);
    if (cvId && cvData) {
      updateCV(cvId, {
        style: {
          ...cvData.style,
          marginV: value,
        },
      });
    }
  };

  // Handle line height change
  const handleLineHeightChange = (value: number) => {
    setLineHeight(value);
    if (cvId && cvData) {
      updateCV(cvId, {
        style: {
          ...cvData.style,
          lineHeight: value,
        },
      });
    }
  };

  // Handle paragraph spacing change
  const handleParagraphSpacingChange = (value: number) => {
    setParagraphSpacing(value);
    if (cvId && cvData) {
      updateCV(cvId, {
        style: {
          ...cvData.style,
          paragraphSpace: value,
        },
      });
    }
  };

  // Handle theme color change
  const handleThemeColorChange = (color: string) => {
    setThemeColor(color);
    if (cvId && cvData) {
      updateCV(cvId, {
        style: {
          ...cvData.style,
          theme: color,
        },
      });
    }
  };

  // Handle custom color input
  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    if (color.match(/^#[0-9A-F]{6}$/i)) {
      handleThemeColorChange(color);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">CV not found</div>
      </div>
    );
  }

  return (
    <>
      {/* --- CORRECTED PRINT STYLES --- */}
      <style jsx global>{`
        @media print {
          /* Hide any element with this class */
          .print-hide {
            display: none !important;
          }

          /* Reset the body and main containers to allow content to be visible */
          body,
          #__next,
          .h-screen {
            height: auto !important;
            overflow: visible !important;
            background: #fff !important;
          }

          /* Override the split pane layout for printing */
          .simple-split-pane .split-container {
            display: block !important;
          }

          .simple-split-pane .split-pane-left,
          .simple-split-pane .split-resizer {
            display: none !important;
          }

          .simple-split-pane .split-pane-right {
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }

          /* Ensure the preview container itself is not hidden by an ancestor */
          .preview-print-container {
            overflow: visible !important;
            height: auto !important;
            position: static !important;
          }
        }
      `}</style>

      <div className="h-screen bg-slate-900 flex overflow-hidden">
        {/* Left Sidebar - Controls */}
        <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col flex-shrink-0 print-hide">
          {/* Header */}
          <div className="p-4 border-b border-slate-700">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 mb-3"
            >
              <div className="w-5 h-5 bg-[#3ECF8E] rounded flex items-center justify-center">
                <span className="text-slate-900 font-bold text-xs">CV</span>
              </div>
              <span className="text-white font-medium text-sm">lebenslauf</span>
            </Link>
          </div>

          {/* Controls */}
          <div className="flex-1 p-4 space-y-8 overflow-y-auto">
            {/* Page Settings */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                Page Settings
              </h3>

              {/* Page Format */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Page Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handlePageFormatChange("A4")}
                    className={`p-2 rounded text-xs transition-colors ${
                      pageFormat === "A4"
                        ? "bg-[#3ECF8E] text-slate-900 font-medium"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    A4
                  </button>
                  <button
                    onClick={() => handlePageFormatChange("Letter")}
                    className={`p-2 rounded text-xs transition-colors ${
                      pageFormat === "Letter"
                        ? "bg-[#3ECF8E] text-slate-900 font-medium"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    Letter
                  </button>
                </div>
              </div>

              {/* Page Padding */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Content Padding: {pagePadding}px
                </label>
                <input
                  type="range"
                  min="8"
                  max="48"
                  value={pagePadding}
                  onChange={(e) =>
                    handlePagePaddingChange(parseInt(e.target.value))
                  }
                  className="w-full accent-[#3ECF8E]"
                />
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-slate-700/50"></div>

            {/* Typography Settings */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                Typography
              </h3>

              {/* Font Size */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Font Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="16"
                  value={fontSize}
                  onChange={(e) =>
                    handleFontSizeChange(parseInt(e.target.value))
                  }
                  className="w-full accent-[#3ECF8E]"
                />
              </div>

              {/* Line Height */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Line Height: {lineHeight}
                </label>
                <input
                  type="range"
                  min="1.2"
                  max="1.6"
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) =>
                    handleLineHeightChange(parseFloat(e.target.value))
                  }
                  className="w-full accent-[#3ECF8E]"
                />
              </div>

              {/* Paragraph Spacing */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Paragraph Spacing: {paragraphSpacing}rem
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={paragraphSpacing}
                  onChange={(e) =>
                    handleParagraphSpacingChange(parseFloat(e.target.value))
                  }
                  className="w-full accent-[#3ECF8E]"
                />
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-slate-700/50"></div>

            {/* Theme Settings */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
                Theme
              </h3>

              {/* Theme Color Options */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Theme Color
                </label>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {themeColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handleThemeColorChange(color.value)}
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
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Custom Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => handleThemeColorChange(e.target.value)}
                    className="w-8 h-8 rounded border border-slate-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    placeholder="#3ECF8E"
                    value={customColor}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    className="flex-1 bg-slate-700 text-slate-300 text-xs rounded p-2 border border-slate-600 focus:border-[#3ECF8E] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <SimpleSplitPane
            leftPanel={
              <div className="h-full flex flex-col bg-slate-900 print-hide">
                {/* Editor Header */}
                <div className="bg-slate-800 border-b border-slate-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <div className="text-[#3ECF8E] text-lg">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10,9 9,9 8,9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        Edit CV
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div
                        className={`w-2 h-2 rounded-full animate-pulse ${
                          isSaving ? "bg-amber-400" : "bg-green-400"
                        }`}
                      ></div>
                      <span className="text-xs text-slate-400">
                        {isSaving ? "Saving..." : "Auto-save"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rich Text Editor */}
                <div className="flex-1 overflow-hidden">
                  <RichTextEditor
                    value={templateMarkdown}
                    onChange={handleMarkdownChange}
                    placeholder="Start writing your CV in markdown..."
                  />
                </div>
              </div>
            }
            rightPanel={
              <div className="h-full flex flex-col bg-slate-900">
                {/* Preview Header */}
                <div className="bg-slate-800 border-b border-slate-600 px-4 py-3 flex items-center justify-between flex-shrink-0 print-hide">
                  <div className="flex items-center space-x-3">
                    <div className="text-[#3ECF8E] text-lg">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        Live Preview
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-slate-400">Live</span>
                    </div>
                    <button
                      onClick={() => previewRef.current?.exportToPDF()}
                      className="px-3 py-1 text-xs bg-[#3ECF8E] text-slate-900 rounded font-medium hover:bg-[#4BE4B4] transition-colors"
                    >
                      Export PDF
                    </button>
                  </div>
                </div>

                {/* Preview Container - ADDED .preview-print-container class */}
                <div className="flex-1 overflow-hidden preview-print-container">
                  <SimplePreview
                    ref={previewRef}
                    markdown={templateMarkdown}
                    templateCss={templateCss}
                    pageFormat={pageFormat}
                    fontSize={fontSize}
                    pagePadding={pagePadding}
                    lineHeight={lineHeight}
                    paragraphSpacing={paragraphSpacing}
                    themeColor={themeColor}
                  />
                </div>
              </div>
            }
            defaultSize={50}
            minSize={30}
            maxSize={70}
          />
        </div>
      </div>
    </>
  );
}
