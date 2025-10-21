import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function DraggableGallery({
  items,
  cols = "auto",
  minCols = 4,
  maxCols = 12,
  cardW = 280,
  cardH = 360,
  gap = 24,
  padding = 24,
  start = "center",
  fitCols = true,
}) {
  const viewportRef = useRef(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [modalItem, setModalItem] = useState(null);

  // Flag when user is dragging the canvas (prevents accidental opens on touch)
  const draggingRef = useRef(false);

  // Determine column count
  const colCount = useMemo(() => {
    if (cols === "auto") {
      const n = Math.max(items.length, minCols);
      const sqrt = Math.ceil(Math.sqrt(n));
      return Math.max(minCols, Math.min(maxCols, Math.ceil(sqrt * 1.25)));
    }
    return Math.max(1, cols);
  }, [cols, items.length, minCols, maxCols]);

  // Grid + content size
  const { positions, contentW, contentH } = useMemo(() => {
    const rows = Math.ceil(items.length / colCount);
    const contentW = padding * 2 + colCount * cardW + (colCount - 1) * gap;
    const contentH = padding * 2 + rows * cardH + (rows - 1) * gap;

    const positions = items.map((_, i) => {
      const c = i % colCount;
      const r = Math.floor(i / colCount);
      const x = padding + c * (cardW + gap);
      const y = padding + r * (cardH + gap);
      return { x, y };
    });

    return { positions, contentW, contentH };
  }, [items, colCount, cardW, cardH, gap, padding]);

  // Measure viewport
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () =>
      setViewport({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Drag constraints
  const constraints = useMemo(() => {
    const maxX = Math.max(0, contentW - viewport.w);
    const maxY = Math.max(0, contentH - viewport.h);
    return { left: -maxX, right: 0, top: -maxY, bottom: 0 };
  }, [contentW, contentH, viewport]);

  // Initial center
  const initial = useMemo(() => {
    if (start !== "center") return { x: 0, y: 0 };
    const maxX = Math.max(0, contentW - viewport.w);
    const maxY = Math.max(0, contentH - viewport.h);
    return { x: -maxX / 2, y: -maxY / 2 };
  }, [start, contentW, contentH, viewport]);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setModalItem(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div
        ref={viewportRef}
        className="relative h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)] overflow-hidden dark:bg-neutral-900/50 backdrop-blur"
      >
        <motion.div
          className="absolute cursor-grab active:cursor-grabbing touch-none" // 👈 enable touch-drag, prevent native scroll gestures
          style={{ width: contentW, height: contentH, left: 0, top: 0 }}
          drag
          dragConstraints={constraints}
          dragElastic={0.05}
          dragMomentum
          dragTransition={{ power: 0.2, timeConstant: 300 }}
          initial={initial}
          onDragStart={() => (draggingRef.current = true)}
          onDragEnd={() => {
            // Small delay so the "click" after a drag doesn't fire
            setTimeout(() => (draggingRef.current = false), 50);
          }}
        >
          {items.map((item, i) => {
            const { x, y } = positions[i];
            return (
              <TiltCard
                key={`${item.title}-${i}`}
                x={x}
                y={y}
                w={cardW}
                h={cardH}
                item={item}
                onOpen={() => {
                  if (!draggingRef.current) setModalItem(item); // 👈 works on touch/click
                }}
              />
            );
          })}
        </motion.div>
      </div>

      {/* Lightbox — tap/click ANYWHERE to close */}
      <AnimatePresence>
        {modalItem && (
          <motion.div
            className="fixed inset-0 z-50"
            onPointerDown={() => setModalItem(null)}
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
                src={modalItem.src}
                alt={modalItem.title}
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

/** Card with hover tilt (mouse) + tap/click open */
function TiltCard({ x, y, w, h, item, onOpen }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, s: 1 });

  // Hover tilt (mouse). Mobile won’t fire pointermove; it will just scale slightly.
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    let raf = 0;
    const MAX = 6;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const ry = dx * MAX;
      const rx = -dy * MAX;
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
  }, []);

  return (
    <div
      className="absolute select-none shadow-sm hover:shadow transition rounded-2xl"
      style={{ width: w, height: h, transform: `translate(${x}px, ${y}px)` }}
    >
      <motion.button
        ref={cardRef}
        type="button"
        onClick={onOpen} // 👈 reliable on touch; guarded by draggingRef
        className="group relative h-full w-full overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-transparent dark:bg-neutral-900 will-change-transform"
        style={{ transformStyle: "preserve-3d", perspective: 800 }}
        whileHover={{ boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}
        whileTap={{ scale: 0.98 }} // nice tap feedback on mobile
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <motion.div
          className="h-full w-full"
          style={{
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.s})`,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <img
            src={item.src}
            alt={item.title}
            className="h-full w-full object-cover pointer-events-none select-none rounded-2xl"
            draggable={false}
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
            <div className="rounded-xl px-2 py-1 text-xs font-medium bg-black/60 text-white dark:bg-white/15 backdrop-blur-sm">
              {item.title}
            </div>
          </div>
        </motion.div>
      </motion.button>
    </div>
  );
}
