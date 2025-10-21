import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * ImageTiltZoom (parent tilts)
 * - Entrance animation: fade in + slide up
 * - Hover tilt on parent (no halo)
 * - Click/tap to open fullscreen; tap anywhere/ESC to close
 *
 * Extra props:
 *  - delay?: number  (seconds; default 0) — for staggering in lists
 */
export default function ImageTiltZoom({
  src,
  alt = "",
  title,
  className = "",
  rounded = "rounded-2xl",
  border = true,
  shadow = true,
  maxTilt = 6,
  delay = 0, // 👈 new
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, s: 1 });
  const [open, setOpen] = useState(false);

  // Tilt the parent so edges stay clean
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    let raf = 0;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const ry = dx * maxTilt;
      const rx = -dy * maxTilt;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setTilt({ rx, ry, s: 1.02 }));
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setTilt({ rx: 0, ry: 0, s: 1 }));
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [maxTilt]);

  // ESC closes
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Entrance animation wrapper (bottom → up) */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay }}
      >
        {/* Card (PARENT tilts) */}
        <motion.button
          ref={cardRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open image"
          className={[
            "group relative w-full overflow-hidden will-change-transform",
            rounded,
            border
              ? "border border-neutral-200/60 dark:border-neutral-800/60"
              : "",
            shadow ? "shadow-sm hover:shadow transition" : "transition",
            "bg-transparent", // transparent avoids halo
            className,
          ].join(" ")}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.s})`,
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
          whileHover={{ boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          <img
            src={src}
            alt={alt}
            className="block h-full w-full object-cover select-none pointer-events-none"
            draggable={false}
            loading="lazy"
          />
          {title && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
              <div className="rounded-xl px-2 py-1 text-xs font-medium bg-black/60 text-white dark:bg-white/15 backdrop-blur-sm">
                {title}
              </div>
            </div>
          )}
        </motion.button>
      </motion.div>

      {/* Lightbox — click/tap ANYWHERE to close */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50"
            onPointerDown={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center p-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <img
                src={src}
                alt={alt}
                className="max-h-[90vh] max-w-[92vw] object-contain rounded-2xl shadow-2xl pointer-events-none"
                draggable={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
