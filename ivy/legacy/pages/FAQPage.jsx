import { useState } from "react";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";

function FAQPage() {
  const questions = [
    {
      question: "How does the interior design process work?",
      answer:
        "We start with a consultation to understand your requirements, budget and preferences. After that, our team works on the design, planning, execution and final handover.",
    },
    {
      question: "Do you provide complete home interiors?",
      answer:
        "Yes. We can work on complete home interiors as well as individual spaces such as living rooms, bedrooms, kitchens and other areas.",
    },
    {
      question: "Can I share my own design ideas?",
      answer:
        "Absolutely. Your ideas and preferences are an important part of the design process. We work with you to turn those ideas into a practical interior.",
    },
    {
      question: "How long does an interior project take?",
      answer:
        "The timeline depends on the size and scope of the project. After understanding your requirements, we provide a clear estimated timeline.",
    },
    {
      question: "Can I get a consultation before starting?",
      answer:
        "Yes. You can contact us through the enquiry form and our team will get in touch to discuss your project.",
    },
    {
      question: "Do you handle project execution?",
      answer:
        "Yes. Depending on the project, our team can support planning, material coordination, execution and final finishing.",
    },
    {
      question: "Do you provide modular kitchen design?",
      answer:
        "Yes. We design modular kitchens based on the available space, storage requirements, preferred materials and overall home style.",
    },
    {
      question: "How can I start a project with INARA?",
      answer:
        "Simply contact us through the enquiry form. Share some basic information about your project and our team will contact you.",
    },
  ];

  const [activeQuestion, setActiveQuestion] = useState(0);

  return (
    <main className="bg-[#fffaf5] pt-28">
      <section className="px-5 pb-16 pt-16 text-center lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
            FAQ
          </p>

          <h1 className="mt-4 text-5xl font-black text-slate-950 sm:text-6xl">
            Questions?
            <span className="text-orange-500"> We have answers.</span>
          </h1>

          <p className="mt-6 leading-8 text-slate-600">
            Find answers to some of the most common questions about our
            interior design services.
          </p>
        </div>
      </section>

      <section className="bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-4">
          {questions.map((item, index) => {
            const isOpen = activeQuestion === index;

            return (
              <div
                key={item.question}
                className="rounded-2xl border border-slate-200 bg-[#fffaf5]"
              >
                <button
                  onClick={() =>
                    setActiveQuestion(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
                >
                  <span className="font-semibold text-slate-900">
                    {item.question}
                  </span>

                  <span className="shrink-0 text-orange-500">
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-200 px-6 pb-6 pt-4">
                    <p className="text-sm leading-7 text-slate-600">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-20 text-center text-white lg:px-8">
        <h2 className="text-4xl font-black sm:text-5xl">
          Still have a question?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-white/60">
          Our team will be happy to discuss your project and answer your
          questions.
        </p>

        <Link
          to="/contact"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-orange-500 px-7 py-4 font-semibold hover:bg-orange-400"
        >
          Contact Us
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}

export default FAQPage;