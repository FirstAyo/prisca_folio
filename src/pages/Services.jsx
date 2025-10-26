import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import data from "../data/services.json";

// ---------- animation helpers ----------
const slideL = (delay = 0) => ({
  initial: { opacity: 0, x: -36, filter: "blur(6px)" },
  whileInView: { opacity: 1, x: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.6 },
  transition: { duration: 0.55, ease: "easeOut", delay },
});

const slideR = (delay = 0) => ({
  initial: { opacity: 0, x: 36, filter: "blur(6px)" },
  whileInView: { opacity: 1, x: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.6 },
  transition: { duration: 0.55, ease: "easeOut", delay },
});

// ---------- magnetic CTA ----------
function MagneticCTA({ email, children }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      setOffset({ x: x * 0.15, y: y * 0.15 });
    };
    const onLeave = () => setOffset({ x: 0, y: 0 });
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <motion.a
      ref={ref}
      href={`mailto:${email}`}
      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900/80 backdrop-blur text-sm font-medium shadow-sm"
      style={{ translateX: offset.x, translateY: offset.y }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
      <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-80">
        <path fill="currentColor" d="M13 5l7 7-7 7v-4H4v-6h9V5z" />
      </svg>
    </motion.a>
  );
}

// ---------- service card (tilt on hover) ----------
function ServiceCard({ s, index }) {
  const cardRef = useRef(null);

  // Parent tilt for premium feel
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    let raf = 0;
    const max = 6;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      const rx = -dy * max;
      const ry = dx * max;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.01)`;
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
  }, []);

  // Alternate some cards from the right for rhythm
  const anim = index % 3 === 2 ? slideR(index * 0.04) : slideL(index * 0.04);

  return (
    <motion.div {...anim}>
      <div
        ref={cardRef}
        className="group relative overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60  dark:bg-neutral-900/70 backdrop-blur p-5 shadow-sm will-change-transform"
        style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
      >
        <div className="mb-2 inline-flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-lg border dark:bg-neutral-800">
          {s.tag}
        </div>
        <div className="text-lg font-semibold">{s.title}</div>
        <p className="opacity-80 text-sm mt-1">{s.desc}</p>
        <ul className="mt-3 grid gap-1 text-sm opacity-90">
          {s.bullets.map((b, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="i">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* subtle gradient sweep */}
        <div className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 transition">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.18),transparent)] animate-[sweep_2.8s_ease_infinite]" />
        </div>
      </div>
    </motion.div>
  );
}

// ---------- process rail (left→right reveals) ----------
function ProcessRail({ steps }) {
  return (
    <section>
      <motion.h3 {...slideL(0)} className="text-lg font-semibold mb-4">
        Process that de-risks delivery
      </motion.h3>

      <div className="relative overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 p-4">
        <div className="grid sm:grid-cols-5 gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              {...slideL(i * 0.05)}
              className="border rounded-2xl p-4 text-center"
            >
              <div className="text-xs opacity-70 mb-1">Step {s.step}</div>
              <div className="font-medium">{s.title}</div>
              <div className="text-xs opacity-80 mt-1">{s.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- main page ----------
export default function Services() {
  const { hero, services, process, cta } = data;

  return (
    <main className="container-px max-w-6xl mx-auto py-12 space-y-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl">
        {/* background orbs */}
        <div className="pointer-events-none absolute -inset-24 -z-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full blur-3xl animate-[pulse_7s_ease-in-out_infinite]" />
        </div>

        <motion.h1
          {...slideL(0)}
          className="text-3xl sm:text-4xl font-semibold leading-tight"
        >
          {hero.title}
        </motion.h1>
        <motion.p {...slideL(0.08)} className="mt-2 opacity-80 max-w-2xl">
          {hero.subtitle}
        </motion.p>

        <motion.div {...slideL(0.16)} className="mt-5">
          <MagneticCTA email={cta.email}>
            {cta.line} <span className="opacity-70">— {cta.sub}</span>
          </MagneticCTA>
        </motion.div>
      </section>

      {/* SERVICES GRID (left→right emphasis, some right→left accents) */}
      <section>
        <h3 className="text-lg font-semibold mb-4">What I do</h3>
        <div className="grid md:grid-cols-2 gap-5">
          {services.map((s, i) => (
            <ServiceCard key={i} s={s} index={i} />
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <ProcessRail steps={process} />

      {/* MINI CTA */}
      <section className="flex justify-center">
        <motion.div {...slideL(0.1)}>
          <MagneticCTA email={cta.email}>Let’s talk scope & timing</MagneticCTA>
        </motion.div>
      </section>
    </main>
  );
}
