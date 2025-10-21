import { useEffect, useState, useCallback } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import site from "../data/site.json";
import Button from "./Button";
import arrowIcon from "/assets/arrow-up-right.svg";

/* ------------------------------ Theme hook ------------------------------ */
/**
 * Tailwind should be configured for class-based dark mode:
 *  theme: { darkMode: 'class' }
 * This hook:
 * - Reads persisted theme from localStorage ('light' | 'dark' | 'system')
 * - Falls back to system preference if none
 * - Applies/removes the 'dark' class on <html>
 */
function useTheme() {
  const getInitial = () => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    // system
    const isDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    return isDark ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitial);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Keep in sync with system changes (optional)
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const handler = (e) => {
      const saved = localStorage.getItem("theme");
      if (!saved || saved === "system") {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return { theme, setTheme, toggle };
}

/* ------------------------------ Component ------------------------------ */
export default function Nav() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur dark:bg-neutral-950/70 border-b border-neutral-200/60 dark:border-neutral-800/60">
      <nav className="container-px max-w-6xl mx-auto flex items-center justify-between h-16 md:h-20 dark:text-neutral-100">
        {/* Left: Brand + mobile burger */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-300 dark:border-neutral-700 hover:shadow-sm active:translate-y-[1px]"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-controls="mobile-drawer"
            aria-expanded={open}
          >
            <Menu size={18} />
          </button>
          <Link to="/" className="font-semibold py-2 uppercase text-white">
            Priscy Designs
          </Link>
        </div>

        {/* Center: Desktop links */}
        <div className="hidden md:block">
          <ul className="flex items-center gap-1 text-[15px] font-semibold">
            {site.sections.map((s) => (
              <li key={s.path}>
                <NavLink
                  to={s.path}
                  className={({ isActive }) =>
                    [
                      "px-3 py-2 rounded-lg transition",
                      isActive
                        ? "bg-white text-black dark:bg-white dark:text-black"
                        : "hover:bg-white hover:text-black dark:hover:bg-neutral-800",
                    ].join(" ")
                  }
                >
                  {s.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Desktop theme toggle + Resume */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle theme={theme} onToggle={toggle} />
          <Button
            title="My Resume"
            image={arrowIcon}
            className="flex items-center gap-1 bg-white text-black rounded-lg px-4 py-2 font-semibold"
            link={site.resumeUrl || "#"}
          />
        </div>

        {/* Mobile theme toggle (compact) */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle theme"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-300 dark:border-neutral-700 hover:shadow-sm"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* -------------------------- Mobile Drawer -------------------------- */}
      {/* Backdrop */}
      <div
        className={[
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] transition-opacity md:hidden",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        id="mobile-drawer"
        className={[
          "fixed inset-y-0 left-0 z-50 w-[84%] max-w-[22rem] md:hidden",
          "border-r border-neutral-200/60 dark:border-neutral-800/60",
          "bg-white/90 dark:bg-neutral-950/90 backdrop-blur",
          "transition-transform will-change-transform",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between h-16 px-4">
          <Link
            to="/"
            className="font-semibold uppercase"
            onClick={() => setOpen(false)}
          >
            Priscy Designs
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={toggle} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-300 dark:border-neutral-700 hover:shadow-sm active:translate-y-[1px]"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Drawer body */}
        <div className="px-4 pb-24 pt-2 overflow-y-auto">
          <ul className="grid gap-2 text-[15px] font-semibold">
            {site.sections.map((s) => (
              <li key={s.path}>
                <NavLink
                  to={s.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    [
                      "block px-3 py-3 rounded-lg transition",
                      isActive
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                    ].join(" ")
                  }
                >
                  {s.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Drawer footer — resume button pinned to bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200/60 dark:border-neutral-800/60 bg-inherit">
          <Button
            title="My Resume"
            image={arrowIcon}
            className="w-full flex items-center justify-center gap-1 bg-black text-white dark:bg-white dark:text-black rounded-lg px-4 py-3 font-semibold"
            link={site.resumeUrl || "#"}
          />
        </div>
      </aside>
    </header>
  );
}

/* --------------------------- Theme toggle btn --------------------------- */
function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle dark mode"
      className="inline-flex items-center gap-2 h-10 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:shadow-sm active:translate-y-[1px]"
      title={isDark ? "Switch to light" : "Switch to dark"}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span className="text-sm hidden sm:inline">
        {isDark ? "Light" : "Dark"}
      </span>
    </button>
  );
}
