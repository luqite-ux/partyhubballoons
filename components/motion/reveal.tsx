"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

type RevealProps = {
  as?: "div" | "section";
  children: ReactNode;
  className?: string;
};

export function Reveal({ as = "div", children, className }: RevealProps) {
  const elementRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const setElement = (element: HTMLElement | null) => {
    elementRef.current = element;
  };

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      return;
    }
    document.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10%", threshold: 0.12 },
    );
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  const props = { ref: setElement, className, "data-reveal": "", "data-visible": visible };
  return as === "section" ? <section {...props}>{children}</section> : <div {...props}>{children}</div>;
}
