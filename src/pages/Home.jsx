import { useMemo } from "react";
import { motion } from "framer-motion";
import EmailCopy from "../components/EmailCopy.jsx";
import Typewriter from "../components/Typewriter.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import ImageTiltZoom from "../components/ImageTiltZoom.jsx";
import site from "../data/site.json";
import projects from "../data/projects.json"; // expects { projects: [...] }
import services from "../data/services.json"; // optional; used for teaser if present
import SpotlightCarousel from "../components/SpotlightCarousel.jsx";
import Button from "../components/Button.jsx";
import arrowIcon from "/assets/arrow-up-right.svg";
import Carousel from "../components/Carousel.jsx";
import AutoLTRMarquee from "../components/AutoLTRMarquee.jsx";

/* -------------------- small animation presets -------------------- */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18, filter: "blur(4px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.7 },
  transition: { duration: 0.6, ease: "easeOut", delay },
});

/* ------------------------------ page ------------------------------ */
export default function Home() {
  // Pick 4 featured projects (first 4 or those flagged as featured)
  const featured = useMemo(() => {
    const fromFlag = (projects.projects || []).filter((p) => p.featured);
    const list = (fromFlag.length ? fromFlag : projects.projects || []).slice(
      0,
      4
    );
    return list;
  }, []);

  // Build items for the draggable gallery (fallbacks to project images)
  const galleryItems = useMemo(() => {
    const base = (projects.gallery?.items || []).map((g) => ({
      title: g.title || "Shot",
      src: g.src || g.image,
    }));
    if (base.length) return base;
    // Fallback: derive from projects data
    return (projects.projects || []).slice(0, 10).map((p) => ({
      title: p.title,
      src: p.image,
    }));
  }, []);

  return (
    <main className="container-px max-w-7xl mx-auto py-12 md:py-16 space-y-10 md:space-y-10">
      {/* ======================== HERO ======================== */}
      <section className="relative overflow-hidden rounded-2xl px-4 py-4 border">
        {/* floating gradient orbs */}
        <div className="pointer-events-none absolute -inset-24 -z-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full blur-3xl animate-[pulse_7s_ease-in-out_infinite]" />
        </div>

        <div className="mx-auto flex flex-col items-center text-center gap-4 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="leading-snug text-4xl md:text-5xl font-semibold"
          >
            <Typewriter
              text={site.title}
              className="italic"
              direction="ltr"
              speed={26}
              delay={0}
              centerAfter
            />
          </motion.h1>

          <motion.p {...fadeUp(0.08)} className="opacity-85">
            {site.introHeadline}
          </motion.p>

          <motion.div
            {...fadeUp(0.16)}
            className="flex items-center gap-3 mt-1"
          >
            <Button
              title="View Projects"
              image={arrowIcon}
              className="flex items-center gap-1 bg-white text-black rounded-lg px-4 py-2 font-semibold"
              link="#"
            />
            <EmailCopy email={site.email} />
          </motion.div>

          {/* logos / tooling marquee */}
          <Marquee
            items={[
              "Figma",
              "Framer",
              "React",
              "Tailwind",
              "Lottie",
              "Jira",
              "Hotjar",
              "Supabase",
              "TypeScript",
              "Linear",
            ]}
          />
        </div>
      </section>

      {/* completed project card moving from left to right */}

      <AutoLTRMarquee
        gap={16}
        duration={28}
        className="py-1 border rounded-2xl"
      >
        {projects.projects.map((project, i) => (
          <Carousel
            key={i}
            image={project.image}
            to={project.slug} // ← pass `to` (or keep slug, both work)
            title={project.title}
          />
        ))}
      </AutoLTRMarquee>

      {/* =================== FEATURED PROJECTS =================== */}
      <section className="border rounded-2xl">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl font-semibold">Featured work</h2>
          <a
            href="/projects"
            className="text-sm underline-offset-4 hover:underline opacity-90"
            title="See all projects"
          >
            View all work →
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {featured.map((p, i) => (
            <ProjectCard key={p.slug || p.title || i} project={p} i={i} />
          ))}
        </div>
      </section>
      {/* =========== INTERACTIVE PROJECT GALLERY (PAN) =========== */}
      <section className="rounded-2xl overflow-hidden border">
        {/* <div className="flex items-center justify-between px-4 py-3">
          <div>
            <div className="text-sm font-medium">Playground</div>
            <div className="text-xs opacity-70">
              Drag around to explore shots
            </div>
          </div>
          <a
            href="/projects"
            className="text-sm underline-offset-4 hover:underline opacity-90"
          >
            Explore all →
          </a>
        </div> */}
        <SpotlightCarousel
          items={(projects.gallery?.items || projects.projects.slice(0, 8)).map(
            (p) => ({
              title: p.title || "Project",
              src: p.src || p.image,
              href: p.href || p.caseStudyUrl || p.liveUrl,
            })
          )}
          height={420}
          autoplayMs={4200}
          showThumbs
        />
      </section>
      {/* ================== SERVICES TEASER (L→R) ================== */}
      {services?.services?.length ? (
        <section className="border rounded-2xl p-3">
          <h2 className="text-xl font-semibold mb-4">How I can help</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {services.services.slice(0, 3).map((s, i) => (
              <ServiceTeaser key={s.title} s={s} i={i} />
            ))}
          </div>
        </section>
      ) : null}
      {/* ================== CASE STUDY HIGHLIGHT ================== */}
      {featured[0] ? <CaseStudyHighlight project={featured[0]} /> : null}
      {/* ================== TESTIMONIAL BLIP ================== */}
      {projects.testimonials?.length ? (
        <section className="grid md:grid-cols-[1fr_.9fr] gap-6 items-center bg-red-400">
          <motion.div {...fadeUp(0)} className="space-y-2">
            <h3 className="text-lg font-semibold">What partners say</h3>
            <p className="text-sm opacity-80">
              I partner with founders and product teams to ship outcomes — not
              just screens.
            </p>
          </motion.div>
          <motion.div
            {...fadeUp(0.08)}
            className="card p-5"
            style={{ transformStyle: "preserve-3d" }}
          >
            <blockquote className="text-sm opacity-90 leading-relaxed">
              “{projects.testimonials[0].quote}”
            </blockquote>
            <div className="mt-3 text-xs opacity-70">
              — {projects.testimonials[0].name}, {projects.testimonials[0].role}
            </div>
          </motion.div>
        </section>
      ) : null}
      {/* ================== AVAILABILITY / CTA ================== */}
      <section className="rounded-2xl border dark:border-neutral-800/60 p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-lg font-semibold">Open for select work</div>
          <div className="text-sm opacity-80">
            Let’s turn your product goals into a measurable win.
          </div>
        </div>
        <a
          href={`mailto:${site.email}`}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 backdrop-blur text-sm font-medium shadow-sm hover:shadow transition"
        >
          Get in touch
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className="opacity-80"
          >
            <path fill="currentColor" d="M13 5l7 7-7 7v-4H4v-6h9V5z" />
          </svg>
        </a>
      </section>
    </main>
  );
}

/* ========================= helpers/components ========================= */

// Lightweight marquee component (no deps beyond Tailwind)
function Marquee({ items = [], speedSec = 28 }) {
  return (
    <div className="relative mt-6 w-full overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800/60 text-gray-700">
      <style>{`
        @keyframes hm-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .hm-marquee { animation: hm-marquee linear infinite; }
      `}</style>
      <div className="flex whitespace-nowrap">
        <div
          className="hm-marquee flex gap-6 px-6 py-3"
          style={{ animationDuration: `${speedSec}s` }}
        >
          {items.map((t, i) => (
            <span
              key={`a-${i}`}
              className="px-3 py-1 rounded-full text-xs border-gray-700 bg-neutral-100"
            >
              {t}
            </span>
          ))}
        </div>
        <div
          className="hm-marquee flex gap-6 px-6 py-3"
          style={{ animationDuration: `${speedSec}s` }}
        >
          {items.map((t, i) => (
            <span
              key={`b-${i}`}
              className="px-3 py-1 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Service teaser card: slides in from the left, subtle hover tilt
function ServiceTeaser({ s, i = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.05 }}
    >
      <div
        className="group relative overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 dark:bg-neutral-900/70 backdrop-blur p-5 shadow-sm will-change-transform"
        style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
      >
        <div className="mb-2 inline-flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800">
          {s.tag || "Service"}
        </div>
        <div className="text-lg font-semibold">{s.title}</div>
        <p className="opacity-80 text-sm mt-1">{s.desc}</p>
        <ul className="mt-3 grid gap-1 text-sm opacity-90">
          {(s.bullets || []).slice(0, 3).map((b, i) => (
            <li key={i} className="flex items-center gap-2">
              <span>•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* sheen on hover */}
        <div className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 transition">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.16),transparent)] animate-[sweep_3s_ease_infinite]" />
        </div>
      </div>
    </motion.div>
  );
}

// Case study highlight with image tilt zoom on the right
function CaseStudyHighlight({ project }) {
  return (
    <section className="grid md:grid-cols-[1.05fr_.95fr] gap-6 items-center border rounded-2xl">
      <motion.div {...fadeUp(0)} className="space-y-2 px-5">
        <h3 className="text-lg font-semibold">Spotlight: {project.title}</h3>
        <p className="text-sm opacity-85">{project.summary}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs rounded-full px-3 py-1 border border-neutral-200 dark:border-neutral-800">
            {String(project.status).toUpperCase()}
          </span>
          {(project.tags || []).slice(0, 4).map((t) => (
            <span
              key={t}
              className="text-xs rounded-full px-3 py-1 bg-neutral-100 dark:bg-neutral-800"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="pt-3">
          {project.caseStudyUrl ? (
            <a
              href={project.caseStudyUrl}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:shadow-sm text-sm"
              target="_blank"
              rel="noreferrer"
            >
              Read case study
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                className="opacity-80"
              >
                <path
                  fill="currentColor"
                  d="M14 3h7v7h-2V6.41l-8.29 8.3-1.42-1.42 8.3-8.29H14V3z"
                />
              </svg>
            </a>
          ) : null}
        </div>
      </motion.div>

      {/* Re-use your tilt-zoom image component */}
      <ImageTiltZoom
        src={project.image}
        alt={project.title}
        title={project.title}
        maxTilt={8}
        delay={0}
      />
    </section>
  );
}
