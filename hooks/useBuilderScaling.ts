import { useState, useEffect, useMemo, useRef } from "react";

interface PageDimensions {
  width: number;
  height: number;
  widthMm: number;
  heightMm: number;
}

interface UseBuilderScalingProps {
  pageFormat: "A4" | "Letter";
}

export const useBuilderScaling = ({
  pageFormat,
}: UseBuilderScalingProps) => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const pageDimensions: PageDimensions = useMemo(() => {
    if (pageFormat === "A4") {
      return {
        width: 794,
        height: 1123,
        widthMm: 210,
        heightMm: 297,
      };
    } else {
      return {
        width: 816,
        height: 1056,
        widthMm: 216,
        heightMm: 279,
      };
    }
  }, [pageFormat]);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const containerWidth = container.clientWidth;

      // Calculate scale to fit width with some padding
      const availableWidth = containerWidth - 80; // 40px padding on each side
      const scaleX = availableWidth / pageDimensions.width;

      // For split pane, we want to show full page at reasonable scale
      const newScale = Math.min(scaleX, 1);
      setScale(Math.max(0.3, newScale));
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [pageDimensions]);

  return { scale, pageDimensions, containerRef };
};