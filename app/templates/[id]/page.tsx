"use client";

import React, { useEffect, useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import {
  TemplateHost,
  type ThemeTokens,
} from "@/components/builder/TemplateHost";

type PageProps = {
  params: { id: string };
};

export default function TemplatePreviewPage({ params }: PageProps) {
  const templateId = params.id;

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
        const { getSampleMarkdown } = await import("@/templates/registry");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-slate-100">
      <SiteHeader />
      <main className="relative z-10 px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{templateId}</h1>
          </div>

          {error && (
            <div className="mb-4 rounded border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200 dark:text-red-200">
              {error}
            </div>
          )}

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
      </main>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#3ECF8E]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#3ECF8E]/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
