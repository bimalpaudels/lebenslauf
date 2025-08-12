"use client";

import Link from "next/link";
import React from "react";
import { getTemplates } from "@/templates/registry";

const templates = getTemplates();

export default function TemplatesIndexPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Templates</h1>
        <p className="text-slate-300 mb-8">
          Click a template to open a live preview page for fast iteration while
          developing new templates.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t) => (
            <Link
              key={t.id}
              href={`/templates/${t.id}`}
              className="block rounded-lg border border-slate-700 bg-slate-800/50 p-4 hover:border-slate-500 transition"
            >
              <div className="font-semibold">{t.name}</div>
              <div className="text-slate-400 text-sm">{t.description}</div>
              <div className="mt-3 text-xs text-slate-400 underline">
                Open preview
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
