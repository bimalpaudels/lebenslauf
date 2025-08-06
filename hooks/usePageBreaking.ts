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
    measurer.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    measurer.style.color = "#1f2937";
    measurer.style.background = "white";
    measurer.style.boxSizing = "border-box";
    measurer.style.position = "absolute";
    measurer.style.top = "-9999px";
    measurer.style.left = "-9999px";
    measurer.style.visibility = "hidden";
    measurer.style.overflow = "visible";

    // Apply template CSS to the measurer
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
    measurer.offsetHeight;

    const availableHeight = pageDimensions.height - pagePadding * 2;

    // Check if content fits in one page
    const totalHeight = measurer.scrollHeight;
    console.log(
      `Content height: ${totalHeight}, Available height: ${availableHeight}`
    );

    if (totalHeight <= availableHeight) {
      console.log("Content fits in single page");
      document.head.removeChild(styleElement);
      setPages([previewHtml]);
      return;
    }

    console.log("Content needs to be split across multiple pages");
    
    // Split content into pages using the original logic
    const splitPages = splitContentIntoPages(
      measurer,
      availableHeight,
      pageDimensions.height,
      pageDimensions,
      pagePadding,
      fontSize,
      lineHeight,
      templateCss
    );
    console.log(`Created ${splitPages.length} pages`);

    // Clean up
    document.head.removeChild(styleElement);
    setPages(splitPages);
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
    const pages: string[] = [];
    const elements = Array.from(container.children) as HTMLElement[];

    if (elements.length === 0) {
      return [container.innerHTML];
    }

    // If we only have one element and it's too large, look inside it
    if (elements.length === 1 && elements[0].children.length > 0) {
      console.log(
        "Single large container detected, looking inside for smaller elements"
      );
      const innerElements = Array.from(elements[0].children) as HTMLElement[];
      return splitContentIntoPagesInner(
        innerElements,
        availableHeight,
        pageHeight,
        elements[0].tagName,
        pageDimensions,
        pagePadding,
        fontSize,
        lineHeight,
        templateCss
      );
    }

    return splitContentIntoPagesInner(
      elements,
      availableHeight,
      pageHeight,
      "div",
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
    const pages: string[] = [];
    let currentPageElements: HTMLElement[] = [];

    // Create a temporary container for measuring with proper styles
    const tempContainer = document.createElement("div");
    tempContainer.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      width: ${pageDimensions.width - pagePadding * 2}px;
      padding: ${pagePadding}px;
      font-size: ${fontSize}px;
      line-height: ${lineHeight};
      visibility: hidden;
      background: white;
      color: #1f2937;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-sizing: border-box;
      overflow: visible;
    `;

    // Apply template CSS to temp container
    const styleElement = document.createElement("style");
    styleElement.textContent = templateCss
      .split("\n")
      .map((line) => {
        if (line.includes(".cv-container")) {
          return line.replace(".cv-container", ".temp-measuring-container");
        }
        return line.startsWith(".")
          ? `.temp-measuring-container ${line}`
          : line;
      })
      .join("\n");
    document.head.appendChild(styleElement);

    tempContainer.className = "temp-measuring-container";
    document.body.appendChild(tempContainer);

    console.log(`Splitting ${elements.length} elements across pages`);

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const clonedElement = element.cloneNode(true) as HTMLElement;

      // Clear temp container and add current page elements plus new element
      tempContainer.innerHTML = "";
      currentPageElements.forEach((el) => {
        tempContainer.appendChild(el.cloneNode(true));
      });
      tempContainer.appendChild(clonedElement);

      // Get the actual rendered height
      const measuredHeight = tempContainer.scrollHeight;
      console.log(
        `Element ${i} (${element.tagName}): measuredHeight=${measuredHeight}, availableHeight=${availableHeight}`
      );

      // Check if adding this element would exceed page height
      if (
        measuredHeight > availableHeight &&
        currentPageElements.length > 0
      ) {
        console.log(`Page break at element ${i}, creating new page`);
        // Save current page
        const pageContent = currentPageElements
          .map((el) => el.outerHTML)
          .join("");
        if (wrapperTag !== "div") {
          // Wrap in the original container tag
          pages.push(`<${wrapperTag}>${pageContent}</${wrapperTag}>`);
        } else {
          pages.push(pageContent);
        }

        // Start new page with current element
        currentPageElements = [element];
        tempContainer.innerHTML = "";
        tempContainer.appendChild(element.cloneNode(true));
      } else {
        // Add element to current page
        currentPageElements.push(element);
      }
    }

    // Add remaining elements as last page
    if (currentPageElements.length > 0) {
      const pageContent = currentPageElements
        .map((el) => el.outerHTML)
        .join("");
      if (wrapperTag !== "div") {
        // Wrap in the original container tag
        pages.push(`<${wrapperTag}>${pageContent}</${wrapperTag}>`);
      } else {
        pages.push(pageContent);
      }
    }

    // Clean up temporary container and style
    document.body.removeChild(tempContainer);
    document.head.removeChild(styleElement);

    console.log(`Created ${pages.length} pages`);
    return pages.length > 0 ? pages : [""];
  };

  return { pages, measureRef };
};