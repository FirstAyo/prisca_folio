import React from "react";

/**
 * AutoLTRMarquee
 * - Moves children left → right continuously
 * - Pauses on hover
 * - gap: px between items
 * - duration: seconds for one full cycle
 */
export default function AutoLTRMarquee({
  children,
  gap = 16,
  duration = 30,
  className = "",
}) {
  return (
    <div className={`relative overflow-hidden group ${className}`}>
      {/* edge fades (optional) */}
      {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-12 z-10 bg-linear-to-r from-white/80 dark:from-neutral-900/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 z-10 bg-linear-to-l from-white/80 dark:from-neutral-900/80 to-transparent" /> */}

      <style>{`
        @keyframes ltr-marquee {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0%); }
        }
        .ltr-track { animation: ltr-marquee linear infinite; }
        .group:hover .ltr-track { animation-play-state: paused; }
      `}</style>

      {/* One track that contains two copies of your items for seamless looping */}
      <div
        className="ltr-track flex items-center"
        style={{
          gap: `${gap}px`,
          animationDuration: `${duration}s`,
          willChange: "transform",
        }}
      >
        {/* copy A */}
        <div className="flex items-center" style={{ gap: `${gap}px` }}>
          {children}
        </div>
        {/* copy B */}
        <div className="flex items-center" style={{ gap: `${gap}px` }}>
          {children}
        </div>
      </div>
    </div>
  );
}
