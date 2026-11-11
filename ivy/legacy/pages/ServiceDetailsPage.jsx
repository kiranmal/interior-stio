import { ArrowRight, Check } from "lucide-react";
import { Link, useParams } from "react-router-dom";

function ServiceDetailsPage() {
  const { serviceSlug } = useParams();

  const services = {
    "residential-interior": {
      title: "Residential Interior Design",
      category: "Residential",
      description:
        "Beautiful and practical home interiors designed around your lifestyle, preferences and everyday needs.",
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85",
      points: [
        "Complete home interior planning",
        "Living room and dining design",
        "Bedroom and storage planning",
        "Lighting and colour selection",
        "Furniture and material guidance",
        "Complete project support",
      ],
    },

    "commercial-interior": {
      title: "Commercial Interior Design",
      category: "Commercial",
      description:
        "Professional commercial spaces designed to create a comfortable, functional and impressive environment.",
      image:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85",
      points: [
        "Commercial space planning",
        "Reception and waiting areas",
        "Customer-focused layouts",
        "Lighting and furniture planning",
        "Brand-aligned interior design",
        "Project execution support",
      ],
    },

    "office-interior": {
      title: "Office Interior Design",
      category: "Office",
      description:
        "Modern office interiors designed to support productivity, collaboration and a professional work environment.",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=85",
      points: [
        "Workstation planning",
        "Meeting room design",
        "Reception area design",
        "Storage and utility planning",
        "Lighting and furniture selection",
        "Complete office execution",
      ],
    },

    "modular-kitchen": {
      title: "Modular Kitchen Design",
      category: "Kitchen",
      description:
        "Smart and modern kitchens designed with practical layouts, useful storage and a clean visual style.",
      image:
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85",
      points: [
        "Kitchen layout planning",
        "Modular cabinet design",
        "Smart storage solutions",
        "Countertop and material selection",
        "Lighting planning",
        "Hardware and finishing selection",
      ],
    },

    "bedroom-design": {
      title: "Bedroom Design",
      category: "Bedroom",
      description:
        "Relaxing bedroom interiors created around comfort, storage, lighting and your personal style.",
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85",
      points: [
        "Bedroom layout planning",
        "Wardrobe and storage design",
        "Bed and furniture planning",
        "Lighting design",
        "Colour and material selection",
        "Comfort-focused interior planning",
      ],
    },

    "living-room-design": {
      title: "Living Room Design",
      category: "Living Room",
      description:
        "Warm and welcoming living spaces designed for everyday comfort, family time and entertaining guests.",
      image:
        "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1400&q=85",
      points: [
        "Living room layout planning",
        "Sofa and furniture placement",
        "TV unit and storage design",
        "Lighting planning",
        "Wall and colour treatment",
        "Decor and finishing guidance",
      ],
    },
  };

  const service = services[serviceSlug];

  if (!service) {
    return (
      <main className="min-h-screen bg-[#fffaf5] px-5 pb-20 pt-40">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-black text-slate-950">
            Service not found
          </h1>

          <p className="mt-4 text-slate-600">
            The service you are looking for does not exist.
          </p>

          <Link
            to="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 font-semibold text-white hover:bg-orange-500"
          >
            Back to Services
            <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#fffaf5] pt-28">
      <section className="px-5 pb-20 pt-16 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
                {service.category}
              </p>

              <h1 className="mt-4 text-5xl font-black leading-[1.05] text-slate-950 sm:text-6xl">
                {service.title}
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                {service.description}
              </p>

              <Link
                to="/contact"
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-slate-950 px-7 py-4 font-semibold text-white transition hover:-translate-y-1 hover:bg-orange-500"
              >
                Get a Free Consultation
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-slate-900/10">
              <img
                src={service.image}
                alt={service.title}
                className="h-[520px] w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
              What's Included
            </p>

            <h2 className="mt-3 text-4xl font-black text-slate-950 sm:text-5xl">
              Everything your
              <span className="text-orange-500"> space needs.</span>
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-slate-600">
              We combine thoughtful planning, practical design and careful
              attention to detail to create an interior that works for you.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {service.points.map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-[#fffaf5] p-5"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <Check size={16} />
                </span>

                <p className="text-sm font-medium leading-6 text-slate-700">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-20 text-center text-white lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
            Start Your Project
          </p>

          <h2 className="mt-3 text-4xl font-black sm:text-5xl">
            Let's design a space that feels right for you.
          </h2>

          <p className="mt-5 leading-7 text-white/60">
            Share your requirements with our team and let's discuss your
            project.
          </p>

          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-orange-500 px-7 py-4 font-semibold text-white transition hover:bg-orange-400"
          >
            Talk to Our Team
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default ServiceDetailsPage;