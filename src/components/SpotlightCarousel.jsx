import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SpotlightCarousel
 * A premium, accessible carousel with:
 * - autoplay + pause on hover/focus
 * - drag/swipe + arrow keys + wheel
 * - parallax hover on hero image
 * - thumbnail navigation + progress bar
 *
 * Props:
 *  items: Array<{ title: string, src: string, href?: string }>
 *  height?: number (hero height in px; default 420)
 *  autoplayMs?: number (default 4200)
 *  showThumbs?: boolean (default true)
 */
export default function SpotlightCarousel({
  items = [],
  height = 420,
  autoplayMs = 4200,
  showThumbs = true,
}) {
  const list = useMemo(() => items.filter(Boolean), [items]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const wrap = (n) => (n + list.length) % list.length;
  const go = (n) => setIndex((i) => wrap(typeof n === "number" ? n : i + n));
  const goNext = () => go(index + 1);
  const goPrev = () => go(index - 1);

  // autoplay
  useEffect(() => {
    if (!playing || list.length <= 1) return;
    const id = setInterval(goNext, autoplayMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index, autoplayMs, list.length]);

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, list.length]);

  // wheel (horizontal intent)
  const wheelRef = useRef(0);
  useEffect(() => {
    const onWheel = (e) => {
      wheelRef.current += e.deltaY + e.deltaX;
      if (Math.abs(wheelRef.current) > 80) {
        if (wheelRef.current > 0) goNext();
        else goPrev();
        wheelRef.current = 0;
      }
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, list.length]);

  // progress bar
  const [progressKey, setProgressKey] = useState(0);
  useEffect(() => {
    setProgressKey((k) => k + 1);
  }, [index, autoplayMs]);

  // parallax (CSS variables, no re-renders)
  const heroRef = useRef(null);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--dx", `${px * 10}px`);
        el.style.setProperty("--dy", `${py * 8}px`);
        el.style.setProperty("--scale", `1.02`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--dx", `0px`);
        el.style.setProperty("--dy", `0px`);
        el.style.setProperty("--scale", `1`);
      });
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!list.length) return null;

  const current = list[index];

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-[hsl(var(--border))]/60 dark:border-neutral-800/60 dark:bg-neutral-900/60 backdrop-blur"
      onMouseEnter={() => setPlaying(false)}
      onMouseLeave={() => setPlaying(true)}
      onFocus={() => setPlaying(false)}
      onBlur={() => setPlaying(true)}
    >
      {/* header row */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">Spotlight</div>
          <div className="text-xs opacity-70 truncate">{current.title}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Previous slide"
            onClick={goPrev}
            className="h-9 w-9 grid place-items-center rounded-xl border border-[hsl(var(--border))] dark:border-neutral-700 hover:shadow-sm active:translate-y-px"
          >
            ←
          </button>
          <button
            aria-label="Next slide"
            onClick={goNext}
            className="h-9 w-9 grid place-items-center rounded-xl border border-[hsl(var(--border))] dark:border-neutral-700 hover:shadow-sm active:translate-y-px"
          >
            →
          </button>
        </div>
      </div>

      {/* hero */}
      <div className="relative">
        {/* progress bar */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-neutral-200/60 dark:bg-neutral-800/60 overflow-hidden">
          <span
            key={progressKey}
            className="block h-full bg-linear-to-r from-sky-400 via-fuchsia-400 to-rose-400"
            style={{
              width: playing ? "100%" : "0%",
              animation: playing ? `scrolly ${autoplayMs}ms linear` : "none",
            }}
          />
        </div>
        <style>{`
          @keyframes scrolly { from { transform: translateX(-100%) } to { transform: translateX(0%) } }
        `}</style>

        <div className="px-4 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.98, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.98, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <figure
                ref={heroRef}
                className="relative overflow-hidden rounded-xl aspect-video md:aspect-21/9 will-change-transform"
                style={{
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                <a
                  href={current.href || "#"}
                  target={current.href ? "_blank" : undefined}
                  rel={current.href ? "noreferrer" : undefined}
                  className="block h-full w-full"
                  aria-label={current.title}
                >
                  <img
                    src={current.src}
                    alt={current.title}
                    className="h-full w-full object-cover select-none pointer-events-none"
                    style={{
                      transform:
                        "translate3d(var(--dx,0px), var(--dy,0px), 0) scale(var(--scale,1))",
                      transition: "transform 200ms cubic-bezier(.2,.8,.2,1)",
                    }}
                    draggable={false}
                    loading="lazy"
                  />
                </a>

                {/* caption chip */}
                <figcaption className="absolute bottom-3 left-3 pointer-events-none">
                  <span className="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-lg bg-black/55 text-[hsl(var(--primary-fg))] dark:bg-white/12 backdrop-blur">
                    {current.title}
                  </span>
                </figcaption>

                {/* sheen */}
                <div className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition">
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.16),transparent)] animate-[sweep_3s_ease_infinite]" />
                </div>
              </figure>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* thumbnails */}
      {showThumbs && list.length > 1 && (
        <div className="px-4 pb-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {list.map((it, i) => {
              const active = i === index;
              return (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={[
                    "relative shrink-0 w-36 h-20 rounded-lg overflow-hidden border",
                    active
                      ? "border-sky-400/70 shadow"
                      : "border-[hsl(var(--border))]/60 dark:border-neutral-800/60",
                  ].join(" ")}
                  title={it.title}
                >
                  <img
                    src={it.src}
                    alt={it.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute inset-x-0 bottom-0 text-[10px] truncate px-2 py-1 bg-black/45 text-[hsl(var(--primary-fg))] backdrop-blur">
                    {it.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
