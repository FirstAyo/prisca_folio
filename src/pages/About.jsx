import ImageTiltZoomRight from "../components/ImageTiltZoomRight";
import data from "../data/projects.json";

export default function About() {
  return (
    <main className="container-px space-y-6">
      {/* <h2 className="text-2xl font-semibold">The park</h2> */}

      <div className="container-px max-w-5xl mx-auto py-12 grid md:grid-cols-2 gap-6">
        {data.projects.map((project, i) => (
          <ImageTiltZoomRight
            key={project.slug ?? i}
            src={project.image}
            alt={project.title}
            title={project.title}
            delay={i * 0.20} // stagger the slide-in
            maxTilt={6}
          />
        ))}
      </div>
    </main>
  );
}
