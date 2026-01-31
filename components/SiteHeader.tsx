"use client";

import Link from "next/link";
import React from "react";

interface SiteHeaderProps {
  variant?: "floating" | "fixed" | "static";
  children?: React.ReactNode;
}

export default function SiteHeader({ variant = "fixed", children }: SiteHeaderProps) {
  const isFloating = variant === "floating";
  const isStatic = variant === "static";

  const containerClasses = isFloating
    ? "fixed top-0 left-0 right-0 z-50 px-6 py-6 transition-all duration-300"
    : isStatic
    ? "relative z-50 px-6 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/20 flex-shrink-0"
    : "fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/20";

  const innerClasses = isFloating
    ? "max-w-7xl mx-auto flex items-center justify-between px-6 py-4 rounded-[24px] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-800/20 shadow-xl shadow-black/5"
    : "max-w-7xl mx-auto flex items-center justify-between";

  return (
    <nav className={containerClasses}>
      <div className={innerClasses}>
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-xs uppercase">cv</span>
          </div>
          <span className="text-slate-900 dark:text-white font-bold text-xl tracking-tight">
            lebenslauf
          </span>
        </Link>
        
        <div className="flex items-center space-x-8">
          {children ? (
            children
          ) : (
            <>
              <Link
                href="/templates"
                className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-rose-500 transition-colors"
              >
                Templates
              </Link>
              <a
                href="https://github.com/bimalpaudels/lebenslauf"
                className="text-slate-900 dark:text-white hover:scale-110 transition-transform"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
