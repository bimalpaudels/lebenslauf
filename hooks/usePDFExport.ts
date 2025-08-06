import { useCallback } from "react";

interface PDFExportProps {
  pages: string[];
  pageFormat: "A4" | "Letter";
  fontSize: number;
  pagePadding: number;
  lineHeight: number;
  paragraphSpacing: number;
  themeColor: string;
  templateCss: string;
}

export const usePDFExport = () => {
  const exportToPDF = useCallback(({
    pages,
    pageFormat,
    fontSize,
    pagePadding,
    lineHeight,
    paragraphSpacing,
    themeColor,
    templateCss,
  }: PDFExportProps) => {
    // Guard against no content
    if (!pages || pages.length === 0) {
      console.error("Export failed: No pages to print.");
      return;
    }

    console.log(
      `Starting PDF export for ${pages.length} pages using cloning strategy.`
    );

    // Create a dedicated, hidden container for printing (completely isolated)
    const printRoot = document.createElement("div");
    printRoot.id = "print-root";
    printRoot.style.cssText = `
      position: absolute;
      top: -99999px;
      left: -99999px;
      width: 100vw;
      height: 100vh;
      visibility: hidden;
      pointer-events: none;
      z-index: -1;
    `;
    document.body.appendChild(printRoot);

    // Populate the print container with clean page elements
    printRoot.innerHTML = pages
      .map((pageContent) => `<div class="print-page">${pageContent}</div>`)
      .join("");

    console.log("Created and appended #print-root with clean page data.");

    // Create print-specific stylesheet that only affects print media
    const printStyleId = "builder-print-styles";
    const existingPrintStyle = document.getElementById(printStyleId);
    if (existingPrintStyle) {
      existingPrintStyle.remove();
    }

    const printStyle = document.createElement("style");
    printStyle.id = printStyleId;
    printStyle.textContent = `
      /* CRITICAL: Only apply styles during actual printing */
      @media print {
          @page {
              size: ${pageFormat === "A4" ? "A4" : "letter"};
              margin: 0;
              padding: 0;
          }

          * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
          }

          html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              height: 100% !important;
              background: white !important;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          }

          /* Hide the entire live application during print */
          body > *:not(#print-root) {
              display: none !important;
              visibility: hidden !important;
          }

          /* Show ONLY our cloned print container */
          #print-root {
              display: block !important;
              visibility: visible !important;
              position: static !important;
              top: auto !important;
              left: auto !important;
              width: 100% !important;
              height: auto !important;
              z-index: auto !important;
              pointer-events: auto !important;
          }

          /* Define the layout for each page */
          .print-page {
              width: 100% !important;
              height: 100vh !important;
              margin: 0 !important;
              overflow: hidden !important;
              page-break-after: always !important;
              break-after: page !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              display: block !important;
              box-sizing: border-box !important;

              /* Apply user-controlled styles directly to match preview */
              padding: ${pagePadding}px !important;
              font-size: ${fontSize}px !important;
              line-height: ${lineHeight} !important;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
              color: #1f2937 !important;
              background: white !important;
          }
          
          /* Don't add a page break after the final page */
          .print-page:last-child {
              page-break-after: auto !important;
              break-after: auto !important;
          }

          /* Apply base typography to match preview exactly */
          .print-page h1 { 
              color: ${themeColor} !important; 
              font-size: ${fontSize * 1.8}px !important; 
              margin-top: 0 !important; 
              margin-bottom: ${paragraphSpacing}rem !important;
              line-height: ${lineHeight} !important;
              font-weight: bold !important;
          }
          .print-page h2 { 
              color: ${themeColor} !important; 
              font-size: ${fontSize * 1.4}px !important; 
              margin-top: ${paragraphSpacing * 1.5}rem !important; 
              margin-bottom: ${paragraphSpacing * 0.5}rem !important;
              line-height: ${lineHeight} !important;
              font-weight: bold !important;
          }
          .print-page h3 { 
              color: #111827 !important; 
              font-size: ${fontSize * 1.2}px !important; 
              margin-top: ${paragraphSpacing * 1.2}rem !important; 
              margin-bottom: ${paragraphSpacing * 0.4}rem !important;
              line-height: ${lineHeight} !important;
              font-weight: bold !important;
          }
          .print-page p { 
              color: #4b5563 !important; 
              margin-bottom: ${paragraphSpacing * 0.8}rem !important;
              line-height: ${lineHeight} !important;
              font-size: ${fontSize}px !important;
          }
          .print-page li { 
              color: #4b5563 !important; 
              margin-bottom: ${paragraphSpacing * 0.3}rem !important;
              line-height: ${lineHeight} !important;
              font-size: ${fontSize}px !important;
          }
          .print-page ul, .print-page ol { 
              margin-bottom: ${paragraphSpacing}rem !important; 
              padding-left: 1.5rem !important;
              line-height: ${lineHeight} !important;
              font-size: ${fontSize}px !important;
          }
          .print-page a { 
              color: ${themeColor} !important; 
              text-decoration: underline !important;
              line-height: ${lineHeight} !important;
              font-size: ${fontSize}px !important;
          }
          .print-page strong { 
              color: #111827 !important;
              font-weight: 600 !important;
              line-height: ${lineHeight} !important;
              font-size: ${fontSize}px !important;
          }
          .print-page em {
              color: #6b7280 !important;
              font-style: italic !important;
              line-height: ${lineHeight} !important;
              font-size: ${fontSize}px !important;
          }
          .print-page dt {
              font-weight: 600 !important;
              color: #111827 !important;
              line-height: ${lineHeight} !important;
              font-size: ${fontSize}px !important;
          }
          .print-page dd {
              margin-left: 0 !important;
              margin-bottom: ${paragraphSpacing * 0.5}rem !important;
              color: #6b7280 !important;
              line-height: ${lineHeight} !important;
              font-size: ${fontSize}px !important;
          }

          /* Apply template-specific CSS with .print-page prefix */
          ${templateCss
            .split("\n")
            .map((line) => {
              if (line.includes(".cv-container")) {
                return line.replace(".cv-container", ".print-page");
              }
              if (
                line.trim().startsWith(".") &&
                !line.includes(".print-page")
              ) {
                return `.print-page ${line}`;
              }
              return line;
            })
            .join("\n")}
      }
      
      /* Screen styles: keep print root completely hidden during normal use */
      @media screen {
          #print-root {
              position: absolute !important;
              top: -99999px !important;
              left: -99999px !important;
              visibility: hidden !important;
              pointer-events: none !important;
              z-index: -1 !important;
          }
      }
    `;
    document.head.appendChild(printStyle);
    console.log("Injected print-specific stylesheet targeting #print-root.");

    // Trigger print and schedule cleanup
    const triggerPrint = () => {
      console.log("Triggering window.print()...");
      window.print();

      // Cleanup after print dialog closes
      setTimeout(() => {
        console.log("Print dialog closed. Cleaning up temporary elements.");
        if (document.body.contains(printRoot)) {
          document.body.removeChild(printRoot);
        }
        const styleElement = document.getElementById(printStyleId);
        if (styleElement) {
          document.head.removeChild(styleElement);
        }
      }, 1000);
    };

    // Use a short timeout to ensure the browser has processed the new DOM and CSS
    setTimeout(triggerPrint, 300);
  }, []);

  return { exportToPDF };
};