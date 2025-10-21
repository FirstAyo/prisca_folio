import { motion } from 'framer-motion'
import ProjectCard from '../components/ProjectCard.jsx'
import data from '../data/projects.json'

export default function Work() {
  return (
    <main className="container-px py-12 space-y-6">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-semibold">Work</h2>
        <span className="text-sm opacity-70">{data.projects.length} projects</span>
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
  )
}