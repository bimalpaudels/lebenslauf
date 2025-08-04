"use client";

import React, { useMemo } from "react";
import { parseMarkdownToHtml } from "@/lib/template-loader";

interface SimplePreviewProps {
  markdown: string;
  templateCss: string;
  pageFormat: "A4" | "Letter";
  fontSize: number;
  pagePadding: number;
  lineHeight: number;
}

const SimplePreview: React.FC<SimplePreviewProps> = ({
  markdown,
  templateCss,
  pageFormat,
  fontSize,
  pagePadding,
  lineHeight,
}) => {
  const previewHtml = useMemo(() => {
    return parseMarkdownToHtml(markdown);
  }, [markdown]);

  const customStyles = useMemo(() => {
    return `
      .simple-preview-container {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding: 1rem;
        overflow-y: auto;
        height: 100%;
        scrollbar-width: thin;
        scrollbar-color: #3ECF8E #1e293b;
        display: flex;
        align-items: flex-start;
        justify-content: center;
      }
      
      .simple-preview-container::-webkit-scrollbar {
        width: 8px;
      }
      
      .simple-preview-container::-webkit-scrollbar-track {
        background: #1e293b;
      }
      
      .simple-preview-container::-webkit-scrollbar-thumb {
        background: #3ECF8E;
        border-radius: 4px;
      }
      
      .simple-preview-container::-webkit-scrollbar-thumb:hover {
        background: #4BE4B4;
      }
      
      .simple-preview-content {
        background: white;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        border-radius: 8px;
        margin: 0 auto;
        position: relative;
        overflow: visible;
        width: 100%;
        max-width: ${pageFormat === "A4" ? "210mm" : "8.5in"};
        min-height: ${pageFormat === "A4" ? "297mm" : "11in"};
        box-sizing: border-box;
        /* Remove transform scaling - let the page size stay constant */
        transform: none;
      }
      
      .simple-preview-content:hover {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
      }
      
      /* Apply template CSS directly to the content */
      .simple-preview-content {
        padding: ${pagePadding}px;
        font-size: ${fontSize}px;
        line-height: ${lineHeight};
      }
      
      /* Inject template CSS with proper specificity */
      ${templateCss.replace(
        /\.cv-container/g,
        ".simple-preview-content .cv-container"
      )}
      
      /* Ensure text is visible and properly styled */
      .simple-preview-content .cv-container {
        background: white;
        color: #1f2937;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
      
      /* Override any conflicting styles to ensure visibility */
      .simple-preview-content .cv-container * {
        color: inherit;
      }
      
      .simple-preview-content .cv-container h1 {
        color: #111827;
      }
      
      .simple-preview-content .cv-container h2 {
        color: #3b82f6;
      }
      
      .simple-preview-content .cv-container h3 {
        color: #111827;
      }
      
      .simple-preview-content .cv-container p {
        color: #4b5563;
      }
      
      .simple-preview-content .cv-container li {
        color: #4b5563;
      }
      
      .simple-preview-content .cv-container strong {
        color: #111827;
      }
      
      .simple-preview-content .cv-container em {
        color: #6b7280;
      }
      
      .simple-preview-content .cv-container a {
        color: #3b82f6;
      }
      
      /* Print styles */
      @page {
        size: ${pageFormat === "A4" ? "A4" : "letter"};
        margin: 0;
      }
      
      @media print {
        .simple-preview-container {
          background: white !important;
          padding: 0 !important;
        }
        
        .simple-preview-content {
          box-shadow: none !important;
          border-radius: 0 !important;
          margin: 0 !important;
          padding: ${pagePadding}px !important;
        }
      }
    `;
  }, [templateCss, pageFormat, fontSize, pagePadding, lineHeight]);

  return (
    <div className="simple-preview-wrapper h-full w-full relative overflow-hidden">
      {/* Inject custom styles */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* Load Iconify for icon support */}
      <script src="https://code.iconify.design/3/3.1.1/iconify.min.js" async />

      <div className="simple-preview-container">
        {/* Simple HTML Preview */}
        <div className="simple-preview-content">
          {previewHtml ? (
            <div
              dangerouslySetInnerHTML={{
                __html: previewHtml,
              }}
            />
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No content to preview</p>
              <p className="text-sm text-gray-400 mt-2">
                Start typing in the editor to see the preview
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimplePreview;
