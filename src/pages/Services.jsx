import ImageTiltZoom from "../components/ImageTiltZoom";
import Typewriter from "../components/Typewriter";
import data from "../data/projects.json";

export default function Services() {
  return (
    <main className="container-px py-12 space-y-8">
      <div className="flex flex-col items-center justify-center text-center space-y-3">
        <Typewriter
          text="Services I Offer"
          className="text-2xl font-semibold italic"
          direction="ltr" // left → right
          speed={100}
          delay={0}
        />
        <Typewriter
          text="Transforming Ideas into Innovative Reality, Elevate Your Vision with Our Expert Product Design and Development Services!"
          className="max-w-3xl opacity-90"
          direction="rtl" // right → left
          speed={18}
          delay={500} // start a bit after the heading
        />
      </div>

      <div className="container-px grid md:grid-cols-2 gap-6">
        {data.projects.map((project, i) => (
          <ImageTiltZoom
            key={i}
            src={project.image}
            alt={project.title}
            title={project.title}
            delay={0.06 * i} // subtle stagger for cards is fine too
          />
        ))}
      </div>
    </main>
  );
}
