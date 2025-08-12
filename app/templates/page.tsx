"use client";

import React, { useEffect, useState } from "react";
import DashboardPreview from "@/components/DashboardPreview";
import {
  getTemplates,
  getSampleMarkdown,
  getTemplateById,
} from "@/templates/registry";
import type { CVData } from "@/lib/storage";

export default function TemplatesIndexPage() {
  const templates = getTemplates();
  const [samples, setSamples] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    (async () => {
      const entries = await Promise.all(
        templates.map(
          async (t) =>
            [t.id, (await getSampleMarkdown(t.id)) || "# Sample"] as const
        )
      );
      if (!active) return;
      setSamples(Object.fromEntries(entries));
    })();
    return () => {
      active = false;
    };
  }, [templates]);

  const handleUseTemplate = async (templateId: string) => {
    try {
      const meta = getTemplateById(templateId);
      if (!meta) return;
      const sample = (await getSampleMarkdown(templateId)) || `# New CV`;

      const cvId = Date.now().toString();
      const now = Date.now().toString();
      const cvData: CVData = {
        created_at: now,
        updated_at: now,
        design: "",
        content: sample,
        name: meta.name,
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
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <nav className="text-xs text-slate-500 dark:text-slate-400">
              <a href="/dashboard" className="hover:underline">
                Dashboard
              </a>
              <span className="mx-2">/</span>
              <span>Templates</span>
            </nav>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
              Choose a Template
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Pick a starting point. You can customize everything in the
              builder.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((t) => (
            <div key={t.id} className="flex flex-col">
              <div className="rounded-xl border border-slate-200/70 dark:border-slate-700/70 bg-white/80 dark:bg-slate-800/70 shadow-sm backdrop-blur-sm hover:shadow-md hover:-translate-y-0.5 transition">
                <div
                  className="group relative overflow-hidden cursor-pointer w-full aspect-[794/1123]"
                  onClick={() => (window.location.href = `/templates/${t.id}`)}
                  title={`${t.name}`}
                >
                  <DashboardPreview
                    markdown={samples[t.id] || "# Sample"}
                    className="h-full"
                    variant="template"
                    templateId={t.id}
                    contentOverlay={
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/templates/${t.id}`;
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
                </div>
                <div className="px-4 py-3 border-t border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-900 dark:text-white truncate pr-2">
                    {t.name}
                  </div>
                  <button
                    onClick={() => handleUseTemplate(t.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#3ECF8E] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 dark:focus:ring-offset-slate-900 transition"
                  >
                    Use
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
