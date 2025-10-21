import { NavLink, Link } from "react-router-dom";
import site from "../data/site.json";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-neutral-950/70 border-b border-neutral-200/60 dark:border-neutral-800/60">
      <nav className="container-px max-w-4xl mx-auto flex items-center justify-between site-border h-20">
        <Link to="/" className="font-semibold">
          Dapo
        </Link>
        <ul className="flex items-center gap-4 text-sm">
          {site.sections.map((s) => (
            <li key={s.path}>
              <NavLink
                to={s.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl transition ${
                    isActive
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                      : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`
                }
              >
                {s.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
