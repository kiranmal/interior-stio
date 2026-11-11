import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";

function TermsPage() {
  return (
    <main className="bg-[#fffaf5] px-5 pb-24 pt-36 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mt-4 text-5xl font-black text-slate-950">
          Terms & Conditions — LOCAL TEST 123
        </h1>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
          Legal
        </p>

        <h1 className="mt-4 text-5xl font-black text-slate-950">
          Terms & Conditions
        </h1>

        <p className="mt-5 text-sm text-slate-500">Last updated: June 2026</p>

        <div className="mt-12 space-y-10 text-slate-600">
          <section>
            <h2 className="text-2xl font-bold text-slate-950">
              1. General Information & Website Use
            </h2>

            <p className="mt-4 leading-7">
              ​The content published on this website is for general
              informational and marketing purposes regarding our interior
              design, architectural finishes, painting, and turnkey execution
              services. ​General Information & Website Use ​The content
              published on this website is for general informational and
              marketing purposes regarding our interior design, architectural
              finishes, painting, and turnkey execution services. ​We reserve
              the right to modify, suspend, or discontinue any aspect of the
              website, services, or portfolio displays at any time without prior
              notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950">
              2. Quotations, Estimates & Service Inquiries
            </h2>

            <p className="mt-4 leading-7">
              ​Non-Binding Estimates: Any price calculators, general rates, or
              verbal estimates provided via the website, chat, or phone are
              indicative only. ​Final Project Quotations: Formal, binding
              quotations are provided only after physical site measurements,
              structural inspection, and mutual agreement on materials, brands,
              and scope of work. ​Validity: Official quotations provided to
              clients remain valid for fifteen (15) calendar days from the date
              of issuance unless explicitly stated otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950">
              3. Intellectual Property & Portfolio Rights
            </h2>

            <p className="mt-4 leading-7">
              ​All content on this website—including company logos, branding,
              written guides, graphic designs, and photographs of completed
              interior or decorative projects—is the intellectual property of
              this business. ​Photography Rights: We reserve the right to
              photograph, film, and showcase completed projects and site
              transformations in our digital portfolio, website, and promotional
              channels, ensuring no sensitive personal documents, private client
              identifiers, or security vulnerabilities are displayed. ​Visitors
              may not copy, download, reproduce, or distribute any media or text
              from this website for commercial use without prior written
              authorization.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950">
              4. Client Testimonials & Visual Accuracy
            </h2>

            <p className="mt-4 leading-7">
              ​Testimonials, reviews, and client quotes published on this
              website reflect individual customer experiences with our
              renovation, surface finishing, and decor services. ​Visual
              Representation: While we strive to present accurate colors, wood
              grains, and wall textures in our website galleries, digital
              displays and screen calibrations vary. Actual on-site finishes
              will be approved via physical swatches or on-site sample patches
              prior to full application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950">
              ​5. Third-Party Links & Materials
            </h2>

            <p className="mt-4 leading-7">
              ​This website may contain references, links, or mentions of
              third-party paint brands, hardware suppliers, or social platforms.
              We do not endorse, control, or assume liability for the privacy
              policies, warranties, or practices of any third-party websites or
              external product manufacturers.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-950">
              6. Limitation of Liability
            </h2>

            <p className="mt-4 leading-7">
              ​While we endeavor to maintain accurate and up-to-date
              information, we make no representations or warranties of any kind
              regarding the completeness, accuracy, or availability of the
              website information. ​To the fullest extent permitted by law, we
              shall not be liable for any indirect, consequential, or incidental
              damages resulting from your use of or inability to access this
              website. ​Formal site-work warranties, payment terms, and
              execution liabilities are governed exclusively by the physical,
              signed Work Order / Contract Agreement executed for individual
              projects.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-950">
              ​7. User Conduct
            </h2>

            <p className="mt-4 leading-7">
              ​When using our website forms, inquiry tabs, or communication
              portals, you agree not to: ​Submit false, misleading, or
              fraudulent project details. ​Transmit spam, unsolicited commercial
              advertisements, or malicious software. ​Attempt unauthorized
              access to the website’s administrative back-end, server
              infrastructure, or databases.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-950">
              8. Governing Law & Jurisdiction
            </h2>

            <p className="mt-4 leading-7">
              ​These Terms and Conditions shall be governed by and construed in
              accordance with the laws of India. Any disputes arising out of the
              use of this website shall be subject to the exclusive jurisdiction
              of the competent courts in Delhi, India.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-950">
              ​9. Contact Information
            </h2>

            <p className="mt-4 leading-7">
              ​For questions, clarifications, or inquiries regarding these
              website terms, please contact:
            </p>
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

                <p className="mt-2 font-bold text-slate-900">9758887602</p>
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

                <p className="mt-2 font-bold text-slate-900">9540937851</p>
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
                  G16, Lotus Pond Market, Vaibhav Khand, Indirapuram, Ghaziabad
                  - 201014
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default TermsPage;
