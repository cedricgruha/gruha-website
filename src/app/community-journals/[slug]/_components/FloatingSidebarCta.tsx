"use client";

import React, { useEffect, useState } from "react";
import JournalSidebarCtaCardV0 from "./JournalSidebarCtaCardV0";

/**
 * FloatingSidebarCta
 * Watches the inline hero CTA card (#hero-cta-sentinel) via IntersectionObserver.
 * When it scrolls out of the viewport the fixed floating card slides in.
 * When the user scrolls back up and the sentinel is visible again, it slides out.
 * Only visible on lg+ screens (hidden on mobile — the inline card handles mobile layout).
 */
export const FloatingSidebarCta: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("hero-cta-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show the floating card only when the inline sentinel is NOT visible
        setShow(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`hidden lg:block fixed right-6 z-40 w-[272px] transition-all duration-400 ease-out ${
        show
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
      style={{ top: "88px" }}
    >
      <JournalSidebarCtaCardV0 />
    </div>
  );
};

export default FloatingSidebarCta;
