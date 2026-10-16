import { useEffect, useRef, useState } from "react";
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
import { itemKey, itemSlug, dateShort } from "../lib/format.js";
import { Icon } from "./icons.jsx";
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

function accentTail(text = "", words = 1) {
  const parts = String(text).trim().split(/\s+/);
  if (parts.length <= words + 1) return text;
  return (
    <>
      {parts.slice(0, -words).join(" ")} <em>{parts.slice(-words).join(" ")}</em>
    </>
  );
}

const HERO_TILES = [
  ["Residential Interiors", "/residential-interiors", "home2"],
  ["Commercial Spaces", "/commercial-interiors", "building"],
  ["Custom Design Solutions", "/services", "sofa"],
];

export function Hero({ s }) {
  const { items } = useContent("banner");
  const slides = items.filter((b) => b.image);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(reduced());
  const n = slides.length;
  const cur = slides[idx];

  useEffect(() => {
    if (paused || n < 2) return undefined;
    const timer = setInterval(() => setIdx((c) => (c + 1) % n), 5000);
    return () => clearInterval(timer);
  }, [paused, n, idx]);

  const go = (i) => setIdx((i + n) % n);
  const pad = (v) => String(v + 1).padStart(2, "0");

  return (
    <section className="hero" aria-roledescription="carousel" aria-label="Featured interiors">
      <div className="hero-background" aria-hidden="true">
        {slides.map((b, i) => (
          <img
            key={itemKey(b)}
            src={b.image}
            alt=""
            className={`hero-bg-image${i === idx ? " active" : ""}`}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
      </div>
      <div className="hero-overlay" />

      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Modern interiors</p>
          <h1>{accentTail(s.heading, 2)}</h1>
          {s.subheading && <p className="lede">{s.subheading}</p>}
          <div className="actions">
            <Cta to={s.ctaUrl} className="btn">
              {s.ctaLabel || "Get a free quote"}
            </Cta>
            <Link className="btn ghost" to="/projects">
              View projects
            </Link>
          </div>
        </div>

        <ul className="hero-tiles">
          {HERO_TILES.map(([label, to, icon]) => (
            <li key={to}>
              <Link to={to}>
                <Icon name={icon} size={30} strokeWidth={1.2} />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {n > 1 && (
        <div className="hero-controls">
          <button
            type="button"
            className="round"
            onClick={() => go(idx - 1)}
            aria-label="Previous slide"
          >
            <Icon name="left" size={16} />
          </button>
          <button
            type="button"
            className="round"
            onClick={() => go(idx + 1)}
            aria-label="Next slide"
          >
            <Icon name="right" size={16} />
          </button>
          <div className="hero-dots" role="group" aria-label="Choose slide">
            {slides.map((b, i) => (
              <button
                key={itemKey(b)}
                type="button"
                className={i === idx ? "on" : ""}
                aria-label={`Slide ${i + 1}${b.title ? `: ${b.title}` : ""}`}
                aria-current={i === idx}
                onClick={() => go(i)}
              >
                {pad(i)}
              </button>
            ))}
          </div>
          <span className="hero-line" aria-hidden="true">
            <i
              key={`${idx}-${paused}`}
              className={paused ? "paused" : ""}
              style={{ "--dur": "5s" }}
            />
          </span>
          <button
            type="button"
            className="hero-pause"
            onClick={() => setPaused((v) => !v)}
            aria-pressed={paused}
          >
            {paused ? "Play" : "Pause"}
          </button>
        </div>
      )}
      <span className="sr" aria-live="polite">
        {cur?.title}
      </span>
    </section>
  );
}

export function Intro({ s }) {
  return (
    <section className="sec intro" id="about">
      <div className="wrap split">
        <Reveal className="split-text">
          <p className="eyebrow">About us</p>
          <h2>{accentTail(s.heading, 1)}</h2>
          <Prose text={s.body} />
          {s.ctaLabel && (
            <Cta to={s.ctaUrl} className="more">
              {s.ctaLabel}
              <Icon name="arrow" size={14} />
            </Cta>
          )}
        </Reveal>
        {s.image && (
          <Reveal i={1} className="split-img">
            <img src={s.image} alt="" loading="lazy" />
            {s.badgeValue && (
              <div className="badge">
                <b>{s.badgeValue}</b>
                {s.badgeLabel && <span>{s.badgeLabel}</span>}
              </div>
            )}
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
        <Reveal className="cta-copy">
          <h2>{s.heading}</h2>
          {s.body && <p className="lede">{s.body}</p>}
        </Reveal>
        <Cta to={s.ctaUrl} className="btn">
          {s.ctaLabel || "Get in touch"}
          <Icon name="arrow" size={15} />
        </Cta>
        {s.image && <img className="cta-img" src={s.image} alt="" loading="lazy" />}
      </div>
    </section>
  );
}

export function ServiceGrid({ s, limit = 5 }) {
  const { items, loading, error } = useContent("service");
  const list = limit ? items.slice(0, limit) : items;
  return (
    <section className="sec" id="services">
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
          <ul className="svc-cards">
            {list.map((x, i) => (
              <Reveal as="li" i={i} key={itemKey(x)}>
                <Link to={`/services/${itemSlug(x)}`}>
                  <span className="svc-photo">
                    {x.image && <img src={x.image} alt="" loading="lazy" />}
                  </span>
                  <span className="svc-body">
                    <b>{x.title}</b>
                    <span>{x.description}</span>
                    <i className="go" aria-hidden="true">
                      <Icon name="arrow" size={14} />
                    </i>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </State>
      </div>
    </section>
  );
}

function chunk(list, size) {
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

export function ProjectGrid({ s, limit = 6 }) {
  const { items, loading, error } = useContent("project");
  const [cat, setCat] = useState("All");
  const cats = ["All", ...new Set(items.map((p) => p.category).filter(Boolean))];
  const feat = items.filter((p) => p.featured);
  const base = feat.length >= 3 ? feat : items;
  const list = (cat === "All" ? base : items.filter((p) => p.category === cat)).slice(0, limit);
  return (
    <section className="sec" id="projects">
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
          empty={!items.length}
          emptyText="Projects will appear here soon."
        >
          {cats.length > 2 && (
            <div className="pills" role="group" aria-label="Filter projects">
              {cats.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={c === cat ? "on" : ""}
                  aria-pressed={c === cat}
                  onClick={() => setCat(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
          <div className="pj">
            {chunk(list, 3).map((blk, b) => (
              <div className="pj-block" key={blk.map(itemKey).join("|")}>
                {blk.map((p, i) => (
                  <Reveal as="article" i={i + b} key={itemKey(p)} className="pj-card">
                    <Link to={`/projects/${itemSlug(p)}`}>
                      {p.image && (
                        <img
                          src={p.image}
                          alt={`${p.title}${p.location ? `, ${p.location}` : ""}`}
                          loading="lazy"
                        />
                      )}
                      <span className="pj-cap">
                        <b>{p.title}</b>
                        <small>{p.category}</small>
                        <i className="go" aria-hidden="true">
                          <Icon name="arrow" size={15} />
                        </i>
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            ))}
          </div>
          {!list.length && <div className="state">No projects in this category yet.</div>}
        </State>
      </div>
    </section>
  );
}

const STEP_ICONS = ["chat", "pencil", "plan", "gear", "house"];

export function Process({ s }) {
  return (
    <section className="sec" id="process">
      <div className="wrap">
        <SectionHead
          title={s?.heading || "How a project runs"}
          action="All process"
          to="/about"
        />
        <ol className="steps">
          {STEPS.map((x, i) => (
            <Reveal as="li" i={i} key={x.title}>
              <span className="step-ic">
                <Icon name={STEP_ICONS[i] || "house"} size={26} strokeWidth={1.3} />
              </span>
              <small>Step {String(i + 1).padStart(2, "0")}</small>
              <b>{x.title}</b>
              <span>{x.text}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Testimonials({ s, limit = 12 }) {
  const { items, loading, error } = useContent("testimonial");
  const list = items.slice(0, limit);
  const track = useRef(null);
  const scroll = (dir) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("figure");
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: reduced() ? "auto" : "smooth" });
  };
  return (
    <section className="sec dark" id="testimonials">
      <div className="wrap">
        <div className="sec-head t-head">
          <div>
            <p className="eyebrow">Testimonials</p>
            <h2>{s?.heading || "Client words"}</h2>
          </div>
          {list.length > 3 && (
            <div className="t-arrows">
              <button type="button" className="round" onClick={() => scroll(-1)} aria-label="Previous reviews">
                <Icon name="left" size={16} />
              </button>
              <button type="button" className="round" onClick={() => scroll(1)} aria-label="Next reviews">
                <Icon name="right" size={16} />
              </button>
            </div>
          )}
        </div>
        <State
          loading={loading}
          error={error}
          empty={!list.length}
          emptyText="Reviews will appear here soon."
        >
          <div className="tgrid" ref={track} tabIndex={0} aria-label="Client reviews">
            {list.map((t) => (
              <figure key={itemKey(t)}>
                {t.meta?.rating && <Stars n={t.meta.rating} />}
                <blockquote>{t.description}</blockquote>
                <figcaption>
                  <b>{t.title}</b>
                  {t.meta?.role && <span>{t.meta.role}</span>}
                </figcaption>
                <span className="qmark" aria-hidden="true">
                  &rdquo;
                </span>
              </figure>
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
    <section className="sec notes" id="notes">
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
        <small>{dateShort(b.publishedAt || b.createdAt)}</small>
        <b>{b.title}</b>
        <span>{b.description}</span>
        <em className="rm">
          Read more <Icon name="arrow" size={13} />
        </em>
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
