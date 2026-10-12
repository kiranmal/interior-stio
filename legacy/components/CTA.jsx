import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="px-5 py-20 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#174d39] px-7 py-16 sm:px-12 lg:px-16">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />

        <div className="absolute -bottom-24 left-20 h-72 w-72 rounded-full bg-[#75a78c]/10" />

        <div className="relative max-w-3xl">
          <div className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#cfe2d5]">
            <Sparkles size={16} />
            Inspired by Living
          </div>

          <h2 className="text-4xl font-black leading-tight text-white sm:text-5xl">
            Let's create a space you'll love coming home to.
          </h2>

          <p className="mt-5 max-w-2xl leading-7 text-white/75">
            Share your requirements with IVY INTERIO and let's start planning
            an interior that feels right for you.
          </p>

          <Link
            to="/contact"
            className="group mt-8 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 font-semibold text-[#174d39] transition duration-300 hover:-translate-y-1 hover:bg-[#eaf3ed]"
          >
            Get a Free Consultation

            <ArrowRight
              size={18}
              className="transition duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTA;