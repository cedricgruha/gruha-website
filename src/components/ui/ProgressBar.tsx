"use client";

import React, { useEffect, useState } from "react";

export default function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const el = document.getElementById("journal-content");
      if (!el) {
        ticking = false;
        return;
      }

      const rect = el.getBoundingClientRect();
      const elTop = rect.top;
      const elHeight = el.offsetHeight;
      const vh = window.innerHeight;

      // Progress based on how much of the content has scrolled through the viewport
      // 0% when content top hits viewport top, 100% when content bottom hits viewport bottom
      const total = elHeight - vh;
      if (total <= 0) {
        setProgress(100);
        ticking = false;
        return;
      }

      const scrolled = -elTop;
      setProgress(Math.max(0, Math.min(100, (scrolled / total) * 100)));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 h-[3px] pointer-events-none z-50 bg-slate-100/50">
      <div
        className="h-full"
        style={{
          background: "linear-gradient(90deg, #FF7E57 10.56%, #FF583A 100%)",
          width: `${progress}%`,
        }}
      />
      {progress > 0 && (
        <div
          className="absolute top-1/2 w-[6px] h-[6px] rounded-full bg-[#FF583A]"
          style={{
            left: `${progress}%`,
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 6px 2px rgba(255, 88, 58, 0.8), 0 0 14px 4px rgba(255, 88, 58, 0.3)",
          }}
        />
      )}
    </div>
  );
}
