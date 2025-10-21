import site from '../data/site.json'

export default function OpenForWork() {
  return (
    <main className="container-px max-w-6xl mx-auto py-12 space-y-6">
      <h2 className="text-2xl font-semibold">Open for work</h2>
      <p className="opacity-80">I’m currently open to roles and freelance engagements. Feel free to reach out.</p>
      <div className="flex items-center gap-3">
        <a className="btn border-neutral-900 dark:border-white" href={`mailto:${site.email}`}>Email me</a>
      </div>
    </main>
  )
}