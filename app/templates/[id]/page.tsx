"use client";

import React, { useEffect, useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import {
  TemplateHost,
  type ThemeTokens,
} from "@/components/builder/TemplateHost";
import { getTemplateById, getSampleMarkdown } from "@/templates/registry";
import type { CVData } from "@/lib/storage";

type PageProps = {
  params: { id: string };
};

export default function TemplatePreviewPage({ params }: PageProps) {
  const templateId = params.id;
  const templateMeta = getTemplateById(templateId);

  const [markdown, setMarkdown] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const theme: ThemeTokens = useMemo(
    () => ({
      color: "#3ECF8E",
      fontSize: 12,
      lineHeight: 1.4,
      pagePadding: 20,
      paragraphSpacing: 1,
    }),
    []
  );

  useEffect(() => {
    let isActive = true;
    (async () => {
      try {
        const sample = await getSampleMarkdown(templateId);
        if (!isActive) return;
        setMarkdown(sample || "# Sample");
        setError(null);
      } catch (e) {
        if (!isActive) return;
        setError(`Template \"${templateId}\" not found.`);
        setMarkdown(
          "# Template not found\n\nEnsure it exists under templates/" +
            templateId
        );
      }
    })();

    return () => {
      isActive = false;
    };
  }, [templateId]);

  const handleUseTemplate = async () => {
    try {
      const sample = (await getSampleMarkdown(templateId)) || `# New CV`;
      const cvId = Date.now().toString();
      const now = Date.now().toString();
      const cvData: CVData = {
        created_at: now,
        updated_at: now,
        design: "",
        content: sample,
        name: templateMeta?.name || templateId,
        templateId,
        style: {
          fontSize: 12,
          lineHeight: 1.4,
          marginV: 20,
          pageSize: "A4",
          paragraphSpace: 1,
          theme: "#3ECF8E",
        },
      };
      try {
        sessionStorage.setItem(`pending_cv_${cvId}`, JSON.stringify(cvData));
      } catch {}
      window.location.href = `/builder/${cvId}`;
    } catch (e) {
      console.error("Failed to use template", e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-slate-100">
      <SiteHeader />
      <main className="relative z-10 px-6 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left: meta */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <h1 className="text-3xl font-extrabold tracking-tight">
              {templateMeta?.name || templateId}
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              {templateMeta?.description || "Preview of the template."}
            </p>

            <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
              <div className="text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between py-2">
                  <span>Creator</span>
                  <span className="font-medium">BuildCV Team</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Format</span>
                  <span className="font-medium">A4</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Theme Color</span>
                  <span className="font-medium">#3ECF8E</span>
                </div>
              </div>
              <button
                onClick={handleUseTemplate}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#3ECF8E] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 dark:focus:ring-offset-slate-900 transition"
              >
                Use Template
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200 dark:text-red-200">
                {error}
              </div>
            )}
          </div>

          {/* Right: preview */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <article className="rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="p-6">
                <TemplateHost
                  templateId={templateId}
                  markdown={markdown}
                  theme={theme}
                />
              </div>
            </article>
          </div>
        </div>
      </main>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3ECF8E]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#3ECF8E]/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
