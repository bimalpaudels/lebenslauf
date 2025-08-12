"use client";
import dynamic from "next/dynamic";
import React from "react";

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
  const Template = dynamic(() => import(`@/templates/${templateId}/Template`), {
    ssr: false,
  });
  // TS can't infer MDX component props; cast to React.ComponentType
  const Cmp = Template as unknown as React.ComponentType<{
    markdown: string;
    theme: ThemeTokens;
  }>;
  return <Cmp markdown={markdown} theme={theme} />;
}
