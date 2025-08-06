"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { fileBasedTemplates } from "@/lib/template-loader";
import { getAllCVs, createNewCV, deleteCV, type CVData } from "@/lib/storage";
import CVPreview from "@/components/CVPreview";
import SavedCVPreview from "@/components/SavedCVPreview";

export default function Dashboard() {
  const [savedCVs, setSavedCVs] = useState<{ [key: string]: CVData }>({});
  const [loading, setLoading] = useState(true);
  const [templatePreviews, setTemplatePreviews] = useState<{
    [key: string]: { markdown: string; css: string };
  }>({});

  useEffect(() => {
    // Load saved CVs from localForage
    const loadSavedCVs = async () => {
      try {
        const cvs = await getAllCVs();
        setSavedCVs(cvs);
      } catch (error) {
        console.error("Error loading CVs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedCVs();
  }, []);

  // Load template previews
  useEffect(() => {
    const loadTemplatePreviews = async () => {
      const previews: { [key: string]: { markdown: string; css: string } } = {};

      for (const template of fileBasedTemplates) {
        try {
          const [markdownResponse, cssResponse] = await Promise.all([
            fetch(template.markdownPath),
            fetch(template.cssPath),
          ]);

          if (markdownResponse.ok && cssResponse.ok) {
            const [markdown, css] = await Promise.all([
              markdownResponse.text(),
              cssResponse.text(),
            ]);

            previews[template.id] = { markdown, css };
          }
        } catch (error) {
          console.error(`Error loading template ${template.id}:`, error);
        }
      }

      setTemplatePreviews(previews);
    };

    loadTemplatePreviews();
  }, []);

  const handleCreateNewCV = async (templateId: string) => {
    try {
      // Load template content
      const template = fileBasedTemplates.find((t) => t.id === templateId);
      if (!template) return;

      const response = await fetch(template.markdownPath);
      const markdown = await response.text();

      const cssResponse = await fetch(template.cssPath);
      const css = await cssResponse.text();

      // Create new CV in storage
      const cvId = await createNewCV(templateId, markdown, css, template.name);

      // Navigate to builder
      window.location.href = `/builder/${cvId}`;
    } catch (error) {
      console.error("Error creating new CV:", error);
    }
  };

  const handleDeleteCV = async (cvId: string) => {
    try {
      await deleteCV(cvId);
      setSavedCVs((prev) => {
        const newCVs = { ...prev };
        delete newCVs[cvId];
        return newCVs;
      });
    } catch (error) {
      console.error("Error deleting CV:", error);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp));
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#3ECF8E] rounded-lg flex items-center justify-center">
              <span className="text-slate-900 font-bold text-lg">CV</span>
            </div>
            <span className="text-white font-semibold text-xl">lebenslauf</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="https://github.com/bimalpaudels/lebenslauf"
              className="text-slate-300 hover:text-[#3ECF8E] transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Saved CVs Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Your CVs</h2>
            {loading ? (
              <div className="text-slate-400">Loading...</div>
            ) : Object.keys(savedCVs).length === 0 ? (
              <div className="text-slate-400 text-center py-12">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-medium">No CVs yet</p>
                <p className="text-sm">
                  Create your first CV by selecting a template below
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Object.entries(savedCVs).map(([cvId, cvData]) => (
                  <div
                    key={cvId}
                    className="group rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 aspect-[3/4] min-h-[300px] flex flex-col relative cursor-pointer bg-transparent"
                    title={`Edit ${cvData.name} - Last edited: ${formatDate(
                      cvData.updated_at
                    )}`}
                    onClick={() => (window.location.href = `/builder/${cvId}`)}
                  >
                    <div className="flex-1 relative overflow-hidden">
                      <SavedCVPreview
                        key={`${cvId}-${cvData.updated_at}`}
                        markdown={cvData.content}
                        css={cvData.design}
                        pageFormat={cvData.style.pageSize as "A4" | "Letter"}
                        fontSize={cvData.style.fontSize}
                        pagePadding={cvData.style.marginV}
                        lineHeight={cvData.style.lineHeight}
                        paragraphSpacing={cvData.style.paragraphSpace}
                        themeColor={cvData.style.theme}
                        className="h-full"
                      />

                      {/* Overlay with CV info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-semibold text-sm drop-shadow-lg">
                              {cvData.name}
                            </h4>
                            <p className="text-white/90 text-xs drop-shadow-lg font-medium">
                              Last edited: {formatDate(cvData.updated_at)}
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `/builder/${cvId}`;
                              }}
                              className="w-6 h-6 bg-white/30 backdrop-blur-sm rounded flex items-center justify-center hover:bg-white/40 transition-colors"
                              title="Edit CV"
                            >
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (
                                  confirm(
                                    `Are you sure you want to delete "${cvData.name}"? This action cannot be undone.`
                                  )
                                ) {
                                  handleDeleteCV(cvId);
                                }
                              }}
                              className="w-6 h-6 bg-white/30 backdrop-blur-sm rounded flex items-center justify-center hover:bg-white/40 transition-colors"
                              title="Delete CV"
                            >
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Templates Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Choose a Template
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {fileBasedTemplates.map((template) => {
                const preview = templatePreviews[template.id];
                return (
                  <div
                    key={template.id}
                    className="group rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 aspect-[3/4] min-h-[300px] flex flex-col relative bg-transparent"
                    title={`Use ${template.name} template - ${template.description}`}
                  >
                    <div className="flex-1 relative overflow-hidden">
                      {preview ? (
                        <CVPreview
                          markdown={preview.markdown}
                          css={preview.css}
                          className="h-full"
                          standalone={true}
                        />
                      ) : (
                        <div className="h-full bg-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#3ECF8E]/10 to-blue-500/10"></div>
                          <div className="relative text-center p-4">
                            <div className="w-12 h-12 bg-[#3ECF8E]/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                              <svg
                                className="w-6 h-6 text-[#3ECF8E]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                            <div className="text-xs text-slate-500">
                              Loading Preview...
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Overlay with template info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-semibold text-sm drop-shadow-lg">
                              {template.name}
                            </h4>
                            <p className="text-white/90 text-xs drop-shadow-lg font-medium">
                              {template.description}
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleCreateNewCV(template.id)}
                              className="w-6 h-6 bg-white/30 backdrop-blur-sm rounded flex items-center justify-center hover:bg-white/40 transition-colors"
                              title="Use Template"
                            >
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3ECF8E]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#3ECF8E]/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
