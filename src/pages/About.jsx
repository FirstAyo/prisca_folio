import { useEffect, useMemo, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";
import about from "../data/about.json";

/**
 * ABOUT — Animation-rich, professional, JSON-driven
 * Sections:
 *  - Hero (parallax layers + tilt card)
 *  - Stats (count-up)
 *  - Principles (staggered reveal)
 *  - Tools marquee (infinite loop)
 *  - Timeline (sticky axis + reveal pins)
 *  - Testimonials (tilt cards)
 *  - CTA (magnetic)
 */

// ---------- small helpers ----------
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut", delay },
  },
});

function useTilt(ref, max = 8) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rx = -dy * max;
      const ry = dx * max;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
      });
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [ref, max]);
}

// ---------- counters ----------
function StatCard({ value, label, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-20% 0px -20% 0px", once: true });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 120, damping: 20 });
  const rounded = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, mv, value]);

  return (
    <motion.div ref={ref} className="card p-6 text-center" {...fadeUp(delay)}>
      <div className="text-3xl font-semibold">
        <motion.span>{rounded}</motion.span>
      </div>
      <div className="text-sm opacity-70 mt-1">{label}</div>
    </motion.div>
  );
}

// ---------- marquee ----------
function ToolsMarquee({ items, speed = 25 }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60">
      {/* subtle light sweep */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.12),transparent)] animate-[sweep_3.5s_ease_infinite]"></div>
      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes sweep { 0% { transform: translateX(-100%) } 100% { transform: translateX(100%) } }
      `}</style>
      <div className="flex whitespace-nowrap">
        <div
          className="flex gap-6 px-6 py-4 animate-[marquee_linear_infinite]"
          style={{ animationDuration: `${speed}s` }}
        >
          {items.map((t, i) => (
            <span
              key={`a-${i}`}
              className="px-3 py-1 rounded-full text-sm bg-amber-500 dark:bg-neutral-800"
            >
              {t}
            </span>
          ))}
        </div>
        {/* duplicate for infinite loop */}
        <div
          className="flex gap-6 px-6 py-4 animate-[marquee_linear_infinite]"
          style={{ animationDuration: `${speed}s` }}
        >
          {items.map((t, i) => (
            <span
              key={`b-${i}`}
              className="px-3 py-1 rounded-full text-sm bg-amber-500 dark:bg-neutral-800"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- timeline ----------
function Timeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.2"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="relative">
      <h3 className="text-lg font-semibold mb-4">Selected Work</h3>
      <div className="relative pl-8">
        {/* axis */}
        <motion.span
          style={{ scaleY }}
          className="absolute left-3 top-2 bottom-2 origin-top w-0.5 bg-neutral-200 dark:bg-neutral-800 rounded-full"
        />
        <div className="space-y-6">
          {about.timeline.map((t, i) => (
            <motion.div
              key={i}
              className="relative"
              initial={{ opacity: 0, x: 20, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.06 }}
            >
              {/* pin */}
              <span className="absolute -left-0.5 top-3 w-3 h-3 rounded-full bg-neutral-900 dark:bg-white ring-4 ring-white/70 dark:ring-neutral-900/70" />
              <div className="grid sm:grid-cols-[160px_1fr] gap-4 items-start card p-4">
                <div className="text-sm opacity-70">{t.year}</div>
                <div className="space-y-1">
                  <div className="font-medium">{t.title}</div>
                  <div className="text-sm opacity-80">{t.desc}</div>
                  <img
                    src={t.thumb}
                    alt={t.title}
                    className="mt-2 h-28 w-full object-cover rounded-xl"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- testimonials ----------
function Testimonials() {
  return (
    <section>
      <h3 className="text-lg font-semibold mb-4">What partners say</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {about.testimonials.map((t, i) => (
          <motion.div
            key={i}
            className="card p-5"
            initial={{ opacity: 0, y: 16, rotateX: -8 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-xs opacity-70">{t.role}</div>
              </div>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">“{t.quote}”</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ---------- CTA (magnetic) ----------
function MagneticCTA() {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 120, damping: 10, mass: 0.2 });
  const y = useSpring(my, { stiffness: 120, damping: 10, mass: 0.2 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      mx.set(dx * 0.15);
      my.set(dy * 0.15);
    };
    const onLeave = () => {
      mx.set(0);
      my.set(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [mx, my]);

  return (
    <div className="flex justify-center">
      <motion.a
        ref={ref}
        href={`mailto:${about.profile.email}`}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 backdrop-blur text-sm font-medium shadow-sm"
        style={{ x, y }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Let’s build something great
      </motion.a>
    </div>
  );
}

// ---------- main component ----------
export default function About() {
  // hero parallax
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], [0, -80]); // background moves slower
  const yFg = useTransform(scrollYProgress, [0, 1], [0, -20]); // avatar layer tiny parallax
  const tiltRef = useRef(null);
  useTilt(tiltRef, 10); // tilt the profile card (parent tilt)

  return (
    <main
      ref={containerRef}
      className="container-px max-w-6xl mx-auto py-12 space-y-12"
    >
      {/* inline keyframes for marquee/sweep already declared in ToolsMarquee */}

      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl">
        {/* floating gradient orbs */}
        <motion.div
          style={{ y: yBg }}
          className="absolute -inset-20 -z-10 opacity-70"
        >
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full blur-3xl bg-fuchsia-400/30" />
          <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full blur-3xl bg-sky-400/30" />
        </motion.div>

        <div className="grid md:grid-cols-[1fr_360px] gap-8 items-center">
          {/* copy */}
          <div>
            <motion.h1
              {...fadeUp(0)}
              className="text-3xl sm:text-4xl font-semibold leading-tight"
            >
              {about.profile.headline}
            </motion.h1>
            <motion.p {...fadeUp(0.08)} className="mt-3 opacity-80 max-w-2xl">
              {about.profile.bio}
            </motion.p>

            <motion.div
              {...fadeUp(0.16)}
              className="mt-4 flex flex-wrap items-center gap-3"
            >
              <span className="text-sm opacity-70">
                {about.profile.location}
              </span>
              <span className="opacity-30">•</span>
              {about.socials.map((s, i) => (
                <a
                  key={i}
                  className="text-sm underline-offset-4 hover:underline"
                  href={s.href}
                  target="_blank"
                >
                  {s.label}
                </a>
              ))}
            </motion.div>
          </div>

          {/* avatar card with tilt + parallax */}
          <motion.div style={{ y: yFg }}>
            <div
              ref={tiltRef}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-transparent shadow-sm will-change-transform"
              style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
            >
              <img
                src={about.profile.avatar}
                alt={about.profile.name}
                className="block w-full h-80 object-cover select-none pointer-events-none"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs bg-black/60 text-white dark:bg-white/10 backdrop-blur">
                  {about.profile.name} • {about.profile.role}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Impact by the numbers</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {about.stats.map((s, i) => (
            <StatCard
              key={i}
              value={s.value}
              label={s.label}
              delay={i * 0.06}
            />
          ))}
        </div>
      </section>

      {/* PRINCIPLES */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Principles</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {about.principles.map((p, i) => (
            <motion.div
              key={i}
              className="card p-5 space-y-1"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <div className="font-medium">{p.title}</div>
              <div className="text-sm opacity-80">{p.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TOOLS MARQUEE */}
      <ToolsMarquee items={about.tools} />

      {/* TIMELINE */}
      <Timeline />

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* CTA */}
      <MagneticCTA />
    </main>
  );
}
