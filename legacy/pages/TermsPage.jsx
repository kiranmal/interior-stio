function TermsPage() {
  return (
    <main className="bg-[#fffaf5] px-5 pb-24 pt-36 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
          Legal
        </p>

        <h1 className="mt-4 text-5xl font-black text-slate-950">
          Terms & Conditions
        </h1>

        <p className="mt-5 text-sm text-slate-500">
          Last updated: June 2026
        </p>

        <div className="mt-12 space-y-10 text-slate-600">
          <section>
            <h2 className="text-2xl font-bold text-slate-950">
              1. Website Use
            </h2>

            <p className="mt-4 leading-7">
              This website provides information about INARA Interior Studio,
              its services, projects and related information. By using this
              website, you agree to use it for lawful purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950">
              2. Services
            </h2>

            <p className="mt-4 leading-7">
              Information about services, project examples, timelines and
              other details shown on the website are provided for general
              information. Final project terms are agreed separately with the
              client.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950">
              3. Project Information
            </h2>

            <p className="mt-4 leading-7">
              Images, descriptions and project information displayed on the
              website may represent completed projects, design concepts or
              illustrative examples.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950">
              4. Intellectual Property
            </h2>

            <p className="mt-4 leading-7">
              Website content, branding, text, graphics and original design
              materials may not be copied, reproduced or used without
              appropriate permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950">
              5. Changes to These Terms
            </h2>

            <p className="mt-4 leading-7">
              We may update these terms when necessary. Updated terms will be
              published on this page.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default TermsPage;