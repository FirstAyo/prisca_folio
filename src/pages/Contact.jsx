import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import contact from "../data/contact.json";

/**
 * Contact — a premium, animation-rich contact experience
 * Features:
 *  - Hero with parallax orbs & soft gradient sweep
 *  - JSON-driven details, socials, and FAQs
 *  - Animated form with validation + honeypot (anti-spam)
 *  - Magnetic submit button + progress state
 *  - Success overlay (motion check) + confetti burst
 *  - Copy-to-clipboard micro-interaction for email
 *
 * NOTE: The form uses a mocked async submit. Swap `mockSubmit` with Formspree/EmailJS/your API.
 */

// ---------- helpers: animation presets ----------
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18, filter: "blur(6px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.6 },
  transition: { duration: 0.6, ease: "easeOut", delay },
});

// ---------- simple clipboard hook ----------
function useClipboard(timeout = 1400) {
  const [copied, setCopied] = useState(false);
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    } catch (e) {
      console.error(e);
    }
  };
  return { copied, copy };
}

// ---------- mock submit (replace with real endpoint) ----------
const mockSubmit = (payload) =>
  new Promise((res) => setTimeout(() => res({ ok: true }), 1200));

// ---------- confetti (tiny, CSS based) ----------
function Confetti() {
  return (
    <>
      <style>{`
        .confetti { position: absolute; width: 8px; height: 8px; top: 50%; left: 50%; border-radius: 2px; opacity: 0; }
        @keyframes pop {
          0% { transform: translate(-50%,-50%) scale(0.4) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(var(--x), var(--y)) scale(1) rotate(360deg); opacity: 0; }
        }
      `}</style>
      {Array.from({ length: 28 }).map((_, i) => {
        const angle = (i / 28) * Math.PI * 2;
        const dist = 120 + (i % 7) * 12;
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        const color = [
          "#22d3ee",
          "#a78bfa",
          "#f472b6",
          "#34d399",
          "#facc15",
          "#60a5fa",
        ][i % 6];
        return (
          <span
            key={i}
            className="confetti"
            style={{
              background: color,
              animation: `pop 900ms ease-out forwards`,
              animationDelay: `${(i % 7) * 20}ms`,
              "--x": `${x}px`,
              "--y": `${y}px`,
            }}
          />
        );
      })}
    </>
  );
}

// ---------- magnetic button ----------
function MagneticButton({ children, loading, ...rest }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      setOffset({ x: x * 0.18, y: y * 0.18 });
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
    <motion.button
      ref={ref}
      type="submit"
      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 backdrop-blur text-sm font-medium shadow-sm w-full"
      style={{ translateX: offset.x, translateY: offset.y }}
      whileTap={{ scale: 0.98 }}
      disabled={loading}
      {...rest}
    >
      {loading ? (
        <>
          <span className="inline-block h-4 w-4 rounded-full border-2 border-neutral-400 border-t-transparent animate-spin" />
          <span>Sending…</span>
        </>
      ) : (
        <>
          <span>Send message</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className="opacity-80"
          >
            <path fill="currentColor" d="M13 5l7 7-7 7v-4H4v-6h9V5z" />
          </svg>
        </>
      )}
    </motion.button>
  );
}

// ---------- input wrapper with nice focus ring ----------
function Field({ label, children, error }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <div
        className={`rounded-xl border bg-white/70 dark:bg-neutral-900/70 backdrop-blur px-3 py-2 focus-within:ring-2 focus-within:ring-sky-400 dark:focus-within:ring-sky-500 border-neutral-200/70 dark:border-neutral-800/70`}
      >
        {children}
      </div>
      {error ? <div className="text-xs text-rose-500">{error}</div> : null}
    </div>
  );
}

// ---------- FAQ accordion ----------
function FAQ({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="p-4">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full text-left flex items-center justify-between"
            >
              <span className="font-medium">{f.q}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                className="inline-block"
              >
                ▾
              </motion.span>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm opacity-80 overflow-hidden pt-2"
                >
                  {f.a}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ---------- main page ----------
export default function Contact() {
  const { email, location, hours, phone } = contact.details;
  const { title, subtitle } = contact.hero;
  const { copied, copy } = useClipboard();

  // form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    message: "",
    honeypot: "", // 👈 should remain empty (anti-bot)
    startedAt: Date.now(),
  });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Tell me a bit about your project";
    if (form.honeypot) e.honeypot = "Spam detected";
    // quick check to catch < 3s submissions (most bots)
    if (Date.now() - form.startedAt < 1200) e.speed = "Hold on cowboy 🤠";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    const payload = { ...form, submittedAt: new Date().toISOString() };
    try {
      const res = await mockSubmit(payload);
      if (res.ok) {
        setOk(true);
        setForm((f) => ({ ...f, message: "" })); // keep name/email for convenience
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="container-px max-w-6xl mx-auto py-12 space-y-12 text-white">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl">
        {/* gradient orbs with subtle parallax sweep */}
        <div className="pointer-events-none absolute -inset-24 -z-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full blur-3xl bg-fuchsia-400/25 animate-[pulse_5s_ease-in-out_infinite]" />
          <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full blur-3xl bg-sky-400/25 animate-[pulse_6s_ease-in-out_infinite]" />
        </div>
        <motion.div
          {...fadeUp(0)}
          className="text-3xl sm:text-4xl font-semibold leading-tight"
        >
          {title}
        </motion.div>
        <motion.p {...fadeUp(0.1)} className="mt-2 opacity-80 max-w-2xl">
          {subtitle}
        </motion.p>

        <motion.div {...fadeUp(0.2)} className="mt-5 grid sm:grid-cols-3 gap-3">
          <div className="card p-4">
            <div className="text-xs opacity-70 mb-1">Email</div>
            <button
              onClick={() => copy(email)}
              className="inline-flex items-center gap-2 underline-offset-4 hover:underline"
            >
              {email}
              <span className="text-xs opacity-70">
                {copied ? "Copied!" : "Copy"}
              </span>
            </button>
          </div>
          <div className="card p-4">
            <div className="text-xs opacity-70 mb-1">Location</div>
            <div>{location}</div>
          </div>
          <div className="card p-4">
            <div className="text-xs opacity-70 mb-1">Office hours</div>
            <div>{hours}</div>
          </div>
        </motion.div>
      </section>

      {/* GRID: form + socials/faq */}
      <section className="grid md:grid-cols-[1.2fr_.8fr] gap-8 items-start">
        {/* FORM */}
        <motion.form
          onSubmit={onSubmit}
          className="card p-6 space-y-4"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          {/* Honeypot field (hidden from users; bots will fill) */}
          <input
            type="text"
            name="honeypot"
            value={form.honeypot}
            onChange={onChange}
            className="hidden"
            autoComplete="off"
            tabIndex={-1}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Your name" error={errors.name}>
              <input
                className="bg-transparent outline-none w-full"
                type="text"
                name="name"
                placeholder="Adaeze Okoye"
                value={form.name}
                onChange={onChange}
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <input
                className="bg-transparent outline-none w-full"
                type="email"
                name="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={onChange}
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Company (optional)">
              <input
                className="bg-transparent outline-none w-full"
                type="text"
                name="company"
                placeholder="Example Inc."
                value={form.company}
                onChange={onChange}
              />
            </Field>

            <Field label="Budget (optional)">
              <select
                className="bg-transparent outline-none w-full"
                name="budget"
                value={form.budget}
                onChange={onChange}
              >
                <option value="">Select a range</option>
                <option>$2k – $5k</option>
                <option>$5k – $10k</option>
                <option>$10k – $25k</option>
                <option>$25k+</option>
              </select>
            </Field>
          </div>

          <Field label="Project details" error={errors.message}>
            <textarea
              className="bg-transparent outline-none w-full min-h-[140px] resize-y"
              name="message"
              placeholder="What problem are we solving? Who is the user? Any links?"
              value={form.message}
              onChange={onChange}
            />
          </Field>

          {/* Submit */}
          {errors.speed && (
            <div className="text-xs text-amber-600 -mt-1">{errors.speed}</div>
          )}
          <MagneticButton loading={sending} />

          {/* Success overlay */}
          <AnimatePresence>
            {ok && (
              <motion.div
                className="fixed inset-0 z-50 grid place-items-center p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.98, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="relative card p-8 max-w-md text-center"
                >
                  <Confetti />
                  <motion.svg
                    viewBox="0 0 52 52"
                    className="mx-auto mb-3 w-14 h-14 text-emerald-500"
                  >
                    <motion.path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                      d="M14 27 l8 8 l16 -16"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  </motion.svg>
                  <div className="text-lg font-semibold">Message sent!</div>
                  <div className="text-sm opacity-80 mt-1">
                    I’ll reply to <b>{form.email || "your email"}</b> within 24
                    hours.
                  </div>
                  <motion.button
                    onClick={() => setOk(false)}
                    className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 hover:shadow-sm"
                    whileTap={{ scale: 0.98 }}
                  >
                    Close
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>

        {/* SIDEBAR: Socials + FAQ + Map placeholder */}
        <div className="space-y-6">
          <motion.div
            className="card p-5"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <div className="text-sm font-medium mb-3">Find me online</div>
            <ul className="grid gap-2">
              {contact.socials.map((s, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <a
                    className="inline-flex items-center gap-2 underline-offset-4 hover:underline"
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="font-medium">{s.label}</span>
                    <span className="opacity-70 text-sm">{s.handle}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <FAQ items={contact.faqs} />
          </motion.div>

          {/* Decorative map/cover (replace with real map embed if desired) */}
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 h-44"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <img
              src="https://images.unsplash.com/photo-1465447142348-e9952c393450?q=80&w=1400&auto=format&fit=crop"
              alt="Map placeholder"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent" />
            <div className="absolute bottom-2 left-2 text-xs bg-black/60 text-white px-2 py-1 rounded-md backdrop-blur">
              {contact.details.location}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
