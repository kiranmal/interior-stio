import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Building2,
  ChefHat,
  Home,
  LampCeiling,
  Sofa,
} from "lucide-react";
import { Link } from "react-router-dom";

function ServicesPage() {
  const services = [
    {
      icon: Home,
      number: "01",
      title: "Residential Interiors",
      description:
        "Complete home interiors designed around your lifestyle, comfort and personal taste.",
      features: [
        "Complete home design",
        "Space planning",
        "Furniture and lighting",
        "Material selection",
      ],
    },
    {
      icon: Building2,
      number: "02",
      title: "Commercial Interiors",
      description:
        "Professional commercial spaces designed to create a strong experience for customers and teams.",
      features: [
        "Office interiors",
        "Retail spaces",
        "Space planning",
        "Brand-focused design",
      ],
    },
    {
      icon: ChefHat,
      number: "03",
      title: "Modular Kitchens",
      description:
        "Smart and practical kitchens with modern layouts, useful storage and clean finishes.",
      features: [
        "Modular layouts",
        "Storage planning",
        "Countertop selection",
        "Lighting solutions",
      ],
    },
    {
      icon: BedDouble,
      number: "04",
      title: "Bedroom Design",
      description:
        "Relaxing bedrooms designed with the right balance of comfort, storage and style.",
      features: [
        "Wardrobe design",
        "Bed and furniture layout",
        "Lighting",
        "Colour planning",
      ],
    },
    {
      icon: Sofa,
      number: "05",
      title: "Living Room Design",
      description:
        "Warm and welcoming living spaces designed for everyday life and entertaining guests.",
      features: [
        "Furniture planning",
        "TV unit design",
        "Lighting",
        "Decor planning",
      ],
    },
    {
      icon: LampCeiling,
      number: "06",
      title: "Custom Interior Solutions",
      description:
        "Personalised solutions for spaces that need something different from the usual approach.",
      features: [
        "Custom furniture",
        "Lighting concepts",
        "Decor solutions",
        "Space optimisation",
      ],
    },
  ];

  const process = [
    {
      number: "01",
      title: "Consultation",
      text: "We understand your requirements, preferences, space and budget.",
    },
    {
      number: "02",
      title: "Design",
      text: "Our team develops a design direction based on your needs.",
    },
    {
      number: "03",
      title: "Execution",
      text: "We coordinate the work and keep the project moving as planned.",
    },
    {
      number: "04",
      title: "Handover",
      text: "We complete the final details and prepare the space for you.",
    },
  ];

  return (
    <main className="bg-[#fffaf5] pt-28">
      {/* Hero */}
      <section className="px-5 pb-20 pt-16 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
                Our Services
              </p>

              <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Interiors designed
                <span className="block text-orange-500">
                  for the way you live.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                From complete homes to individual spaces, we create interiors
                that combine practical planning with a thoughtful design
                approach.
              </p>

              <Link
                to="/contact"
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-slate-950 px-7 py-4 font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-orange-500"
              >
                Discuss Your Project
                <ArrowRight
                  size={18}
                  className="transition duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[2rem] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85"
                  alt="Interior design"
                  className="h-[500px] w-full object-cover transition duration-700 hover:scale-105 sm:h-[580px]"
                />
              </div>

              <div className="absolute bottom-6 left-6 rounded-2xl bg-white/95 px-6 py-5 shadow-xl backdrop-blur-md">
                <p className="text-3xl font-black text-slate-950">250+</p>
                <p className="mt-1 text-sm text-slate-500">
                  Projects completed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
              What We Offer
            </p>

            <h2 className="text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              Design services for
              <span className="text-orange-500"> every space.</span>
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              Whether you are planning an entire home or refreshing one room,
              our services can be tailored around your project.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.number}
                  className="group rounded-3xl border border-slate-200 bg-[#fffaf5] p-7 transition duration-500 hover:-translate-y-2 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm transition duration-300 group-hover:bg-orange-500 group-hover:text-white">
                      <Icon size={26} />
                    </div>

                    <span className="text-4xl font-black text-slate-100 group-hover:text-orange-100">
                      {service.number}
                    </span>
                  </div>

                  <h3 className="mt-8 text-xl font-bold text-slate-950">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {service.description}
                  </p>

                  <div className="mt-6 space-y-2">
                    {service.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-sm text-slate-600"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/contact"
                    className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-orange-500"
                  >
                    Enquire Now
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-slate-950 px-5 py-24 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
              Our Process
            </p>

            <h2 className="text-4xl font-black leading-tight sm:text-5xl">
              Simple from
              <span className="text-orange-400"> start to finish.</span>
            </h2>

            <p className="mt-5 leading-7 text-white/60">
              We keep the process clear so you know what is happening at every
              stage of your project.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {process.map((item) => (
              <div
                key={item.number}
                className="rounded-3xl border border-white/10 bg-white/5 p-7 transition duration-500 hover:-translate-y-2 hover:border-orange-400/40 hover:bg-white/10"
              >
                <span className="text-4xl font-black text-orange-400">
                  {item.number}
                </span>

                <h3 className="mt-8 text-xl font-bold">{item.title}</h3>

                <p className="mt-3 text-sm leading-6 text-white/60">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-orange-500 px-7 py-14 sm:px-12 lg:px-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/70">
                Start Your Project
              </p>

              <h2 className="mt-3 text-4xl font-black text-white sm:text-5xl">
                Let's design your space.
              </h2>

              <p className="mt-4 leading-7 text-white/80">
                Share your requirements with us and let's discuss how we can
                bring your ideas to life.
              </p>
            </div>

            <Link
              to="/contact"
              className="group inline-flex w-fit items-center gap-3 rounded-full bg-slate-950 px-7 py-4 font-semibold text-white transition hover:-translate-y-1 hover:bg-white hover:text-slate-950"
            >
              Get Free Consultation
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ServicesPage;