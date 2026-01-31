"use client";
import React, { useEffect, useState, useRef } from "react";
import { loadTemplateModule } from "@/templates/registry";

export type ThemeTokens = {
  color: string;
  fontSize: number;
  lineHeight: number;
  pagePadding: number;
  paragraphSpacing: number;
};

type TemplateHostProps = {
  templateId: string;
  markdown: string;
  theme: ThemeTokens;
  /** Called after template has rendered and DOM is ready for reading */
  onRendered?: () => void;
};

export function TemplateHost({
  templateId,
  markdown,
  theme,
  onRendered,
}: TemplateHostProps) {
  const [Component, setComponent] = useState<React.ComponentType<{
    markdown: string;
    theme: ThemeTokens;
  }> | null>(null);
  const hasRenderedRef = useRef(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const mod = await loadTemplateModule(templateId);
      if (!active) return;
      if (mod && mod.default) {
        setComponent(
          () =>
            mod.default as React.ComponentType<{
              markdown: string;
              theme: ThemeTokens;
            }>
        );
      } else {
        setComponent(() => null);
      }
    })();
    return () => {
      active = false;
    };
  }, [templateId]);

  // Call onRendered after the template component has rendered
  useEffect(() => {
    if (Component && onRendered) {
      // Use requestAnimationFrame to ensure DOM has been committed
      const rafId = requestAnimationFrame(() => {
        onRendered();
        hasRenderedRef.current = true;
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, [Component, markdown, theme, onRendered]);

  if (!Component) {
    return null;
  }

  return <Component markdown={markdown} theme={theme} />;
}
