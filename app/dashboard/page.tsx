"use client";

import SiteHeader from "@/components/SiteHeader";
import { useState, useEffect } from "react";
import { getTemplates, getSampleMarkdown } from "@/templates/registry";
import { getAllCVs, deleteCV, type CVData } from "@/lib/storage";
import DashboardPreview from "@/components/DashboardPreview";

export default function Dashboard() {
  const [savedCVs, setSavedCVs] = useState<{ [key: string]: CVData }>({});
  const [loading, setLoading] = useState(true);
  const [templateSamples, setTemplateSamples] = useState<
    Record<string, string>
  >({});
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

    // Load sample markdown for template previews from registry
    const loadTemplateSamples = async () => {
      try {
        const templates = getTemplates(); // Get templates inside useEffect
        const entries = await Promise.all(
          templates.map(
            async (t) =>
              [t.id, (await getSampleMarkdown(t.id)) || "# Sample"] as const
          )
        );
        setTemplateSamples(Object.fromEntries(entries));
      } catch (error) {
        console.error("Error loading template samples:", error);
      }
    };

    loadSavedCVs();
    loadTemplateSamples();
  }, []); // Remove templates dependency

  // Templates registry (single source of truth) - moved after useEffect
  const templates = getTemplates();

  // Load template previews
  // Previews are seeded from registry; no async fetch needed

  const handleCreateNewCV = async (templateId: string) => {
    try {
      // Load template content
      const template = templates.find((t) => t.id === templateId);
      if (!template) return;

      // Seed with sample markdown from registry when available
      const sample = (await getSampleMarkdown(templateId)) || `# New CV`;

      // Create new CV id and stage data in sessionStorage for builder to finalize
      const cvId = Date.now().toString();
      const now = Date.now().toString();
      const cvData: CVData = {
        created_at: now,
        design: "",
        content: sample,
        name: template.name,
        templateId,
        style: {
          fontSize: 12,
          lineHeight: 1.4,
          marginV: 20,
          pageSize: "A4",
          paragraphSpace: 1,
          theme: "#3ECF8E",
        },
        updated_at: now,
      };

      // Stage pending CV for the builder page to persist; avoids flashing in list before navigation
      try {
        sessionStorage.setItem(`pending_cv_${cvId}`, JSON.stringify(cvData));
      } catch {}
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Navigation */}
      <SiteHeader />

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Saved CVs Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Your CVs
            </h2>
            {loading ? (
              <div className="text-slate-600 dark:text-slate-400">
                Loading...
              </div>
            ) : Object.keys(savedCVs).length === 0 ? (
              <div className="text-slate-600 dark:text-slate-400 text-center py-12">
                <div className="w-16 h-16 bg-slate-200/50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-slate-400 dark:text-slate-500"
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
                    className="group transition-all duration-200 aspect-[3/4] min-h-[300px] flex flex-col relative cursor-pointer bg-transparent"
                    title={`Last edited: ${formatDate(cvData.updated_at)}`}
                    onClick={() => (window.location.href = `/builder/${cvId}`)}
                  >
                    <div className="flex-1 relative overflow-hidden">
                      <DashboardPreview
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
                        variant="saved"
                        contentOverlay={
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                confirm(
                                  `Are you sure you want to delete this CV? This action cannot be undone.`
                                )
                              ) {
                                handleDeleteCV(cvId);
                              }
                            }}
                            className="w-7 h-7 rounded bg-black/50 text-white hidden group-hover:flex items-center justify-center"
                            title="Delete CV"
                          >
                            <svg
                              className="w-3.5 h-3.5"
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
                        }
                      />

                      {/* no outside icon; action handled inside the page via contentOverlay */}
                    </div>
                    <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                      Last edited: {formatDate(cvData.updated_at)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Templates Section */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Choose a Template
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...templates].map((template) => {
                return (
                  <div
                    key={template.id}
                    className="group transition-all duration-200 aspect-[3/4] min-h-[300px] flex flex-col relative bg-transparent"
                    title={`${template.name}`}
                  >
                    <div
                      className="flex-1 relative overflow-hidden cursor-pointer"
                      onClick={() => handleCreateNewCV(template.id)}
                    >
                      <DashboardPreview
                        markdown={templateSamples[template.id] || "# Sample"}
                        className="h-full"
                        variant="template"
                        templateId={template.id}
                        contentOverlay={
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // no-op for now
                            }}
                            className="w-7 h-7 rounded bg-black/50 text-white flex items-center justify-center"
                            title="View Template"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="w-4 h-4"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                        }
                      />
                      {/* no outside icon; action handled inside the page via contentOverlay */}
                    </div>
                    <div className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                      {template.name}
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
