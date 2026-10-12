import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function HeroBanner() {
  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=90",
      label: "Residential Interiors",
      title: "Spaces made to feel like home.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=90",
      label: "Modern Kitchens",
      title: "Beautiful design. Smarter living.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=90",
      label: "Luxury Living",
      title: "Interiors designed around you.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=90",
      label: "Commercial Interiors",
      title: "Workspaces with a better identity.",
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const changeSlide = (index) => {
    setIsVisible(false);

    setTimeout(() => {
      setActiveSlide(index);
      setIsVisible(true);
    }, 250);
  };

  const nextSlide = () => {
    changeSlide((activeSlide + 1) % slides.length);
  };

  const previousSlide = () => {
    changeSlide((activeSlide - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[activeSlide];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#17382b] pt-24">
      <div
        className={`absolute inset-0 transition-all duration-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <img
          src={slide.image}
          alt={slide.title}
          className="hero-image h-full w-full object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-[#102d22]/85 via-[#17382b]/45 to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#102d22]/70 via-transparent to-transparent" />

      <div className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl items-end px-5 pb-12 sm:pb-16 lg:px-8 lg:pb-20">
        <div
          className={`max-w-2xl text-white transition-all duration-700 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-5 opacity-0"
          }`}
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-white/80" />

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/90">
              {slide.label}
            </p>
          </div>

          <h1 className="max-w-2xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            {slide.title}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
            Thoughtful interiors for homes, offices and commercial spaces by
            Ivy Interio.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#174d39] transition duration-300 hover:-translate-y-1 hover:bg-[#eaf3ed]"
            >
              Explore Projects
              <ArrowUpRight
                size={17}
                className="transition duration-300 group-hover:rotate-45"
              />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-3 rounded-full border border-white/50 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition duration-300 hover:bg-white hover:text-[#174d39]"
            >
              Get a Consultation
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-5 flex items-center gap-3 sm:right-8 lg:right-10">
        <button
          onClick={previousSlide}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/10 text-white backdrop-blur-md transition hover:bg-white hover:text-[#174d39]"
          aria-label="Previous slide"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {slides.map((item, index) => (
            <button
              key={item.label}
              onClick={() => changeSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeSlide
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/10 text-white backdrop-blur-md transition hover:bg-white hover:text-[#174d39]"
          aria-label="Next slide"
        >
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="absolute bottom-8 left-5 hidden text-xs font-semibold uppercase tracking-[0.2em] text-white/60 sm:block lg:left-8">
        Ivy Interio · Inspired by Living
      </div>
    </section>
  );
}

export default HeroBanner;