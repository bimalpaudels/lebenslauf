"use client";

import SiteHeader from "@/components/SiteHeader";
import BackgroundOrbs from "@/components/BackgroundOrbs";
import { useState, useEffect } from "react";
import Link from "next/link";
// Templates are now chosen on a dedicated page
import { getAllCVs, deleteCV, type CVData } from "@/lib/storage";
import DashboardPreview from "@/components/DashboardPreview";

export default function Dashboard() {
  const [savedCVs, setSavedCVs] = useState<{ [key: string]: CVData }>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
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
    <div className="min-h-screen bg-background">
      <BackgroundOrbs />

      <SiteHeader />

      {/* Main Content */}
      <main className="relative z-10 px-6 pt-24 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header with CTA */}
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-slate-200/60 dark:border-slate-800/60">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Dashboard
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400 font-medium">
                Manage different versions of your CV.
              </p>
            </div>
            <Link
              href="/templates"
              className="group relative inline-flex items-center gap-2 rounded-2xl bg-slate-900 dark:bg-white px-6 py-3 text-sm font-bold text-white dark:text-slate-900 shadow-xl shadow-slate-900/10 dark:shadow-white/5 hover:shadow-[0_20px_50px_rgba(244,63,94,0.3)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Create New CV</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>

          {/* Saved CVs Grid */}
          <div className="mb-12">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
              </div>
            ) : Object.keys(savedCVs).length === 0 ? (
              <div className="text-slate-600 dark:text-slate-400 text-center py-24 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-[32px] border border-slate-200/50 dark:border-slate-800/50 border-dashed">
                <div className="w-20 h-20 bg-slate-200/50 dark:bg-slate-700/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-slate-400 dark:text-slate-500"
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
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No documents found</h3>
                <p className="max-w-xs mx-auto text-slate-500">
                  Ready to start? Pick a template and build your perfect CV today.
                </p>
                <Link
                  href="/templates"
                  className="mt-8 inline-block text-emerald-500 font-bold hover:underline"
                >
                  Browse Templates
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Object.entries(savedCVs).map(([cvId, cvData]) => (
                  <div
                    key={cvId}
                    className="group flex flex-col relative"
                  >
                    <div className="relative rounded-[24px] overflow-hidden border border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2">
                      <div
                        className={`relative overflow-hidden cursor-pointer w-full bg-slate-50 dark:bg-slate-800/50 ${
                          (cvData.style.pageSize as "A4" | "Letter") ===
                          "Letter"
                            ? "aspect-[816/1056]"
                            : "aspect-[794/1123]"
                        }`}
                        onClick={() =>
                          (window.location.href = `/builder/${cvId}`)
                        }
                      >
                        <DashboardPreview
                          key={`${cvId}-${cvData.updated_at}`}
                          markdown={cvData.content}
                          css={cvData.design}
                          templateId={cvData.templateId}
                          pageFormat={cvData.style.pageSize as "A4" | "Letter"}
                          fontSize={cvData.style.fontSize}
                          pagePadding={cvData.style.marginV}
                          lineHeight={cvData.style.lineHeight}
                          paragraphSpacing={cvData.style.paragraphSpace}
                          themeColor={cvData.style.theme}
                          className="h-full scale-[1.02] origin-top"
                          variant="saved"
                          contentOverlay={
                            <div className="absolute top-4 right-4 z-20">
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
                                className="w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all duration-300 backdrop-blur-lg border border-red-500/20"
                                title="Delete CV"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          }
                        />
                        
                        {/* Gradient Overlay for a more premium look */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      </div>
                    </div>
                    <div className="mt-4 px-2">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">
                        {cvData.content.split('\n')[0].replace('# ', '') || 'Untitled CV'}
                      </h4>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>Edited {formatDate(cvData.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
