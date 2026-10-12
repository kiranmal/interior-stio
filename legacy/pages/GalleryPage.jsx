import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function GalleryPage() {
  const gallery = [
    {
      title: "Modern Living Room",
      category: "Living Room",
      image:
        "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=90",
    },
    {
      title: "Contemporary Kitchen",
      category: "Kitchen",
      image:
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=90",
    },
    {
      title: "Luxury Bedroom",
      category: "Bedroom",
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=90",
    },
    {
      title: "Creative Office",
      category: "Commercial",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=90",
    },
    {
      title: "Elegant Dining Space",
      category: "Dining",
      image:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=90",
    },
    {
      title: "Minimal Interior",
      category: "Residential",
      image:
        "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=90",
    },
    {
      title: "Warm Bedroom",
      category: "Bedroom",
      image:
        "https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=1200&q=90",
    },
    {
      title: "Modern Workspace",
      category: "Office",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=90",
    },
  ];

  return (
    <main className="bg-[#f8f5ef] pt-28">
      <section className="px-5 pb-16 pt-16 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#1f6b4d]">
            IVY INTERIO Gallery
          </p>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-[#17382b] sm:text-6xl">
                A closer look at
                <span className="text-[#1f6b4d]"> our design work.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Explore interiors created for homes, kitchens, bedrooms,
                living spaces and offices.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#174d39] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#236b4d]"
            >
              Start Your Project
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {gallery.map((item) => (
              <div
                key={item.title}
                className="group relative mb-5 break-inside-avoid overflow-hidden rounded-3xl bg-slate-900"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#9ed0b1]">
                      {item.category}
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-white">
                      {item.title}
                    </h2>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#174d39] transition group-hover:bg-[#1f6b4d] group-hover:text-white">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f5ef] px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#174d39] px-7 py-14 text-center sm:px-12">
          <h2 className="text-4xl font-black text-white sm:text-5xl">
            Inspired by what you see?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/75">
            Let's create a space designed specifically around your lifestyle,
            taste and requirements.
          </p>

          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 font-semibold text-[#174d39] transition hover:-translate-y-1 hover:bg-[#eaf3ed]"
          >
            Get a Free Consultation
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default GalleryPage;