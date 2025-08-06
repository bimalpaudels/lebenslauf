"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { loadCV, updateCV, type CVData } from "@/lib/storage";
import RichTextEditor from "@/components/RichTextEditor";
import BuilderPreview, {
  BuilderPreviewRef,
} from "@/components/builder/BuilderPreview";
import { BuilderSidebar } from "@/components/builder/BuilderSidebar";
import SplitPane from "@/components/SplitPane";

interface BuilderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BuilderPage({ params }: BuilderPageProps) {
  const [pageFormat, setPageFormat] = useState<"A4" | "Letter">("A4");
  const [fontSize, setFontSize] = useState(12);
  const [cvId, setCvId] = useState<string>("");
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [templateMarkdown, setTemplateMarkdown] = useState<string>("");
  const [templateCss, setTemplateCss] = useState<string>("");
  const [pagePadding, setPagePadding] = useState(16);
  const [paragraphSpacing, setParagraphSpacing] = useState(1);
  const [lineHeight, setLineHeight] = useState(1.4);
  const [themeColor, setThemeColor] = useState("#3ECF8E");
  const [customColor, setCustomColor] = useState("");

  // Auto-save timer ref
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Ref to access the BuilderPreview export functionality
  const previewRef = useRef<BuilderPreviewRef>(null);

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

      // Set typing state immediately
      setIsTyping(true);

      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer
      autoSaveTimerRef.current = setTimeout(async () => {
        try {
          setIsSaving(true);
          setIsTyping(false);
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
      const updatedStyle = {
        ...cvData.style,
        fontSize: value,
      };
      updateCV(cvId, {
        style: updatedStyle,
      });
      // Update local cvData state to keep it in sync
      setCvData({
        ...cvData,
        style: updatedStyle,
      });
    }
  };

  // Handle page format change
  const handlePageFormatChange = (format: "A4" | "Letter") => {
    setPageFormat(format);
    if (cvId && cvData) {
      const updatedStyle = {
        ...cvData.style,
        pageSize: format,
      };
      updateCV(cvId, {
        style: updatedStyle,
      });
      // Update local cvData state to keep it in sync
      setCvData({
        ...cvData,
        style: updatedStyle,
      });
    }
  };

  // Handle page padding change
  const handlePagePaddingChange = (value: number) => {
    setPagePadding(value);
    if (cvId && cvData) {
      const updatedStyle = {
        ...cvData.style,
        marginV: value,
      };
      updateCV(cvId, {
        style: updatedStyle,
      });
      // Update local cvData state to keep it in sync
      setCvData({
        ...cvData,
        style: updatedStyle,
      });
    }
  };

  // Handle line height change
  const handleLineHeightChange = (value: number) => {
    setLineHeight(value);
    if (cvId && cvData) {
      const updatedStyle = {
        ...cvData.style,
        lineHeight: value,
      };
      updateCV(cvId, {
        style: updatedStyle,
      });
      // Update local cvData state to keep it in sync
      setCvData({
        ...cvData,
        style: updatedStyle,
      });
    }
  };

  // Handle paragraph spacing change
  const handleParagraphSpacingChange = (value: number) => {
    setParagraphSpacing(value);
    if (cvId && cvData) {
      const updatedStyle = {
        ...cvData.style,
        paragraphSpace: value,
      };
      updateCV(cvId, {
        style: updatedStyle,
      });
      // Update local cvData state to keep it in sync
      setCvData({
        ...cvData,
        style: updatedStyle,
      });
    }
  };

  // Handle theme color change
  const handleThemeColorChange = (color: string) => {
    setThemeColor(color);
    if (cvId && cvData) {
      const updatedStyle = {
        ...cvData.style,
        theme: color,
      };
      updateCV(cvId, {
        style: updatedStyle,
      });
      // Update local cvData state to keep it in sync
      setCvData({
        ...cvData,
        style: updatedStyle,
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
      <div className="h-screen bg-slate-900 flex overflow-hidden">
        <BuilderSidebar
          pageFormat={pageFormat}
          fontSize={fontSize}
          pagePadding={pagePadding}
          lineHeight={lineHeight}
          paragraphSpacing={paragraphSpacing}
          themeColor={themeColor}
          customColor={customColor}
          onPageFormatChange={handlePageFormatChange}
          onFontSizeChange={handleFontSizeChange}
          onPagePaddingChange={handlePagePaddingChange}
          onLineHeightChange={handleLineHeightChange}
          onParagraphSpacingChange={handleParagraphSpacingChange}
          onThemeColorChange={handleThemeColorChange}
          onCustomColorChange={handleCustomColorChange}
        />

        <div className="flex-1 flex overflow-hidden">
          <SplitPane
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
                          isSaving
                            ? "bg-amber-400"
                            : isTyping
                            ? "bg-gray-400"
                            : "bg-green-400"
                        }`}
                      ></div>
                      <span className="text-xs text-slate-400">
                        {isSaving
                          ? "Saving..."
                          : isTyping
                          ? "Saving..."
                          : "Auto-save"}
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
                    <button
                      onClick={() => previewRef.current?.exportToPDF()}
                      className="px-3 py-1 text-xs bg-[#3ECF8E] text-slate-900 rounded font-medium hover:bg-[#4BE4B4] transition-colors"
                    >
                      Export PDF
                    </button>
                  </div>
                </div>

                {/* Preview Container */}
                <div className="flex-1 overflow-hidden">
                  <BuilderPreview
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
