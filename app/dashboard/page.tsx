"use client";

import SiteHeader from "@/components/SiteHeader";
import { useState, useEffect } from "react";
import Link from "next/link";
// Templates are now chosen on a dedicated page
import { getAllCVs, deleteCV, type CVData } from "@/lib/storage";
import DashboardPreview from "@/components/DashboardPreview";

export default function Dashboard() {
  const [savedCVs, setSavedCVs] = useState<{ [key: string]: CVData }>({});
  const [loading, setLoading] = useState(true);
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
  }, []); // Remove templates dependency

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
      <main className="relative z-10 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          {/* Header with CTA */}
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Your CVs
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Continue editing an existing CV or start from a template.
              </p>
            </div>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-md bg-[#3ECF8E] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 dark:focus:ring-offset-slate-900 transition"
            >
              Choose Template
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Saved CVs Grid */}
          <div className="mb-12">
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
                <p className="text-sm">Choose a template to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Object.entries(savedCVs).map(([cvId, cvData]) => (
                  <div
                    key={cvId}
                    className="transition-all duration-200 flex flex-col relative"
                    title={`Last edited: ${formatDate(cvData.updated_at)}`}
                  >
                    <div className="rounded-xl border border-slate-200/70 dark:border-slate-700/70 bg-white/80 dark:bg-slate-800/70 shadow-sm backdrop-blur-sm hover:shadow-md hover:-translate-y-0.5 transition">
                      <div
                        className={`group relative overflow-hidden cursor-pointer w-full ${
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
                      </div>
                    </div>
                    <div className="mt-2 text-[11px] text-center text-slate-600 dark:text-slate-400">
                      Last edited: {formatDate(cvData.updated_at)}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
