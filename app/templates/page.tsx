"use client";

import React, { useEffect, useState } from "react";
import DashboardPreview from "@/components/DashboardPreview";
import {
  getTemplates,
  getSampleMarkdown,
  getTemplateById,
} from "@/templates/registry";
import type { CVData } from "@/lib/storage";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import BackgroundOrbs from "@/components/BackgroundOrbs";

export default function TemplatesIndexPage() {
  const templates = React.useMemo(() => getTemplates(), []);
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
          theme: "#f43f5e",
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
    <div className="min-h-screen bg-background">
      <BackgroundOrbs />

      <SiteHeader />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-12 relative z-10">
        <header className="mb-12">
          <nav className="text-xs text-slate-500 dark:text-slate-400 mb-6 flex items-center space-x-2">
            <Link href="/dashboard" className="hover:text-rose-500 transition-colors">Dashboard</Link>
            <span className="opacity-30">/</span>
            <span className="font-bold text-slate-900 dark:text-white">Templates</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                Choose a Template
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-3 text-lg font-medium max-w-xl leading-relaxed">
                Pick a starting point. You can customize every detail, from colors to fonts, in the builder later.
              </p>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                {templates.length} Pro Designs
              </span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {templates.map((t) => (
            <div key={t.id} className="group relative">
              <div className="relative aspect-[794/1123] rounded-[32px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-black/5 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-rose-500/10 group-hover:-translate-y-2">
                <DashboardPreview
                  markdown={samples[t.id] || "# Sample"}
                  className="h-full"
                  variant="template"
                  templateId={t.id}
                />
                
                {/* Overlay Links */}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-sm">
                  <div className="flex flex-col space-y-3 px-8 w-full">
                    <button
                      onClick={() => handleUseTemplate(t.id)}
                      className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-rose-500/20 hover:bg-rose-400 transition-all"
                    >
                      Use Template
                    </button>
                    <Link
                      href={`/templates/${t.id}`}
                      className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-sm backdrop-blur-md border border-white/20 transition-all text-center"
                    >
                      View Preview
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between px-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors">
                    {t.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                    Minimalist • Modern
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
