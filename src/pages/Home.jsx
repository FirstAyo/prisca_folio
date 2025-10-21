import { motion } from "framer-motion";
import EmailCopy from "../components/EmailCopy.jsx";
import site from "../data/site.json";
import ProjectCard from "../components/ProjectCard.jsx";
import data from "../data/projects.json";

export default function Home() {
  return (
    <main className="px-3 py-16 space-y-14">
      <div className="space-y-3 lg:w-[50%] mx-auto flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="leading-snug text-4xl italic"
        >
          {site.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="leading-snug text-center"
        >
          {site.introHeadline}
        </motion.p>

        <div className="flex items-center gap-3 mt-3">
          <a
            href={site.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="btn border-neutral-900 dark:border-white"
          >
            View my resume
          </a>
          <EmailCopy email={site.email} />
        </div>
      </div>
      <motion.section
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: {} }}
        className="grid sm:grid-cols-2 gap-5"
      >
        {data.projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} i={i} />
        ))}
      </motion.section>
    </main>
  );
}
