import { NavLink, Link } from "react-router-dom";
import site from "../data/site.json";
import Button from "./Button";
import arrowIcon from "/assets/arrow-up-right.svg";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur dark:bg-neutral-950/70 border-b border-neutral-200/60 dark:border-neutral-800/60">
      <nav className="container-px max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-around lg:justify-between site-border md:h-20 py-2 md:py-0 dark:text-neutral-100">
        <Link to="/" className="font-semibold py-2 text-white uppercase">
          Priscy Designs
        </Link>
        <div className="bg-gray-600 py-2 rounded-xl">
          <ul className="flex items-center gap-4 text-md font-semibold py-1 px-2">
            {site.sections.map((s) => (
              <li key={s.path}>
                <NavLink
                  to={s.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg transition ${
                      isActive
                        ? "bg-white text-black dark:bg-white dark:text-black"
                        : "hover:bg-white hover:text-black dark:hover:bg-neutral-800"
                    }`
                  }
                >
                  {s.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <Button
          title="My resume"
          image={arrowIcon}
          className="flex items-center gap-1 bg-white text-black rounded-lg px-4 py-2 font-semibold"
          link="#"
        />
      </nav>
    </header>
  );
}
