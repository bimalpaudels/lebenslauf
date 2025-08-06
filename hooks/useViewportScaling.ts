import { useState, useEffect } from "react";

interface PageDimensions {
  width: number;
  height: number;
}

interface UseViewportScalingProps {
  containerRef: HTMLDivElement | null;
  pageFormat: "A4" | "Letter";
  standalone: boolean;
}

export const useViewportScaling = ({
  containerRef,
  pageFormat,
  standalone,
}: UseViewportScalingProps) => {
  const [scale, setScale] = useState(standalone ? 0.3 : 0.4);

  const pageDimensions: PageDimensions =
    pageFormat === "A4"
      ? { width: 794, height: 1123 }
      : { width: 816, height: 1056 };

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef) return;

      const containerWidth = containerRef.clientWidth;
      const containerHeight = containerRef.clientHeight;
      const padding = standalone ? 20 : 40;

      const availableWidth = containerWidth - padding;
      const availableHeight = containerHeight - padding;

      const scaleX = availableWidth / pageDimensions.width;
      const scaleY = availableHeight / pageDimensions.height;

      const maxScale = standalone ? 0.5 : 1;
      const minScale = standalone ? 0.2 : 0.3;

      const newScale = Math.min(scaleX, scaleY, maxScale);
      setScale(Math.max(minScale, newScale));
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef) {
      resizeObserver.observe(containerRef);
    }
    return () => resizeObserver.disconnect();
  }, [
    containerRef,
    pageFormat,
    standalone,
    pageDimensions.width,
    pageDimensions.height,
  ]);

  return { scale, pageDimensions };
};
