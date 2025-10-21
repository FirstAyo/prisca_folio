import { NavLink, Link } from "react-router-dom";
import site from "../data/site.json";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur dark:bg-neutral-950/70 border-b border-neutral-200/60 dark:border-neutral-800/60">
      <nav className="container-px max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-around lg:justify-between site-border md:h-20 py-2 md:py-0">
        <Link to="/" className="font-semibold py-2 text-amber-100">
          Priscy Designs
        </Link>
        <div className="bg-gray-100 py-2 px-2 rounded-full">
          <ul className="flex items-center gap-4 text-sm bg-white py-3 rounded-full px-2 shadow-2xl">
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
        </div>
      </nav>
    </header>
  );
}
