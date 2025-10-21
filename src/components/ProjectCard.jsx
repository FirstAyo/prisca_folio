import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * ProjectCard
 * Polished, animated card for portfolio items.
 *
 * Expected project shape:
 * {
 *   title: string,
 *   year: string | number,
 *   image: string,           // hero image
 *   summary: string,
 *   status: "live" | "wip" | "done" | "archived" | string,
 *   tags: string[],
 *   caseStudyUrl?: string,   // optional
 *   liveUrl?: string         // optional
 * }
 *
 * Notes:
 * - Parent element tilts; image parallax reacts to pointer.
 * - Gradient ring appears on hover (GPU-friendly).
 * - Replace object-cover images with your own sizes for best quality.
 */

export default function ProjectCard({ project, i = 0 }) {
  const cardRef = useRef(null);

  // Parent tilt + image parallax (CSS variables, no re-renders)
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    let raf = 0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);  // -1..1
      const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2); // -1..1
      const rx = clamp(-py * 8, -8, 8);  // rotateX
      const ry = clamp(px * 10, -10, 10); // rotateY
      const dx = clamp(px * 8, -8, 8);    // image shiftX
      const dy = clamp(py * 6, -6, 6);    // image shiftY

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--rx", `${rx}deg`);
        el.style.setProperty("--ry", `${ry}deg`);
        el.style.setProperty("--dx", `${dx}px`);
        el.style.setProperty("--dy", `${dy}px`);
        el.style.setProperty("--scale", `1.02`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--rx", `0deg`);
        el.style.setProperty("--ry", `0deg`);
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

  const statusTone = toneForStatus(project.status);

  return (
    <motion.article
      initial={{ opacity: 0, y: 22, filter: "blur(3px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.06 }}
      tabIndex={0}
      className="group relative outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 rounded-2xl"
    >
      {/* Hover gradient ring */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-[18px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, rgba(56,189,248,.6), rgba(168,85,247,.6), rgba(244,114,182,.6), rgba(56,189,248,.6))",
          filter: "blur(8px)",
        }}
      />

      {/* Card core (tilts) */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 bg-white/75 dark:bg-neutral-900/70 backdrop-blur will-change-transform shadow-sm"
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          transform:
            "perspective(1100px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) scale(var(--scale,1))",
          transition: "transform 220ms cubic-bezier(.2,.8,.2,1)",
        }}
      >
        {/* Media */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover select-none pointer-events-none"
            style={{
              transform:
                "translate3d(var(--dx,0px), var(--dy,0px), 0) scale(1.06)",
              transition: "transform 220ms cubic-bezier(.2,.8,.2,1)",
            }}
            loading="lazy"
            draggable={false}
          />

          {/* Top row: title + year overlay on small screens only */}
          <div className="absolute inset-x-3 top-3 flex items-center justify-between md:hidden">
            <Badge tone={statusTone} status={project.status} compact />
            <Chip>{project.year}</Chip>
          </div>
        </div>

        {/* Title row */}
        <div className="flex items-center justify-between border-t border-neutral-200/70 dark:border-neutral-800/70 px-5 py-4">
          <h3 className="text-lg font-semibold leading-tight">
            {project.title}
          </h3>
          <span className="text-sm opacity-70 hidden md:block">{project.year}</span>
        </div>

        {/* Summary */}
        <p className="text-sm opacity-85 px-5 pt-1 pb-3">
          {project.summary}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 px-4 pb-5">
          <Badge tone={statusTone} status={project.status} />
          <div className="flex flex-wrap gap-2">
            {project.tags?.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>

        {/* Actions */}
        {(project.caseStudyUrl || project.liveUrl) && (
          <div className="flex items-center gap-3 px-4 pb-5">
            {project.caseStudyUrl && (
              <GhostButton href={project.caseStudyUrl}>Case study</GhostButton>
            )}
            {project.liveUrl && (
              <GhostButton href={project.liveUrl}>
                Live demo
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  className="ml-1 opacity-80"
                >
                  <path
                    fill="currentColor"
                    d="M14 3h7v7h-2V6.41l-8.29 8.3-1.42-1.42 8.3-8.29H14V3z"
                  />
                </svg>
              </GhostButton>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}

/* ----------------- tiny UI atoms ----------------- */

function Badge({ tone, status, compact = false }) {
  const text = String(status ?? "").toUpperCase();
  const pulse = /wip|in.?progress/i.test(String(status));
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] tracking-wide",
        tone.border,
        tone.text,
        pulse ? "animate-[pulse_2.8s_ease-in-out_infinite]" : "",
        compact ? "backdrop-blur bg-black/40 text-white border-white/30" : "bg-white/70 dark:bg-neutral-900/70 backdrop-blur",
      ].join(" ")}
      title={text}
    >
      <span
        className={[
          "inline-block h-1.5 w-1.5 rounded-full",
          tone.dot,
          pulse ? "animate-ping" : "",
        ].join(" ")}
      />
      {text}
    </span>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-black/40 text-white border border-white/30 backdrop-blur px-2.5 py-1 text-[10px]">
      {children}
    </span>
  );
}

function Tag({ children }) {
  return (
    <span className="text-xs rounded-full px-3 py-1 border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur transition-transform hover:-translate-y-0.5 active:translate-y-0">
      {children}
    </span>
  );
}

function GhostButton({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 px-3.5 py-2 hover:shadow-sm transition active:translate-y-[1px]"
    >
      {children}
    </a>
  );
}

/* ----------------- helpers ----------------- */

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function toneForStatus(status) {
  const s = String(status || "").toLowerCase();
  if (/live|launched|prod/.test(s))
    return {
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-200/60 dark:border-emerald-900/50",
      dot: "bg-emerald-500",
    };
  if (/wip|in.?progress|ongoing/.test(s))
    return {
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-200/60 dark:border-amber-900/50",
      dot: "bg-amber-500",
    };
  if (/archived|deprecated/.test(s))
    return {
      text: "text-neutral-600 dark:text-neutral-400",
      border: "border-neutral-200/60 dark:border-neutral-800/60",
      dot: "bg-neutral-500",
    };
  // default: done/complete
  return {
    text: "text-sky-700 dark:text-sky-400",
    border: "border-sky-200/60 dark:border-sky-900/50",
    dot: "bg-sky-500",
  };
}
