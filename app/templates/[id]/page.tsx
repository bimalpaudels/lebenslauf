"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import DashboardPreview from "@/components/DashboardPreview";
import SiteHeader from "@/components/SiteHeader";
import BackgroundOrbs from "@/components/BackgroundOrbs";
import { getTemplateById, getSampleMarkdown } from "@/templates/registry";
import type { CVData } from "@/lib/storage";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function TemplatePreviewPage({ params }: PageProps) {
  const { id: templateId } = use(params);
  const templateMeta = getTemplateById(templateId);

  const [markdown, setMarkdown] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    (async () => {
      try {
        const sample = await getSampleMarkdown(templateId);
        if (!isActive) return;
        setMarkdown(sample || "# Sample");
        setError(null);
      } catch {
        if (!isActive) return;
        setError(`Template "${templateId}" not found.`);
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

      <SiteHeader variant="floating" />

      <main className="relative z-10 px-6 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10">
            <nav className="mb-6 text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-2">
              <Link href="/dashboard" className="hover:text-rose-500 transition-colors">Dashboard</Link>
              <span className="opacity-30">/</span>
              <Link href="/templates" className="hover:text-rose-500 transition-colors">Templates</Link>
              <span className="opacity-30">/</span>
              <span className="font-bold text-slate-900 dark:text-white">{templateMeta?.name || templateId}</span>
            </nav>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Left: Meta-Information */}
            <div className="lg:col-span-2 order-2 lg:order-1 sticky top-32">
              <div className="p-10 rounded-[40px] bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl shadow-2xl shadow-black/5">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span className="text-rose-600 dark:text-rose-400 text-[10px] font-bold tracking-widest uppercase">Verified Template</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                  {templateMeta?.name || templateId}
                </h1>
                <p className="mt-6 text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed">
                  {templateMeta?.description || "A professional, minimalist template designed for modern careers."}
                </p>

                <div className="mt-10 space-y-4 border-t border-slate-200/50 dark:border-slate-800/50 pt-10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px]">Author</span>
                    <span className="font-black text-slate-900 dark:text-white">BuildCV Team</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px]">Standard Format</span>
                    <span className="font-black text-slate-900 dark:text-white">A4 / Letter</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px]">Current Theme</span>
                    <div className="flex items-center space-x-2">
                       <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></div>
                       <span className="font-black text-slate-900 dark:text-white">Rose Bloom</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUseTemplate}
                  className="mt-12 w-full py-5 bg-rose-500 text-white rounded-[24px] font-black text-xl shadow-2xl shadow-rose-500/20 hover:bg-rose-400 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-3 group"
                >
                  <span>Start with this Template</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </button>
                
                {error && (
                  <div className="mt-6 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 text-xs font-bold text-center italic">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Floating Preview */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="relative rounded-[48px] overflow-hidden bg-slate-50/50 dark:bg-slate-950/20 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 p-12 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-orange-500/5 pointer-events-none"></div>
                <div className="relative aspect-[794/1123] w-full rounded-[24px] overflow-hidden bg-white dark:bg-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] ring-1 ring-black/5">
                  <DashboardPreview
                    markdown={markdown}
                    templateId={templateId}
                    pageFormat="A4"
                    fontSize={12}
                    pagePadding={20}
                    lineHeight={1.4}
                    paragraphSpacing={1}
                    themeColor="#f43f5e"
                    className="h-full"
                    variant="template"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
