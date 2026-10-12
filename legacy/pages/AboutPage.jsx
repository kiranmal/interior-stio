import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function AboutPage() {
  const values = [
    {
      title: "Personalised Design",
      text: "Every project starts by understanding your lifestyle, taste and requirements.",
    },
    {
      title: "Functional Spaces",
      text: "We focus on creating interiors that look beautiful and work well every day.",
    },
    {
      title: "Attention to Detail",
      text: "From layouts and lighting to materials and finishes, every detail matters.",
    },
  ];

  return (
    <main className="bg-[#f8f5ef] pt-28">
      <section className="px-5 pb-20 pt-16 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1f6b4d]">
              About IVY INTERIO
            </p>

            <h1 className="mt-4 text-5xl font-black leading-[1.05] text-[#17382b] sm:text-6xl">
              Inspired by living,
              <span className="block text-[#1f6b4d]">
                designed with purpose.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              IVY INTERIO is an interior design studio creating thoughtful
              spaces for modern homes, offices and commercial environments.
            </p>

            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#174d39] px-7 py-4 font-semibold text-white transition hover:-translate-y-1 hover:bg-[#236b4d]"
            >
              Start Your Project
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="overflow-hidden rounded-[2rem] shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=90"
              alt="IVY INTERIO interior"
              className="h-[500px] w-full object-cover transition duration-700 hover:scale-105"
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1f6b4d]">
                Our Approach
              </p>

              <h2 className="mt-3 text-4xl font-black text-[#17382b] sm:text-5xl">
                More than just beautiful interiors.
              </h2>
            </div>

            <div>
              <p className="leading-8 text-slate-600">
                At IVY INTERIO, we believe a good interior should reflect the
                people who use it. That means understanding how a space will
                be used before deciding how it should look.
              </p>

              <p className="mt-5 leading-8 text-slate-600">
                Our design process combines creativity, functionality and
                practical planning to create spaces that feel personal,
                comfortable and timeless.
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-3xl border border-slate-200 bg-[#fbfaf7] p-7 transition duration-500 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6f2ea] text-[#174d39]">
                  <Sparkles size={20} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-950">
                  {value.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {value.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#174d39] px-7 py-14 sm:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#cfe2d5]">
              <Check size={17} />
              IVY INTERIO
            </div>

            <h2 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl">
              Let's create an interior that feels like yours.
            </h2>

            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 font-semibold text-[#174d39] transition hover:-translate-y-1 hover:bg-[#eaf3ed]"
            >
              Get a Consultation
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;