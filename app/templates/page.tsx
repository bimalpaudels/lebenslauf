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
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
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
              <div className="mt-3 text-xs font-medium text-center bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                {t.name}
              </div>
              <div className="mt-3">
                <button
                  onClick={() => handleUseTemplate(t.id)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#3ECF8E] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 dark:focus:ring-offset-slate-900 transition"
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
