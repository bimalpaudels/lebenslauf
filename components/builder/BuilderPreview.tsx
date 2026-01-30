"use client";

import React, { useMemo, forwardRef, useImperativeHandle } from "react";
import { parseMarkdownToHtml } from "@/lib/template-loader";
import { useBuilderScaling } from "../../hooks/useBuilderScaling";
import { usePageBreaking } from "../../hooks/usePageBreaking";
import { usePDFExport } from "../../hooks/usePDFExport";
import { BuilderPageContainer } from "./BuilderPageContainer";
import { BuilderPage } from "./BuilderPage";
import { BuilderEmptyState } from "./BuilderEmptyState";
import { TemplateHost, type ThemeTokens } from "./TemplateHost";
import type { ThemeConfig } from "@/lib/markdown-components";
import { generateTypographyStyles, scopeTemplateCss } from "@/lib/cv-styles";

interface BuilderPreviewProps {
  markdown: string;
  templateCss: string;
  pageFormat: "A4" | "Letter";
  fontSize: number;
  pagePadding: number;
  lineHeight: number;
  paragraphSpacing?: number;
  themeColor?: string;
}

export interface BuilderPreviewRef {
  exportToPDF: () => void;
}

const BuilderPreview = forwardRef<BuilderPreviewRef, BuilderPreviewProps>(
  function BuilderPreview(
    {
      markdown,
      templateCss,
      pageFormat,
      fontSize,
      pagePadding,
      lineHeight,
      paragraphSpacing = 1,
      themeColor = "#3ECF8E",
    },
    ref
  ) {
    const previewHtml = useMemo(
      () => parseMarkdownToHtml(markdown),
      [markdown]
    );

    // Theme config for both TemplateHost and BuilderPage components
    const theme: ThemeTokens & ThemeConfig = useMemo(
      () => ({
        color: themeColor,
        fontSize,
        lineHeight,
        pagePadding,
        paragraphSpacing,
      }),
      [themeColor, fontSize, lineHeight, pagePadding, paragraphSpacing]
    );

    const { scale, pageDimensions, containerRef } = useBuilderScaling({
      pageFormat,
    });

    const { pages, measureRef } = usePageBreaking({
      previewHtml,
      pageDimensions,
      pagePadding,
      fontSize,
      lineHeight,
      templateCss,
      paragraphSpacing,
    });

    const { exportToPDF } = usePDFExport();

    useImperativeHandle(ref, () => ({
      exportToPDF: () => {
        exportToPDF({
          pages,
          pageFormat,
          fontSize,
          pagePadding,
          lineHeight,
          paragraphSpacing,
          themeColor,
          templateCss,
        });
      },
    }));

    // Simplified styles - element styling is now handled by Tailwind components
    // Only keeping container styles and measuring container styles for page breaking
    const customStyles = useMemo(() => {
      // Generate typography styles for measuring container using shared utility
      const measuringTypography = generateTypographyStyles(theme, ".measuring-container");
      const scopedMeasuringCss = scopeTemplateCss(templateCss, ".measuring-container");

      return `
      .preview-container {
        height: 100%;
        background: rgb(248 250 252);
        overflow-x: hidden;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #3ECF8E rgb(203 213 225);
        padding: 20px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
      }
      
      @media (prefers-color-scheme: dark) {
        .preview-container {
          background: rgb(15 23 42);
          scrollbar-color: #3ECF8E rgb(51 65 85);
        }
      }
      
      .preview-container::-webkit-scrollbar {
        width: 8px;
      }
      
      .preview-container::-webkit-scrollbar-track {
        background: rgb(203 213 225);
      }
      
      .preview-container::-webkit-scrollbar-thumb {
        background: #3ECF8E;
        border-radius: 4px;
      }
      
      .preview-container::-webkit-scrollbar-thumb:hover {
        background: #4BE4B4;
      }
      
      @media (prefers-color-scheme: dark) {
        .preview-container::-webkit-scrollbar-track {
          background: rgb(51 65 85);
        }
      }
      
      /* Measuring container for page breaking - still uses HTML-based measurement */
      .measuring-container {
        position: absolute;
        top: -9999px;
        left: -9999px;
        width: ${pageDimensions.width - pagePadding * 2}px;
        padding: ${pagePadding}px !important;
        font-size: ${fontSize}px !important;
        line-height: ${lineHeight};
        visibility: hidden;
        overflow: visible;
        background: white;
        color: #1f2937;
      }
      
      /* Typography styles for measuring container (from shared utility) */
      ${measuringTypography}
      
      /* Template-specific CSS for measuring container */
      ${scopedMeasuringCss}
    `;
    }, [
      templateCss,
      fontSize,
      pagePadding,
      lineHeight,
      pageDimensions,
      theme,
    ]);

    const renderContent = () => {
      if (!previewHtml) {
        return (
          <BuilderEmptyState
            width={pageDimensions.width}
            height={pageDimensions.height}
            scale={scale}
          />
        );
      }

      return (
        <>
          {/* TSX template render for measurement (modern-onepage) */}
          <div style={{ position: "absolute", left: -99999, top: -99999 }}>
            <TemplateHost
              templateId="modern-onepage"
              markdown={markdown}
              theme={theme}
            />
          </div>
          {pages.map((pageContent, index) => (
            <BuilderPage
              key={index}
              pageContent={pageContent}
              index={index}
              width={pageDimensions.width}
              height={pageDimensions.height}
              scale={scale}
              theme={theme}
            />
          ))}
        </>
      );
    };

    return (
      <BuilderPageContainer
        containerRef={(node) => {
          if (containerRef && containerRef.current !== node) {
            (
              containerRef as React.MutableRefObject<HTMLDivElement | null>
            ).current = node;
          }
        }}
        customStyles={customStyles}
      >
        <div ref={measureRef} className="measuring-container" />
        {renderContent()}
      </BuilderPageContainer>
    );
  }
);

export default BuilderPreview;
