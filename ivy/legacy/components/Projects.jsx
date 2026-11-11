import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function Projects() {
  const projects = [
    {
      title: "Modern Family Home",
      category: "Residential Interior",
      location: "Noida",
      slug: "modern-family-home",
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=90",
    },
    {
      title: "Contemporary Living Space",
      category: "Living Room",
      location: "Delhi",
      slug: "contemporary-living-space",
      image:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=90",
    },
    {
      title: "Elegant Office Interior",
      category: "Office Interior",
      location: "Gurugram",
      slug: "elegant-office-interior",
      image:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=90",
    },
    {
      title: "Minimal Luxury Kitchen",
      category: "Modular Kitchen",
      location: "Lucknow",
      slug: "minimal-luxury-kitchen",
      image:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=90",
    },
  ];

  return (
    <section id="projects" className="bg-[#f8f5ef] px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#1f6b4d]">
              Our Projects
            </p>

            <h2 className="text-4xl font-black leading-tight text-[#17382b] sm:text-5xl">
              Spaces we have
              <span className="text-[#1f6b4d]"> brought to life.</span>
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              Explore our interior work across homes, living spaces, kitchens
              and offices.
            </p>
          </div>

          <Link
            to="/projects"
            className="group flex w-fit items-center gap-2 rounded-full border border-[#a9c4b4] px-5 py-3 text-sm font-semibold text-[#174d39] transition duration-300 hover:bg-[#174d39] hover:text-white"
          >
            View All Projects

            <ArrowUpRight
              size={17}
              className="transition duration-300 group-hover:rotate-45"
            />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.slug}
              to={`/projects/${project.slug}`}
              className="group relative overflow-hidden rounded-[2rem] bg-slate-900"
            >
              <img
                src={project.image}
                alt={project.title}
                className="h-[420px] w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-7">
                <div className="flex items-end justify-between gap-5">
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-[#9ed0b1]">
                      {project.category}
                    </p>

                    <h3 className="text-2xl font-bold text-white">
                      {project.title}
                    </h3>

                    <p className="mt-2 text-sm text-white/70">
                      {project.location}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#174d39] transition duration-300 group-hover:bg-[#1f6b4d] group-hover:text-white">
                    <ArrowUpRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;