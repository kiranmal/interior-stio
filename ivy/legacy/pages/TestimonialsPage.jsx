import { ArrowRight, Quote, Star } from "lucide-react";
import { Link } from "react-router-dom";

function TestimonialsPage() {
  const testimonials = [
    {
      name: "Rohit Sharma",
      role: "Homeowner",
      text: "The team understood exactly what we wanted. The final interior looks elegant and is also very practical for our family.",
    },
    {
      name: "Priya Mehta",
      role: "Homeowner",
      text: "From planning to execution, everything was handled professionally. We loved the attention to small details.",
    },
    {
      name: "Amit Verma",
      role: "Business Owner",
      text: "They completely changed the feel of our office. The space now looks modern, comfortable and professional.",
    },
    {
      name: "Neha Singh",
      role: "Homeowner",
      text: "The entire process was smooth and easy to understand. We really liked how the team listened to our requirements.",
    },
    {
      name: "Vikram Kapoor",
      role: "Business Owner",
      text: "Our office now feels much more organised and professional. The design team did a great job with the layout.",
    },
    {
      name: "Sneha Verma",
      role: "Homeowner",
      text: "We wanted a simple and modern home and INARA understood our taste perfectly. The final result feels like our own space.",
    },
  ];

  return (
    <main className="bg-[#fffaf5] pt-28">
      <section className="px-5 pb-16 pt-16 text-center lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
            Client Stories
          </p>

          <h1 className="mt-4 text-5xl font-black text-slate-950 sm:text-6xl">
            What our clients
            <span className="text-orange-500"> say.</span>
          </h1>

          <p className="mt-6 leading-8 text-slate-600">
            Real feedback helps us understand what matters most to the people
            we design spaces for.
          </p>
        </div>
      </section>

      <section className="bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="group rounded-3xl border border-slate-200 bg-[#fffaf5] p-7 transition duration-500 hover:-translate-y-2 hover:border-orange-200 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className="fill-orange-400 text-orange-400"
                    />
                  ))}
                </div>

                <Quote
                  size={28}
                  className="text-orange-200 group-hover:text-orange-400"
                />
              </div>

              <p className="mt-7 text-sm leading-7 text-slate-600">
                "{item.text}"
              </p>

              <div className="mt-7 border-t border-slate-200 pt-5">
                <h2 className="font-bold text-slate-950">{item.name}</h2>
                <p className="mt-1 text-xs text-orange-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-orange-500 px-5 py-20 text-center text-white lg:px-8">
        <h2 className="text-4xl font-black sm:text-5xl">
          Ready to create your space?
        </h2>

        <Link
          to="/contact"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-slate-950 px-7 py-4 font-semibold hover:bg-white hover:text-slate-950"
        >
          Get a Free Consultation
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}

export default TestimonialsPage;