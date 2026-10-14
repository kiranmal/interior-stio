import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../hooks/useData.js";
import {
  Reveal,
  SectionHead,
  ProjectCard,
  State,
  Stars,
  Prose,
} from "./ui.jsx";
import { STEPS } from "../data/static.js";
import { itemKey, itemSlug, dateLabel } from "../lib/format.js";
import { FAQList } from "./FAQList.jsx";

export function Cta({ to, children, className = "btn" }) {
  if (!to) return null;
  return to.startsWith("/") ? (
    <Link className={className} to={to}>
      {children}
    </Link>
  ) : (
    <a
      className={className}
      href={to}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

function reduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

export function Hero({ s }) {
  const { items } = useContent("banner");
  const slides = items.filter((b) => b.image);

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(reduced());

  const n = slides.length;
  const cur = slides[idx];

  useEffect(() => {
    if (paused || n < 2) return;

    const timer = setInterval(() => {
      setIdx((current) => (current + 1) % n);
    }, 5000);

    return () => clearInterval(timer);
  }, [paused, n]);

  const changeSlide = (index) => {
    setIdx((index + n) % n);
  };

  return (
    <section className="hero">
      {/* Full-screen background slider */}
      <div className="hero-background">
        {slides.map((b, i) => (
          <img
            key={itemKey(b)}
            src={b.image}
            alt=""
            className={`hero-bg-image ${i === idx ? "active" : ""}`}
          />
        ))}
      </div>

      {/* Dark overlay */}
      <div className="hero-overlay" />

      <div className="wrap hero-grid">
        {/* Left-side text */}
        <div className="hero-copy" key={cur ? itemKey(cur) : "hero"}>
          <h1>{s.heading}</h1>

          {s.subheading && <p className="lede">{s.subheading}</p>}

          <div className="actions">
            <Cta to={s.ctaUrl}>{s.ctaLabel || "Get a quote"}</Cta>

            <Link className="tlink" to="/projects">
              View projects
            </Link>
          </div>
        </div>

        {/* Right-side carousel: synced with background */}
        {n > 0 && (
          <div className="hero-media">
            <div className="arch">
              {slides.map((b, i) => (
                <img
                  key={itemKey(b)}
                  src={b.image}
                  alt={i === idx ? b.title || "Featured work" : ""}
                  className={i === idx ? "on" : ""}
                />
              ))}
            </div>

            <div className="hero-cap" aria-live="polite">
              <b>{cur?.title}</b>
              {cur?.description && <span>{cur.description}</span>}
            </div>
          </div>
        )}
      </div>

      {/* Shared controls change both sliders */}
      {n > 1 && (
        <div className="hero-controls">
          <button
            type="button"
            onClick={() => changeSlide(idx - 1)}
            aria-label="Previous slide"
          >
            ←
          </button>

          <span>
            {idx + 1} / {n}
          </span>

          <button
            type="button"
            onClick={() => changeSlide(idx + 1)}
            aria-label="Next slide"
          >
            →
          </button>

          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
          >
            {paused ? "Play" : "Pause"}
          </button>
        </div>
      )}
    </section>
  );
}

export function Intro({ s }) {
  return (
    <section className="sec intro">
      <div className="wrap split">
        <Reveal className="split-text">
          <h2>{s.heading}</h2>
          <Prose text={s.body} />
          <Cta to={s.ctaUrl} className="tlink">
            {s.ctaLabel}
          </Cta>
        </Reveal>
        {s.image && (
          <Reveal i={1} className="split-img">
            <img src={s.image} alt="" loading="lazy" />
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function TextBlock({ s }) {
  return (
    <section className="sec">
      <div className="wrap narrow">
        <Reveal>
          {s.heading && <h2>{s.heading}</h2>}
          {s.subheading && <p className="lede">{s.subheading}</p>}
          <Prose text={s.body} />
          <Cta to={s.ctaUrl}>{s.ctaLabel}</Cta>
        </Reveal>
      </div>
    </section>
  );
}

export function BannerBlock({ s }) {
  return (
    <section className="banner">
      {s.image && <img src={s.image} alt="" loading="lazy" />}
      <div className="wrap banner-in">
        <h2>{s.heading}</h2>
        {s.body && <p>{s.body}</p>}
        <Cta to={s.ctaUrl}>{s.ctaLabel}</Cta>
      </div>
    </section>
  );
}

export function CtaBlock({ s }) {
  return (
    <section className="sec cta">
      <div className="wrap cta-in">
        <Reveal>
          <h2>{s.heading}</h2>
          {s.body && <p className="lede">{s.body}</p>}
        </Reveal>
        <Cta to={s.ctaUrl}>{s.ctaLabel || "Get in touch"}</Cta>
      </div>
    </section>
  );
}

export function ServiceGrid({ s, limit }) {
  const { items, loading, error } = useContent("service");
  const list = limit ? items.slice(0, limit) : items;
  return (
    <section className="sec">
      <div className="wrap">
        <SectionHead
          title={s?.heading || "Services"}
          sub={s?.subheading}
          action="All services"
          to="/services"
        />
        <State
          loading={loading}
          error={error}
          empty={!list.length}
          emptyText="Services will appear here soon."
        >
          <ul className="svc-list">
            {list.map((x, i) => (
              <Reveal as="li" i={i} key={itemKey(x)}>
                <Link to={`/services/${itemSlug(x)}`}>
                  <b>{x.title}</b>
                  <span>{x.description}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </State>
      </div>
    </section>
  );
}

export function ProjectGrid({ s, limit = 4 }) {
  const { items, loading, error } = useContent("project");
  const feat = items.filter((p) => p.featured);
  const list = (feat.length >= 3 ? feat : items).slice(0, limit);
  return (
    <section className="sec tint">
      <div className="wrap">
        <SectionHead
          title={s?.heading || "Projects"}
          sub={s?.subheading}
          action="All projects"
          to="/projects"
        />
        <State
          loading={loading}
          error={error}
          empty={!list.length}
          emptyText="Projects will appear here soon."
        >
          <div className="pgrid">
            {list.map((p, i) => (
              <ProjectCard key={itemKey(p)} p={p} i={i} />
            ))}
          </div>
        </State>
      </div>
    </section>
  );
}

export function Process({ s }) {
  return (
    <section className="sec">
      <div className="wrap">
        <SectionHead title={s?.heading || "How a project runs"} />
        <ol className="steps">
          {STEPS.map((x, i) => (
            <Reveal as="li" i={i} key={x.title}>
              <b>{x.title}</b>
              <span>{x.text}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Testimonials({ s, limit = 3 }) {
  const { items, loading, error } = useContent("testimonial");
  const list = items.slice(0, limit);
  return (
    <section className="sec dark">
      <div className="wrap">
        <SectionHead
          title={s?.heading || "Client words"}
          action="More reviews"
          to="/testimonials"
        />
        <State
          loading={loading}
          error={error}
          empty={!list.length}
          emptyText="Reviews will appear here soon."
        >
          <div className="tgrid">
            {list.map((t, i) => (
              <Reveal as="figure" i={i} key={itemKey(t)}>
                <Stars n={t.meta?.rating} />
                <blockquote>{t.description}</blockquote>
                <figcaption>
                  <b>{t.title}</b>
                  {t.meta?.role && <span>{t.meta.role}</span>}
                </figcaption>
              </Reveal>
            ))}
          </div>
        </State>
      </div>
    </section>
  );
}

export function BlogTeaser({ s, limit = 3 }) {
  const { items, loading, error } = useContent("blog");
  const list = items.slice(0, limit);
  return (
    <section className="sec">
      <div className="wrap">
        <SectionHead
          title={s?.heading || "Journal"}
          action="All articles"
          to="/blog"
        />
        <State
          loading={loading}
          error={error}
          empty={!list.length}
          emptyText="Articles will appear here soon."
        >
          <div className="bgrid">
            {list.map((b, i) => (
              <BlogCard key={itemKey(b)} b={b} i={i} />
            ))}
          </div>
        </State>
      </div>
    </section>
  );
}

export function BlogCard({ b, i = 0 }) {
  return (
    <Reveal as="article" i={i} className="bcard">
      <Link to={`/blog/${itemSlug(b)}`}>
        {b.image && (
          <span className="bcard-img">
            <img src={b.image} alt="" loading="lazy" />
          </span>
        )}
        <small>
          {[b.category, dateLabel(b.publishedAt || b.createdAt)]
            .filter(Boolean)
            .join(", ")}
        </small>
        <b>{b.title}</b>
        <span>{b.description}</span>
      </Link>
    </Reveal>
  );
}

export function GalleryTeaser({ s }) {
  const { items, loading, error } = useContent("gallery");
  const list = items.filter((g) => g.image).slice(0, 5);
  return (
    <section className="sec tint">
      <div className="wrap">
        <SectionHead
          title={s?.heading || "Gallery"}
          action="Open gallery"
          to="/gallery"
        />
        <State loading={loading} error={error} empty={!list.length}>
          <div className="mosaic">
            {list.map((g, i) => (
              <Reveal key={itemKey(g)} i={i} className="m">
                <img src={g.image} alt={g.title} loading="lazy" />
              </Reveal>
            ))}
          </div>
        </State>
      </div>
    </section>
  );
}

export function FaqBlock({ s }) {
  const { items, loading, error } = useContent("faq");
  return (
    <section className="sec">
      <div className="wrap narrow">
        <SectionHead title={s?.heading || "Questions"} />
        <State loading={loading} error={error} empty={!items.length}>
          <FAQList items={items} />
        </State>
      </div>
    </section>
  );
}

export function TeamBlock({ s }) {
  const { items, loading, error } = useContent("team");
  return (
    <section className="sec">
      <div className="wrap">
        <SectionHead title={s?.heading || "Our team"} />
        <State loading={loading} error={error} empty={!items.length}>
          <TeamGrid items={items} />
        </State>
      </div>
    </section>
  );
}

export function TeamGrid({ items }) {
  return (
    <div className="tmgrid">
      {items.map((m, i) => (
        <Reveal as="article" i={i} key={itemKey(m)} className="member">
          {m.image && <img src={m.image} alt={m.title} loading="lazy" />}
          <b>{m.title}</b>
          <span>{m.meta?.role}</span>
          {m.description && <p>{m.description}</p>}
        </Reveal>
      ))}
    </div>
  );
}

const MAP = {
  hero: Hero,
  intro: Intro,
  text: TextBlock,
  banner: BannerBlock,
  cta: CtaBlock,
  services: ServiceGrid,
  projects: ProjectGrid,
  gallery: GalleryTeaser,
  testimonials: Testimonials,
  blog: BlogTeaser,
  faq: FaqBlock,
  process: Process,
  team: TeamBlock,
};
export function Sections({ sections }) {
  return (
    <>
      {(sections || [])
        .filter((s) => s.visible !== false)
        .map((s) => {
          const C = MAP[s.type];
          return C ? <C key={s.id} s={s} /> : null;
        })}
    </>
  );
}
