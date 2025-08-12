"use client";

import Link from "next/link";
import React from "react";
import { getTemplates } from "@/templates/registry";

const templates = getTemplates();

export default function TemplatesIndexPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-extrabold mb-4 tracking-tight">
          Templates
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">
          Click a template to open a live preview page for fast iteration while
          developing new templates.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t) => (
            <Link
              key={t.id}
              href={`/templates/${t.id}`}
              className="block rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:border-slate-300 dark:hover:border-slate-600 transition shadow-sm hover:shadow-md"
            >
              <div className="font-semibold text-lg">{t.name}</div>
              <div className="text-slate-600 dark:text-slate-300 text-sm">
                {t.description}
              </div>
              <div className="mt-3 text-xs text-[#3ECF8E]">Open preview</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
