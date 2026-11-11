import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";

function ProjectDetailsPage() {
  const { projectSlug } = useParams();

  const projects = {
    "modern-family-home": {
      title: "Modern Family Home",
      category: "Residential",
      location: "Noida",
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85",
      description:
        "A warm and contemporary family home designed with comfortable living spaces, practical storage and a clean modern look.",
    },

    "contemporary-living-space": {
      title: "Contemporary Living Space",
      category: "Residential",
      location: "Delhi",
      image:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
      description:
        "A refined living space combining natural materials, comfortable furniture and a simple contemporary design.",
    },

    "elegant-office-interior": {
      title: "Elegant Office Interior",
      category: "Commercial",
      location: "Gurugram",
      image:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85",
      description:
        "A professional office environment designed to balance productivity, collaboration and a welcoming atmosphere.",
    },

    "minimal-luxury-kitchen": {
      title: "Minimal Luxury Kitchen",
      category: "Kitchen",
      location: "Lucknow",
      image:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
      description:
        "A modern kitchen focused on clean lines, smart storage and an elegant combination of materials.",
    },
  };

  const project = projects[projectSlug];

  if (!project) {
    return (
      <main className="min-h-screen bg-[#fffaf5] px-5 pb-20 pt-40">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-black text-slate-950">
            Project not found
          </h1>

          <Link
            to="/projects"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 font-semibold text-white hover:bg-orange-500"
          >
            Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#fffaf5] pt-28">
      <section className="px-5 pb-20 pt-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-orange-500"
          >
            <ArrowLeft size={17} />
            Back to Projects
          </Link>

          <div className="mt-8 overflow-hidden rounded-[2rem]">
            <img
              src={project.image}
              alt={project.title}
              className="h-[500px] w-full object-cover sm:h-[650px]"
            />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.45fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
                {project.category}
              </p>

              <h1 className="mt-3 text-5xl font-black leading-tight text-slate-950 sm:text-6xl">
                {project.title}
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                {project.description}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                Project Details
              </p>

              <div className="mt-6 border-b border-slate-100 pb-5">
                <p className="text-xs text-slate-400">Category</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {project.category}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-xs text-slate-400">Location</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {project.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-20 text-center text-white lg:px-8">
        <h2 className="text-4xl font-black sm:text-5xl">
          Have a similar project in mind?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/60">
          Tell us what you are looking for and our team will help you plan the
          right interior for your space.
        </p>

        <Link
          to="/contact"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-orange-500 px-7 py-4 font-semibold transition hover:bg-orange-400"
        >
          Start Your Project
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}

export default ProjectDetailsPage;