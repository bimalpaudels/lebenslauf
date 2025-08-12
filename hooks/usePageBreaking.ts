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

    // Clear and set content
    measurer.innerHTML = "";
    measurer.style.width = `${pageDimensions.width - pagePadding * 2}px`;
    measurer.style.padding = `${pagePadding}px`;
    measurer.style.fontSize = `${fontSize}px`;
    measurer.style.lineHeight = `${lineHeight}`;
    measurer.style.fontFamily =
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    measurer.style.color = "#1f2937";
    measurer.style.background = "white";
    measurer.style.boxSizing = "border-box";
    measurer.style.position = "absolute";
    measurer.style.top = "-9999px";
    measurer.style.left = "-9999px";
    measurer.style.visibility = "hidden";
    measurer.style.overflow = "visible";

    // Apply template CSS to the measurer (scoped)
    const styleElement = document.createElement("style");
    styleElement.textContent = templateCss
      .split("\n")
      .map((line) => {
        if (line.includes(".cv-container")) {
          return line.replace(".cv-container", ".measuring-container");
        }
        return line.startsWith(".") ? `.measuring-container ${line}` : line;
      })
      .join("\n");
    document.head.appendChild(styleElement);

    measurer.className = "measuring-container";
    measurer.innerHTML = previewHtml;

    // Force layout calculation
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    measurer.offsetHeight;

    const availableHeight = pageDimensions.height - pagePadding * 2;

    // If everything fits, short-circuit
    const totalHeight = measurer.scrollHeight;
    if (totalHeight <= availableHeight) {
      document.head.removeChild(styleElement);
      setPages([previewHtml]);
      return;
    }

    // Determine the root to paginate: if exactly one child, use it; else use measurer
    const root: HTMLElement =
      measurer.children.length === 1
        ? (measurer.children[0] as HTMLElement)
        : measurer;

    const blocks = Array.from(root.children) as HTMLElement[];

    // If no clear blocks, fallback to single page
    if (blocks.length === 0) {
      document.head.removeChild(styleElement);
      setPages([previewHtml]);
      return;
    }

    const pagesHtml: string[] = [];
    let startIndex = 0;

    const rootTop = root.getBoundingClientRect().top;

    const pushPage = (from: number, toExclusive: number) => {
      if (toExclusive <= from) return;
      // Build a wrapper preserving root tag and classes if root != measurer
      const wrapperTag = root.tagName.toLowerCase();
      const wrapperClass = root.className;
      const slice = blocks.slice(from, toExclusive);
      const inner = slice.map((el) => el.outerHTML).join("");
      const pageContent =
        root === measurer
          ? inner
          : `<${wrapperTag} class="${wrapperClass}">${inner}</${wrapperTag}>`;
      pagesHtml.push(pageContent);
    };

    for (let i = 0; i < blocks.length; i++) {
      const el = blocks[i];
      const rect = el.getBoundingClientRect();
      const bottomWithinRoot = rect.bottom - rootTop; // includes margins/borders

      // Dynamic boundary advances as we add pages
      const currentBoundary = (pagesHtml.length + 1) * availableHeight;

      if (bottomWithinRoot > currentBoundary && i > startIndex) {
        // Close current page before this element
        pushPage(startIndex, i);
        startIndex = i;
      }

      // If a single block is taller than available height for the current page,
      // try to split by its children across multiple page boundaries
      if (
        bottomWithinRoot > (pagesHtml.length + 1) * availableHeight &&
        i === startIndex
      ) {
        const childBlocks = Array.from(el.children) as HTMLElement[];
        if (childBlocks.length > 0) {
          let childStart = 0;
          let boundary = (pagesHtml.length + 1) * availableHeight;
          for (let c = 0; c < childBlocks.length; c++) {
            const childRect = childBlocks[c].getBoundingClientRect();
            const childBottomWithinRoot = childRect.bottom - rootTop;
            if (childBottomWithinRoot > boundary && c > childStart) {
              const childInner = childBlocks
                .slice(childStart, c)
                .map((node) => node.outerHTML)
                .join("");
              // Wrap split segment with root wrapper to preserve context
              const wrapperTag = root.tagName.toLowerCase();
              const wrapperClass = root.className;
              const elTag = el.tagName.toLowerCase();
              const segmentHtml =
                root === measurer
                  ? `<${elTag} class="${el.className}">${childInner}</${elTag}>`
                  : `<${wrapperTag} class="${wrapperClass}"><${elTag} class="${el.className}">${childInner}</${elTag}></${wrapperTag}>`;
              pagesHtml.push(segmentHtml);
              childStart = c;
              boundary += availableHeight;
            }
          }
          // Remainder of the tall element goes into the next page slice
          const childInnerRemainder = childBlocks
            .slice(childStart)
            .map((node) => node.outerHTML)
            .join("");
          const wrapperTag = root.tagName.toLowerCase();
          const wrapperClass = root.className;
          const elTag = el.tagName.toLowerCase();
          const remainderHtml =
            root === measurer
              ? `<${elTag} class="${el.className}">${childInnerRemainder}</${elTag}>`
              : `<${wrapperTag} class="${wrapperClass}"><${elTag} class="${el.className}">${childInnerRemainder}</${elTag}></${wrapperTag}>`;
          pagesHtml.push(remainderHtml);
          startIndex = i + 1; // move past this tall element
        }
      }
    }

    // Push the remainder
    pushPage(startIndex, blocks.length);

    document.head.removeChild(styleElement);
    setPages(pagesHtml.length > 0 ? pagesHtml : [previewHtml]);
  }, [
    previewHtml,
    pageDimensions,
    pagePadding,
    fontSize,
    lineHeight,
    templateCss,
  ]);

  // Page splitting function for content pagination
  const splitContentIntoPages = (
    container: HTMLElement,
    availableHeight: number,
    pageHeight: number,
    pageDimensions: PageDimensions,
    pagePadding: number,
    fontSize: number,
    lineHeight: number,
    templateCss: string
  ): string[] => {
    // Deprecated: kept for backward compatibility if needed
    const elements = Array.from(container.children) as HTMLElement[];
    if (elements.length === 0) return [container.innerHTML];
    return splitContentIntoPagesInner(
      elements,
      availableHeight,
      pageHeight,
      container.tagName,
      pageDimensions,
      pagePadding,
      fontSize,
      lineHeight,
      templateCss
    );
  };

  const splitContentIntoPagesInner = (
    elements: HTMLElement[],
    availableHeight: number,
    pageHeight: number,
    wrapperTag: string = "div",
    pageDimensions: PageDimensions,
    pagePadding: number,
    fontSize: number,
    lineHeight: number,
    templateCss: string
  ): string[] => {
    // Simpler measurement: accumulate by actual offsets in the measuring container
    const root = document.createElement(wrapperTag.toLowerCase());
    const pages: string[] = [];
    let current: HTMLElement[] = [];

    const getPageHeight = (els: HTMLElement[]): number => {
      if (els.length === 0) return 0;
      const first = els[0];
      const last = els[els.length - 1];
      const top = first.getBoundingClientRect().top;
      const bottom = last.getBoundingClientRect().bottom;
      return bottom - top + pagePadding * 2; // approximate padding
    };

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const tentative = [...current, el];
      // Temporarily append to root for measurement
      root.innerHTML = tentative.map((n) => n.outerHTML).join("");
      document.body.appendChild(root);
      const height = root.scrollHeight;
      document.body.removeChild(root);

      if (height > availableHeight && current.length > 0) {
        const pageContent = current.map((n) => n.outerHTML).join("");
        pages.push(
          wrapperTag !== "div"
            ? `<${wrapperTag}>${pageContent}</${wrapperTag}>`
            : pageContent
        );
        current = [el];
      } else {
        current = tentative;
      }
    }

    if (current.length > 0) {
      const pageContent = current.map((n) => n.outerHTML).join("");
      pages.push(
        wrapperTag !== "div"
          ? `<${wrapperTag}>${pageContent}</${wrapperTag}>`
          : pageContent
      );
    }

    return pages.length > 0 ? pages : [""];
  };

  return { pages, measureRef };
};
