import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function ProjectsPage() {
  const projects = [
    {
      title: "Modern Family Home",
      category: "Residential",
      location: "Noida",
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85",
    },
    {
      title: "Contemporary Living Space",
      category: "Residential",
      location: "Delhi",
      image:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
    },
    {
      title: "Elegant Office Interior",
      category: "Commercial",
      location: "Gurugram",
      image:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85",
    },
    {
      title: "Minimal Luxury Kitchen",
      category: "Kitchen",
      location: "Lucknow",
      image:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
    },
    {
      title: "Warm Modern Bedroom",
      category: "Bedroom",
      location: "New Delhi",
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85",
    },
    {
      title: "Premium Workspace",
      category: "Commercial",
      location: "Gurugram",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85",
    },
  ];

  return (
    <main className="bg-[#fffaf5] pt-28">
      {/* Hero */}
      <section className="px-5 pb-20 pt-16 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
            Our Projects
          </p>

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-6xl">
                Spaces we've
                <span className="text-orange-500"> brought to life.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Explore a selection of residential and commercial interiors
                created with a balance of personality, functionality and
                timeless design.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-orange-500"
            >
              Start a Project
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.title}
                className="group relative overflow-hidden rounded-[2rem] bg-slate-900"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-[430px] w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <div className="flex items-end justify-between gap-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-orange-400">
                        {project.category}
                      </p>

                      <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                        {project.title}
                      </h2>

                      <p className="mt-2 text-sm text-white/60">
                        {project.location}
                      </p>
                    </div>

                    <button
                      aria-label={`View ${project.title}`}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-slate-950 transition duration-300 group-hover:bg-orange-500 group-hover:text-white"
                    >
                      <ArrowUpRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#fffaf5] px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-5 lg:grid-cols-4">
          {[
            ["250+", "Projects"],
            ["100+", "Happy Clients"],
            ["10+", "Years Experience"],
            ["15+", "Design Professionals"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center"
            >
              <h3 className="text-3xl font-black text-slate-950">{value}</h3>
              <p className="mt-2 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-slate-950 px-7 py-14 text-center sm:px-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
            Your Project Could Be Next
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black text-white sm:text-5xl">
            Let's create something that feels uniquely yours.
          </h2>

          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-orange-500 px-7 py-4 font-semibold text-white transition hover:-translate-y-1 hover:bg-orange-400"
          >
            Get a Free Consultation
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default ProjectsPage;