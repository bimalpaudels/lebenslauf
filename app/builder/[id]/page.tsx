"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { loadCV, updateCV, saveCV, type CVData } from "@/lib/storage";
import NotionEditor from "@/components/builder/NotionEditor";
import BuilderPreview, {
  BuilderPreviewRef,
} from "@/components/builder/BuilderPreview";
import { PreviewToolbar } from "@/components/builder/PreviewToolbar";
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
        let savedCV = await loadCV(id);
        // If coming from dashboard fast-create, persist staged CV then continue
        if (!savedCV) {
          try {
            const staged = sessionStorage.getItem(`pending_cv_${id}`);
            if (staged) {
              const data = JSON.parse(staged) as CVData;
              await saveCV(id, data);
              sessionStorage.removeItem(`pending_cv_${id}`);
              savedCV = data;
            }
          } catch {}
        }
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

  // Handle export PDF
  const handleExportPDF = () => {
    previewRef.current?.exportToPDF();
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
      <div className="h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-900 dark:text-white">Loading...</div>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-900 dark:text-white">CV not found</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden selection:bg-emerald-500/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Modern Top Bar */}
      <header className="px-6 py-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xs uppercase">cv</span>
            </div>
            <span className="text-slate-900 dark:text-white font-bold text-xl tracking-tight">lebenslauf</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
            {isSaving ? "Saving..." : isTyping ? "Unsaved Changes" : "Progress Saved"}
          </div>
        </div>
      </header>

      {/* Main Content - Split Panes */}
      <div className="flex-1 overflow-hidden">
        <SplitPane
          leftPanel={
            <div className="h-full flex flex-col bg-transparent print-hide relative">
              {/* Notion-style Editor */}
              <div className="flex-1 overflow-hidden">
                <NotionEditor
                  value={templateMarkdown}
                  onChange={handleMarkdownChange}
                  placeholder="Start writing your CV..."
                />
              </div>
            </div>
          }
          rightPanel={
            <div className="h-full flex flex-col bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm">
              {/* Floating Preview Toolbar - centered pill above preview */}
              <div className="flex-shrink-0 pt-6 pb-4 flex justify-center">
                <PreviewToolbar
                  pageFormat={pageFormat}
                  fontSize={fontSize}
                  pagePadding={pagePadding}
                  lineHeight={lineHeight}
                  paragraphSpacing={paragraphSpacing}
                  themeColor={themeColor}
                  onPageFormatChange={handlePageFormatChange}
                  onFontSizeChange={handleFontSizeChange}
                  onPagePaddingChange={handlePagePaddingChange}
                  onLineHeightChange={handleLineHeightChange}
                  onParagraphSpacingChange={handleParagraphSpacingChange}
                  onThemeColorChange={handleThemeColorChange}
                  onExportPDF={handleExportPDF}
                />
              </div>

              {/* Preview Container */}
              <div className="flex-1 overflow-hidden px-4 pb-4">
                <div className="h-full rounded-[24px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900">
                  <BuilderPreview
                    ref={previewRef}
                    markdown={templateMarkdown}
                    templateCss={templateCss}
                    templateId={cvData?.templateId}
                    pageFormat={pageFormat}
                    fontSize={fontSize}
                    pagePadding={pagePadding}
                    lineHeight={lineHeight}
                    paragraphSpacing={paragraphSpacing}
                    themeColor={themeColor}
                  />
                </div>
              </div>
            </div>
          }
          defaultSize={67}
          minSize={30}
          maxSize={80}
        />
      </div>
    </div>
  );
}
