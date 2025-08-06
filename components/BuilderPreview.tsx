"use client";

import React, {
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { parseMarkdownToHtml } from "@/lib/template-loader";
import { useBuilderScaling } from "../hooks/useBuilderScaling";
import { usePageBreaking } from "../hooks/usePageBreaking";
import { usePDFExport } from "../hooks/usePDFExport";
import { BuilderPageContainer } from "./BuilderPageContainer";
import { BuilderPage } from "./BuilderPage";
import { BuilderEmptyState } from "./BuilderEmptyState";

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
    const previewHtml = useMemo(() => parseMarkdownToHtml(markdown), [markdown]);
    
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

    const customStyles = useMemo(() => {
      return `
      .preview-container {
        height: 100%;
        background: #f8f9fa;
        overflow-x: hidden;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #3ECF8E #1e293b;
        padding: 20px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
      }
      
      .preview-container::-webkit-scrollbar {
        width: 8px;
      }
      
      .preview-container::-webkit-scrollbar-track {
        background: #1e293b;
      }
      
      .preview-container::-webkit-scrollbar-thumb {
        background: #3ECF8E;
        border-radius: 4px;
      }
      
      .preview-container::-webkit-scrollbar-thumb:hover {
        background: #4BE4B4;
      }
      
      .page-content {
        padding: ${pagePadding}px !important;
        font-size: ${fontSize}px !important;
        line-height: ${lineHeight};
      }
      
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
      }
      
      ${templateCss
        .split("\n")
        .map((line) => {
          if (line.includes(".cv-container")) {
            return line.replace(".cv-container", ".page-content");
          }
          return line.startsWith(".") ? `.page-content ${line}` : line;
        })
        .join("\n")}
      
      ${templateCss
        .split("\n")
        .map((line) => {
          if (line.includes(".cv-container")) {
            return line.replace(".cv-container", ".measuring-container");
          }
          return line.startsWith(".") ? `.measuring-container ${line}` : line;
        })
        .join("\n")}
      
      .page-content, .measuring-container {
        color: #1f2937;
      }
      
      .page-content h1, .measuring-container h1 {
        color: ${themeColor};
        margin-top: 0;
        margin-bottom: ${paragraphSpacing}rem;
        line-height: ${lineHeight};
        font-size: ${fontSize * 1.8}px !important;
      }
      
      .page-content h2, .measuring-container h2 {
        color: ${themeColor};
        margin-top: ${paragraphSpacing * 1.5}rem;
        margin-bottom: ${paragraphSpacing * 0.5}rem;
        line-height: ${lineHeight};
        font-size: ${fontSize * 1.4}px !important;
      }
      
      .page-content h3, .measuring-container h3 {
        color: #111827;
        margin-top: ${paragraphSpacing * 1.2}rem;
        margin-bottom: ${paragraphSpacing * 0.4}rem;
        line-height: ${lineHeight};
        font-size: ${fontSize * 1.2}px !important;
      }
      
      .page-content p, .measuring-container p {
        color: #4b5563;
        margin-bottom: ${paragraphSpacing * 0.8}rem;
        line-height: ${lineHeight};
        font-size: ${fontSize}px !important;
      }
      
      .page-content li, .measuring-container li {
        color: #4b5563;
        margin-bottom: ${paragraphSpacing * 0.3}rem;
        line-height: ${lineHeight};
        font-size: ${fontSize}px !important;
      }
      
      .page-content ul, .measuring-container ul,
      .page-content ol, .measuring-container ol {
        margin-bottom: ${paragraphSpacing}rem;
        line-height: ${lineHeight};
        font-size: ${fontSize}px !important;
      }
      
      .page-content dl, .measuring-container dl {
        margin-bottom: ${paragraphSpacing}rem;
        line-height: ${lineHeight};
        font-size: ${fontSize}px !important;
      }
      
      .page-content dt, .measuring-container dt {
        font-weight: 600;
        color: #111827;
        line-height: ${lineHeight};
        font-size: ${fontSize}px !important;
      }
      
      .page-content dd, .measuring-container dd {
        margin-left: 0;
        margin-bottom: ${paragraphSpacing * 0.5}rem;
        color: #6b7280;
        line-height: ${lineHeight};
        font-size: ${fontSize}px !important;
      }
      
      .page-content strong, .measuring-container strong {
        color: #111827;
        line-height: ${lineHeight};
        font-size: ${fontSize}px !important;
      }
      
      .page-content em, .measuring-container em {
        color: #6b7280;
        line-height: ${lineHeight};
        font-size: ${fontSize}px !important;
      }
      
      .page-content a, .measuring-container a {
        color: ${themeColor};
        text-decoration: underline;
        line-height: ${lineHeight};
        font-size: ${fontSize}px !important;
      }
    `;
    }, [
      templateCss,
      fontSize,
      pagePadding,
      lineHeight,
      pageDimensions,
      paragraphSpacing,
      themeColor,
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
          {pages.map((pageContent, index) => (
            <BuilderPage
              key={index}
              pageContent={pageContent}
              index={index}
              width={pageDimensions.width}
              height={pageDimensions.height}
              scale={scale}
            />
          ))}
        </>
      );
    };

    return (
      <BuilderPageContainer
        containerRef={(node) => {
          if (containerRef && containerRef.current !== node) {
            (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
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