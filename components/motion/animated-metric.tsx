"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatMetric, parseMetric } from "@/lib/motion/metric";

export function AnimatedMetric({ value }: { value: string }) {
  const parts = useMemo(() => parseMetric(value), [value]);
  const elementRef = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    if (!("IntersectionObserver" in window)) return;

    let frame = requestAnimationFrame(() => setDisplay(formatMetric(parts, 0)));
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const startedAt = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - startedAt) / 1400, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(formatMetric(parts, parts.target * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.45 },
    );
    if (elementRef.current) observer.observe(elementRef.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [parts, value]);

  return <strong ref={elementRef} aria-label={value}>{display}</strong>;
}
