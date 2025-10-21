import { motion } from "framer-motion";

export default function ProjectCard({ project, i }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: i * 0.06 }}
      className="card flex flex-col justify-between"
    >
      <div className="flex flex-col mb-2">
        <img
          src={project.image}
          alt={project.title}
          className="h-96 w-full p-3 object-fit"
        />
        <div className="flex items-center justify-between border-t border-b border-neutral-200/60 p-5">
          <h3 className="text-lg font-semibold">{project.title}</h3>
          <span className="text-sm opacity-70">{project.year}</span>
        </div>
      </div>
      <div>
        <p className="text-sm opacity-80 mb-4 px-4">{project.summary}</p>
        <div className="flex items-center gap-2 flex-wrap p-4">
          <span className="text-xs rounded-full px-4 py-1 border border-neutral-300 dark:border-neutral-700">
            {String(project.status).toUpperCase()}
          </span>
          {project.tags.map((t) => (
            <span
              key={t}
              className="text-xs rounded-full px-3 py-1 bg-neutral-100 dark:bg-neutral-800"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
