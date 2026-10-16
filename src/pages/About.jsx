import Seo from "../hooks/useSeo.jsx";
import { Link } from "react-router-dom";
import { PageHero, Reveal, SectionHead } from "../components/ui.jsx";
import { Process, TeamBlock, CtaBlock } from "../components/Sections.jsx";
import { FIGURES } from "../data/static.js";

export default function About() {
  return (
    <>
      <Seo
        title="About the studio"
        description="Ivy Interio is an interior design studio in Indirapuram, Ghaziabad creating thoughtful homes, offices and commercial spaces."
      />
      <PageHero
        title="A studio that plans before it decorates"
        sub="Ivy Interio designs homes, kitchens and workplaces for people who want a space that works as well as it looks."
        image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85"
      />
      <section className="sec">
        <div className="wrap split">
          <Reveal className="split-text">
            <h2>Good interiors reflect the people who use them</h2>
            <p>
              At Ivy Interio, we turn bare walls and blueprints into
              thoughtfully crafted living and working spaces. Since 2022, we
              have been delivering proven excellence in complete civil and
              structural construction, serving commercial establishments,
              government contracts, and residential developments. Expanding on
              that foundation, we launched our full-service turnkey interior
              division in 2024 to provide an effortless, stress-free
              transformation journey. We believe great design shouldn't be
              complicated or overpriced. With comprehensive 2D floor plans,
              photorealistic 3D designs, and meticulous project management, we
              bring your vision to life on time, within budget, and without the
              coordination headaches
            </p>
            <Link className="tlink" to="/projects">
              See recent work
            </Link>
          </Reveal>
          <Reveal i={1} as="dl" className="figures">
            {FIGURES.map((f) => (
              <div key={f.l}>
                <dt>{f.l}</dt>
                <dd>{f.n}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
      <section className="sec tint">
        <div className="wrap">
          <SectionHead title="What we hold ourselves to" />
          <div className="values">
            {[
              [
                "Plan first",
                "Layout, storage and lighting are settled on paper before anything is built.",
              ],
              [
                "Clear scope",
                "You see the scope, estimate and timeline before work begins.",
              ],
              [
                "One accountable team",
                "Design and site execution are coordinated by the same people.",
              ],
              [
                "Made to last",
                "Materials and hardware are chosen for daily use, not only for photographs.",
              ],
            ].map(([h, t], i) => (
              <Reveal as="div" i={i} key={h}>
                <h3>{h}</h3>
                <p>{t}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Process />
      <TeamBlock s={{ heading: "The people behind the work" }} />
      <CtaBlock
        s={{
          heading: "Let us plan your space",
          body: "Share a few details and we will get back with a first plan.",
          ctaLabel: "Get a quote",
          ctaUrl: "/get-a-quote",
        }}
      />
    </>
  );
}
