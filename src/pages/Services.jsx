import { Link, useParams } from "react-router-dom";
import Seo from "../hooks/useSeo.jsx";
import { useContent, FALLBACK } from "../hooks/useData.js";
import {
  PageHero,
  Reveal,
  State,
  Prose,
  ProjectCard,
} from "../components/ui.jsx";
import { CtaBlock } from "../components/Sections.jsx";
import { itemKey, itemSlug, sameSlug, slugify } from "../lib/format.js";

export function Services() {
  const { items, loading, error } = useContent("service");
  return (
    <>
      <Seo
        title="Interior design services"
        description="Residential, commercial and office interiors, modular kitchens, bedroom and living room design in Indirapuram, Ghaziabad."
      />
      <PageHero
        title="Interior design services"
        sub="From a single kitchen to a complete home or workplace, planned and delivered by one team."
      />
      <section className="sec">
        <div className="wrap">
          <State
            loading={loading}
            error={error}
            empty={!items.length}
            emptyText="Services will appear here soon."
          >
            <div className="svc-rows">
              {items.map((s, i) => (
                <Reveal as="article" i={i} key={itemKey(s)} className="svc-row">
                  {s.image && (
                    <Link to={`/services/${itemSlug(s)}`} className="svc-img">
                      <img src={s.image} alt="" loading="lazy" />
                    </Link>
                  )}
                  <div>
                    <h2>
                      <Link to={`/services/${itemSlug(s)}`}>{s.title}</Link>
                    </h2>
                    <p>{s.description}</p>
                    {s.tags?.length > 0 && (
                      <ul className="ticks">
                        {s.tags.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    )}
                    <Link className="tlink" to={`/services/${itemSlug(s)}`}>
                      Read more
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </State>
        </div>
      </section>
      <CtaBlock
        s={{
          heading: "Not sure which service you need?",
          body: "Describe your space and we will recommend a starting point.",
          ctaLabel: "Talk to us",
          ctaUrl: "/contact",
        }}
      />
    </>
  );
}

/** Used for /services/:slug and the friendly aliases such as /modular-kitchen (slug passed as prop). */
export function ServiceDetail({ slug: fixed }) {
  const params = useParams();
  const slug = fixed || params.slug;
  const { items, loading, error } = useContent("service");
  const projects = useContent("project");
  if (loading) return <State loading />;
  const find = (list) =>
    list.find(
      (s) =>
        s.slug === slug ||
        s._id === slug ||
        sameSlug(s.slug || slugify(s.title), slug),
    );
  const svc = find(items) || find(FALLBACK.service);
  if (!svc)
    return (
      <State empty emptyText="This service could not be found.">
        <span />
      </State>
    );
  const related = projects.items
    .filter(
      (p) =>
        p.category &&
        svc.title
          .toLowerCase()
          .includes((p.category || "").toLowerCase().slice(0, 4)),
    )
    .slice(0, 2);
  return (
    <>
      <Seo
        title={svc.seo?.title || svc.title}
        description={svc.seo?.description || svc.description}
        image={svc.seo?.ogImage || svc.image}
      />
      <PageHero title={svc.title} sub={svc.description} image={svc.image}>
        <Link className="btn" to="/get-a-quote">
          Get a quote
        </Link>
      </PageHero>
      <section className="sec">
        <div className="wrap split">
          <Reveal className="split-text prose">
            <Prose text={svc.content || svc.description} />
          </Reveal>
          <Reveal i={1} as="aside" className="panel">
            <h2>What is included</h2>
            <ul className="ticks">
              {(svc.tags?.length
                ? svc.tags
                : [
                    "Design and planning",
                    "Material selection",
                    "Site execution",
                    "Handover",
                  ]
              ).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <Link className="btn" to="/contact">
              Book a consultation
            </Link>
          </Reveal>
        </div>
      </section>
      {error && (
        <p className="notice wrap">
          Showing saved highlights while we reconnect to the studio server.
        </p>
      )}
      {related.length > 0 && (
        <section className="sec tint">
          <div className="wrap">
            <h2>Related work</h2>
            <div className="pgrid two">
              {related.map((p, i) => (
                <ProjectCard key={itemKey(p)} p={p} i={i} />
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBlock
        s={{
          heading: `Planning ${svc.title.toLowerCase()}?`,
          body: "Tell us about the space and your budget range.",
          ctaLabel: "Request a quote",
          ctaUrl: "/get-a-quote",
        }}
      />
    </>
  );
}
