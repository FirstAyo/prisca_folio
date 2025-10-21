import data from '../data/projects.json'

export default function GloryBoard() {
  return (
    <main className="container-px max-w-6xl mx-auto py-12 space-y-6">
      <h2 className="text-2xl font-semibold">Glory board</h2>
      <ul className="space-y-3">
        {data.gloryBoard.map((g) => (
          <li key={g.item} className="card p-5 flex items-center justify_between">
            <span>{g.item}</span>
            <span className="text-sm opacity-70">{g.year}</span>
          </li>
        ))}
      </ul>
    </main>
  )
}