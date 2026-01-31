import { useEffect, useState, useRef } from "react";

interface PageDimensions {
  width: number;
  height: number;
  widthMm: number;
  heightMm: number;
}

interface UsePageBreakingProps {
  previewHtml: string;
  pageDimensions: PageDimensions;
  pagePadding: number;
  fontSize: number;
  lineHeight: number;
  templateCss: string;
  paragraphSpacing: number;
}

/**
 * Helper to check if a container's direct children form a column layout.
 * Heuristic: checks if the second child starts above the bottom of the first child.
 */
function isColumnLayout(root: HTMLElement): boolean {
  if (root.children.length < 2) return false;
  const blocks = Array.from(root.children) as HTMLElement[];
  const first = blocks[0].getBoundingClientRect();
  const second = blocks[1].getBoundingClientRect();
  
  // If strict vertical stacking, second.top should be >= first.bottom (approx)
  // If overlap in Y space, assume columns.
  // Using 5px tolerance.
  return second.top < first.bottom - 5;
}

/**
 * Splits a single linear container (vertical stack) into pages.
 * Returns array of HTML strings (inner content or wrapped content depending on depth).
 */
function paginateLinear(
  root: HTMLElement, 
  availableHeight: number, 
  rootTopOffset: number,
  isRootMeasurer: boolean
): string[] {
  const blocks = Array.from(root.children) as HTMLElement[];
  if (blocks.length === 0) return [];

  const pagesHtml: string[] = [];
  let startIndex = 0;

  // Helper to wrap content in the root's tag/classes
  const wrap = (content: string) => {
    if (isRootMeasurer) return content;
    const tag = root.tagName.toLowerCase();
    return `<${tag} class="${root.className}" style="${root.getAttribute("style") || ""}">${content}</${tag}>`;
  };

  const pushPage = (from: number, toExclusive: number) => {
    if (toExclusive <= from) return;
    const slice = blocks.slice(from, toExclusive);
    const inner = slice.map((el) => el.outerHTML).join("");
    pagesHtml.push(wrap(inner));
  };

  for (let i = 0; i < blocks.length; i++) {
    const el = blocks[i];
    const rect = el.getBoundingClientRect();
    const bottomWithinRoot = rect.bottom - rootTopOffset; 

    const currentBoundary = (pagesHtml.length + 1) * availableHeight;

    // Check if this block crosses the page boundary
    if (bottomWithinRoot > currentBoundary && i > startIndex) {
      // It crossed, so push previous blocks to current page
      pushPage(startIndex, i);
      startIndex = i;
    }

    // Now check if the block *itself* is too tall for the *new* page (or current if just started)
    // We re-check against the boundary in case we just advanced a page
    const updatedBoundary = (pagesHtml.length + 1) * availableHeight;
    const bottomAfterPageShift = rect.bottom - rootTopOffset; // Absolute pos hasn't changed
    
    // If the element still ends after the boundary, we need to split it
    if (bottomAfterPageShift > updatedBoundary && i === startIndex) {
       // Deep split!
       // For the purposes of this recursive step, we treat 'el' as the root.
       // We need to extract its children and paginate them.
       // However, we must be careful: 'el' might be a Column container itself?
       // For now, we assume linear deep split unless we want to be fully recursive. 
       // Keeping it simple: Linear split of children.
       
       const childBlocks = Array.from(el.children) as HTMLElement[];
       if (childBlocks.length > 0) {
         let childStart = 0;
         let boundary = updatedBoundary;
         
         const wrapChild = (content: string) => {
            const tag = el.tagName.toLowerCase();
            return `<${tag} class="${el.className}" style="${el.getAttribute("style") || ""}">${content}</${tag}>`;
         };

         // Iterate children of the large element
         for (let c = 0; c < childBlocks.length; c++) {
           const childRect = childBlocks[c].getBoundingClientRect();
           const childBottom = childRect.bottom - rootTopOffset;
           
           if (childBottom > boundary && c > childStart) {
             const childSlice = childBlocks.slice(childStart, c).map(n => n.outerHTML).join("");
             // Add a page: RootWrapper -> ElWrapper -> ChildSlice
             pagesHtml.push(wrap(wrapChild(childSlice)));
             childStart = c;
             boundary += availableHeight;
           }
         }
         
         // Remainder of the split element
         const remainder = childBlocks.slice(childStart).map(n => n.outerHTML).join("");
         // This remainder is technically the start of the *next* page, 
         // OR it sits on the current newly created page?
         // In the loop logic, we just pushed pages. The remainder needs to be preserved for the loop to continue?
         // Actually, simpler: we just push the segment as a page and advance.
         // But wait, if we push the remainder, that page is now "open". 
         // The outer loop `startIndex` needs to become `i + 1`.
         // But the remainder might not fill the whole page?
         // The current logic assumes full-page segmentation for simplicity when splitting big items.
         // We'll push the remainder as a page entry (it might be small).
         // Future optimizations could "pack" the next sibling into this page, but simpler to just break.
         
         pagesHtml.push(wrap(wrapChild(remainder)));
         startIndex = i + 1;
       }
    }
  }

  // Push final remainder
  pushPage(startIndex, blocks.length);

  return pagesHtml.length > 0 ? pagesHtml : [wrap(blocks.map(b => b.outerHTML).join(""))];
}

/**
 * Handles multi-column layouts.
 * Paginate each column independently, then zip them together.
 */
function paginateColumns(
  root: HTMLElement, 
  availableHeight: number, 
  rootTopOffset: number,
  isRootMeasurer: boolean
): string[] {
    const columns = Array.from(root.children) as HTMLElement[];
    const columnsPagesMap: string[][] = [];

    // Paginate each column
    columns.forEach(col => {
       // We treat each column as a linear stack of children
       // We need to pass isRootMeasurer=false because 'col' is NOT the measurer, it's a child.
       // However, we want the output of paginateLinear to be the wrapped segments: <ColDiv>...content...</ColDiv>
       // So we pass 'col' as 'root'.
       const result = paginateLinear(col, availableHeight, rootTopOffset, false);
       columnsPagesMap.push(result);
    });

    const maxPages = Math.max(...columnsPagesMap.map(c => c.length));
    const finalPages: string[] = [];

    // Helper to produce empty column placeholder
    // We need the wrapper to preserve background colors/layout
    const getEmptyCol = (originalCol: HTMLElement) => {
        const tag = originalCol.tagName.toLowerCase();
        // Keep classes and styles (width, bg color, etc)
        return `<${tag} class="${originalCol.className}" style="${originalCol.getAttribute("style") || ""}"></${tag}>`;
    };

    const wrapRoot = (content: string) => {
        if (isRootMeasurer) return content;
        const tag = root.tagName.toLowerCase();
        return `<${tag} class="${root.className}" style="${root.getAttribute("style") || ""}">${content}</${tag}>`;
    };

    for (let i = 0; i < maxPages; i++) {
        let pageContent = "";
        
        columns.forEach((col, colIndex) => {
            const pageSegments = columnsPagesMap[colIndex];
            if (i < pageSegments.length) {
                pageContent += pageSegments[i];
            } else {
                // Empty column functionality for this page
                pageContent += getEmptyCol(col);
            }
        });

        finalPages.push(wrapRoot(pageContent));
    }

    return finalPages;
}


export const usePageBreaking = ({
  previewHtml,
  pageDimensions,
  pagePadding,
  fontSize,
  lineHeight,
  templateCss,
}: UsePageBreakingProps) => {
  const [pages, setPages] = useState<string[]>([]);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!previewHtml || !measureRef.current) {
      setPages(previewHtml ? [previewHtml] : []);
      return;
    }

    const measurer = measureRef.current;

    // Clear and setup measurer
    measurer.innerHTML = "";
    Object.assign(measurer.style, {
        width: `${pageDimensions.width - pagePadding * 2}px`,
        padding: `${pagePadding}px`,
        fontSize: `${fontSize}px`,
        lineHeight: `${lineHeight}`,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#1f2937",
        background: "white",
        boxSizing: "border-box",
        position: "absolute",
        top: "-9999px",
        left: "-9999px",
        visibility: "hidden",
        overflow: "visible",
    });

    // Apply template CSS
    const styleElement = document.createElement("style");
    styleElement.textContent = templateCss
      .split("\n")
      .map((line) => {
        if (line.includes(".cv-container")) return line.replace(".cv-container", ".measuring-container");
        return line.startsWith(".") ? `.measuring-container ${line}` : line;
      })
      .join("\n");
    document.head.appendChild(styleElement);

    measurer.className = "measuring-container";
    measurer.innerHTML = previewHtml;

    // Force layout
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    measurer.offsetHeight;

    const availableHeight = pageDimensions.height - pagePadding * 2;
    const totalHeight = measurer.scrollHeight;

    // Simple fit check
    if (totalHeight <= availableHeight) {
      document.head.removeChild(styleElement);
      setPages([previewHtml]);
      return;
    }

    // Identify Root
    const root: HTMLElement = measurer.children.length === 1 ? (measurer.children[0] as HTMLElement) : measurer;
    const isRootMeasurer = root === measurer;
    const rootTop = root.getBoundingClientRect().top;

    // Detect Layout Mode and Paginate
    let resultPages: string[] = [];
    
    if (isColumnLayout(root)) {
        resultPages = paginateColumns(root, availableHeight, rootTop, isRootMeasurer);
    } else {
        resultPages = paginateLinear(root, availableHeight, rootTop, isRootMeasurer);
    }

    document.head.removeChild(styleElement);
    setPages(resultPages.length > 0 ? resultPages : [previewHtml]);

  }, [
    previewHtml,
    pageDimensions,
    pagePadding,
    fontSize,
    lineHeight,
    templateCss,
  ]);

  return { pages, measureRef };
};
