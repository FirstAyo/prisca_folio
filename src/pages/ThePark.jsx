import data from '../data/projects.json'

export default function ThePark() {
  return (
    <main className="container-px max-w-6xl mx-auto py-12 space-y-6">
      <h2 className="text-2xl font-semibold">The park</h2>
      <ul className="grid sm:grid-cols-2 gap-5">
        {data.park.map((p) => (
          <li key={p.title} className="card p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold">{p.title}</h3>
              <span className="text-sm opacity-70">{p.date}</span>
            </div>
            <p className="text-sm opacity-80">A quick note from the park.</p>
          </li>
        ))}
      </ul>
    </main>
  )
}