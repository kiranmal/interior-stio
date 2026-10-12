import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";

function ContactPage() {
  return (
    <main className="bg-[#f8f5ef] pt-28">
      <section className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1f6b4d]">
              Contact IVY INTERIO
            </p>

            <h1 className="mt-4 text-5xl font-black leading-[1.05] text-[#17382b] sm:text-6xl">
              Let's talk about your
              <span className="text-[#1f6b4d]"> space.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Whether you are planning a new home interior, kitchen, bedroom,
              office or commercial space, we would love to understand your
              requirements.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-4">
          <a
            href="tel:+919758887602"
            className="group rounded-3xl border border-slate-200 bg-[#fbfaf7] p-7 transition hover:-translate-y-2 hover:border-[#b8d1c1] hover:shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6f2ea] text-[#174d39]">
              <Phone size={21} />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-400">
              Call Us
            </p>

            <p className="mt-2 font-bold text-slate-900">
              9758887602
            </p>
          </a>

          <a
            href="https://wa.me/919540937851"
            target="_blank"
            rel="noreferrer"
            className="group rounded-3xl border border-slate-200 bg-[#fbfaf7] p-7 transition hover:-translate-y-2 hover:border-[#b8d1c1] hover:shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6f2ea] text-[#174d39]">
              <MessageCircle size={21} />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-400">
              WhatsApp
            </p>

            <p className="mt-2 font-bold text-slate-900">
              9540937851
            </p>
          </a>

          <a
            href="mailto:ivinterio@gmail.com"
            className="group rounded-3xl border border-slate-200 bg-[#fbfaf7] p-7 transition hover:-translate-y-2 hover:border-[#b8d1c1] hover:shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6f2ea] text-[#174d39]">
              <Mail size={21} />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-400">
              Email
            </p>

            <p className="mt-2 break-all font-bold text-slate-900">
              ivinterio@gmail.com
            </p>
          </a>

          <div className="rounded-3xl border border-slate-200 bg-[#fbfaf7] p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6f2ea] text-[#174d39]">
              <MapPin size={21} />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-wider text-slate-400">
              Studio
            </p>

            <p className="mt-2 font-bold leading-6 text-slate-900">
              G16, Lotus Pond Market, Vaibhav Khand, Indirapuram, Ghaziabad -
              201014
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#174d39] px-7 py-14 text-center sm:px-12">
          <h2 className="text-4xl font-black text-white sm:text-5xl">
            Ready to transform your space?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/75">
            Get in touch with IVY INTERIO and start planning your interior
            project.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="tel:+919758887602"
              className="rounded-full bg-white px-7 py-4 font-bold text-[#174d39] transition hover:bg-[#eaf3ed]"
            >
              Call 9758887602
            </a>

            <a
              href="https://wa.me/919540937851"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/30 px-7 py-4 font-bold text-white transition hover:bg-white hover:text-[#174d39]"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 text-center">
        <p className="text-sm text-slate-500">
          Looking for interior design in Indirapuram, Ghaziabad and nearby
          areas?
        </p>

        <Link
          to="/services"
          className="mt-3 inline-block font-bold text-[#1f6b4d] hover:underline"
        >
          Explore Our Interior Services
        </Link>
      </section>
    </main>
  );
}

export default ContactPage;