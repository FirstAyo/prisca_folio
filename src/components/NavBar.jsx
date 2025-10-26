import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import menuItems from "../data/menu.json";
import Button from "./Button";
import { Menu, MoonIcon, SunIcon, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle.jsx";
import arrowIcon from "/assets/arrow-up-right.svg";

export default function NavBar() {
  // MOBILE MENU
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleBtnRef = useRef(null);
  const drawerRef = useRef(null);

  const openMobile = () => setMobileOpen(true);
  const closeMobile = () => setMobileOpen(false);
  const toggleMobile = () => setMobileOpen((o) => !o);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Focus management & Esc to close for dialog
  useEffect(() => {
    if (!mobileOpen) {
      // return focus to toggle button
      toggleBtnRef.current?.focus();
      return;
    }
    // move focus into the drawer
    drawerRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMobile();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const menuData = menuItems.data;

  return (
    <>
      {/* Skip link for keyboard users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-white focus:text-black focus:px-3 focus:py-2 rounded"
      >
        Skip to content
      </a>

      <header
        className="sticky top-0 z-40 backdrop-blur dark:bg-neutral-950/70 border-b border-[hsl(var(--border))]/60 dark:border-neutral-800/60"
        aria-label="Site header"
      >
        <div className="">
          <nav
            className="container-px max-w-4xl mx-auto flex items-center justify-between py-4 h-20 site-border"
            aria-label="Primary"
          >
            {/* Brand */}
            <div>
              <Link
                to="/"
                className="font-bold text-xl dark:text-gray-100"
                onClick={closeMobile}
              >
                Priscy
                <span className="text-[hsl(var(--primary))]">Designs</span>
              </Link>
            </div>

            {/* Desktop menu */}
            <ul
              className="hidden lg:flex lg:flex-row gap-2 text-md font-medium text-[hsl(var(--primary-fg))] dark:text-gray-300 bg-gray-600 rounded-lg py-2 px-0.5 border border-[hsl(var(--border))]"
              role="list"
            >
              {menuData.map((item) => (
                <li key={item.id} className="list-none">
                  <NavLink
                    to={item.link}
                    className={({ isActive }) =>
                      [
                        "px-3 py-2 rounded-lg transition",
                        isActive
                          ? "bg-white text-black dark:bg-white dark:text-black"
                          : "hover:bg-white hover:text-black dark:hover:bg-neutral-800",
                      ].join(" ")
                    }
                  >
                    {item.title}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-4">
              <ThemeToggle className="" />

              <Button
                title="My Resume"
                image={arrowIcon}
                className="flex items-center gap-1 bg-white text-black rounded-lg px-4 py-2 font-semibold"
                link="#"
              />
            </div>

            {/* Mobile toggle */}
            <button
              ref={toggleBtnRef}
              type="button"
              onClick={toggleMobile}
              className="lg:hidden border border-[hsl(var(--border))] dark:border-neutral-700 rounded-lg py-1 px-3 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-neutral-900"
              aria-controls="mobile-drawer"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <X strokeWidth={0.75} />
              ) : (
                <Menu strokeWidth={1.25} />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Backdrop (presentational) */}
      <button
        type="button"
        onClick={closeMobile}
        aria-hidden="true"
        tabIndex={-1}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile Drawer */}
      <aside
        id="mobile-drawer"
        ref={drawerRef}
        tabIndex={-1}
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85%] lg:hidden
                    bg-white dark:bg-neutral-900 border-r border-[hsl(var(--border))] dark:border-neutral-800
                    transition-transform duration-300 ease-out
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-title"
      >
        {/* Top: Brand */}
        <div className="px-5 pt-4 pb-3 border-b border-[hsl(var(--border))] dark:border-neutral-800">
          <Link
            to="/"
            className="font-bold text-2xl text-gray-900 dark:text-gray-100"
            id="mobile-title"
            onClick={closeMobile}
          >
            Priscy<span className="text-[hsl(var(--primary))]">Designs</span>
          </Link>
        </div>

        {/* Middle: Menu items */}
        <nav className="px-3 py-4" aria-label="Mobile menu">
          <ul
            className="flex flex-col gap-2 text-lg font-medium text-gray-700 dark:text-gray-300"
            role="list"
          >
            {menuData.map((item) => (
              <li key={item.id} className="list-none">
                <Link
                  to={item.link}
                  onClick={closeMobile}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom: Actions */}
        <div className="mt-auto absolute bottom-0 left-0 right-0 border-t border-[hsl(var(--border))] dark:border-neutral-800 p-4 flex flex-col justify-between gap-3">
          <ThemeToggle className="" />

          <Button
            title="My Resume"
            image={arrowIcon}
            className="flex items-center justify-center gap-1 bg-white text-black px-4 py-2 font-semibold border border-[hsl(var(--border))] dark:border-neutral-700 rounded-lg"
            link="#"
          />
        </div>
      </aside>
    </>
  );
}
