export interface PageDimensions {
  width: number;
  height: number;
}

export interface SplitterConfig {
  pageDimensions: PageDimensions;
  pagePadding: number;
  fontSize: number;
  lineHeight: number;
  templateCss: string;
}

export class PageSplitter {
  private config: SplitterConfig;

  constructor(config: SplitterConfig) {
    this.config = config;
  }

  splitContentIntoPages(
    container: HTMLElement,
    availableHeight: number,
    pageHeight: number
  ): string[] {
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
      return this.splitContentIntoPagesInner(
        innerElements,
        availableHeight,
        pageHeight,
        elements[0].tagName
      );
    }

    return this.splitContentIntoPagesInner(elements, availableHeight, pageHeight);
  }

  private splitContentIntoPagesInner(
    elements: HTMLElement[],
    availableHeight: number,
    pageHeight: number,
    wrapperTag: string = "div"
  ): string[] {
    const pages: string[] = [];
    let currentPageElements: HTMLElement[] = [];

    // Create a temporary container for measuring with proper styles
    const tempContainer = document.createElement("div");
    tempContainer.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      width: ${this.config.pageDimensions.width - this.config.pagePadding * 2}px;
      padding: ${this.config.pagePadding}px;
      font-size: ${this.config.fontSize}px;
      line-height: ${this.config.lineHeight};
      visibility: hidden;
      background: white;
      color: #1f2937;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-sizing: border-box;
      overflow: visible;
    `;

    // Apply template CSS to temp container
    const styleElement = document.createElement("style");
    styleElement.textContent = this.config.templateCss
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
  }
}