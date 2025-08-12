"use client";
import React, { useEffect, useState } from "react";
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
};

export function TemplateHost({
  templateId,
  markdown,
  theme,
}: TemplateHostProps) {
  const [Component, setComponent] = useState<React.ComponentType<{
    markdown: string;
    theme: ThemeTokens;
  }> | null>(null);

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

  if (!Component) {
    return null;
  }

  return <Component markdown={markdown} theme={theme} />;
}
