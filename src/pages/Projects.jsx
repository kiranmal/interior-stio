import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../hooks/useSeo.jsx';
import { useContent, FALLBACK } from '../hooks/useData.js';
import { PageHero, ProjectCard, State, Prose, Reveal } from '../components/ui.jsx';
import { FAQList } from '../components/FAQList.jsx';
import { CtaBlock } from '../components/Sections.jsx';
import { itemKey, itemSlug, slugify } from '../lib/format.js';

// ---- Portfolio helpers (Livspace-style: Delivered / Upcoming, BHK, society, scope) ----
const statusOf = (p) => (String(p.meta?.status || '').toLowerCase().startsWith('up') ? 'upcoming' : 'delivered');
const scopeList = (p) => String(p.meta?.scope || '').split(',').map((x) => x.trim()).filter(Boolean);

const PORTFOLIO_FAQS = [
  { title: 'What is the Ivy Interio portfolio?', description: 'It showcases residential and commercial interiors designed and built by Ivy Interio across Indirapuram, Ghaziabad, Noida and Delhi NCR, from finished homes to designs that are in progress.' },
  { title: 'What are the sections of the portfolio?', description: 'Delivered Projects are spaces we have completed and handed over. Upcoming Projects are designs and sites currently in progress, so you can see what we are planning next.' },
  { title: 'Can I use the portfolio for design inspiration?', description: 'Yes. Browse by project type and scope to see real kitchens, bedrooms, living rooms and workplaces, then shortlist the looks you like.' },
  { title: 'Can I get a similar design for my home?', description: 'Absolutely. Tap "Get This Design" on any project and our team will adapt the layout, materials and budget to your own space.' },
  { title: 'How do I get started?', description: 'Share a few details through the quote form. We will call you to understand your requirements, then prepare floor plans, 3D designs and a clear estimate.' },
  { title: 'How long does a project take?', description: 'The timeline depends on the size and scope of the project. After understanding your requirements we give you a clear estimated timeline before work begins.' },
];

function PortfolioCard({ p, i = 0 }) {
  const slug = itemSlug(p);
  const scope = scopeList(p);
  const status = statusOf(p);
  const society = p.meta?.society || p.location;
  return (
    <Reveal as="article" i={i} className="pf-card">
      <Link to={`/projects/${slug}`} className="pf-img" aria-label={`View ${p.title}`}>
        {p.image && <img src={p.image} alt={`${p.title}${p.location ? `, ${p.location}` : ''}`} loading="lazy" />}
        <span className={`pf-badge ${status}`}>{status === 'upcoming' ? 'Upcoming' : 'Completed'}</span>
      </Link>
      <div className="pf-body">
        <h3><Link to={`/projects/${slug}`}>{p.title}</Link></h3>
        {society && <p className="pf-soc">{society}{p.location && society !== p.location ? `, ${p.location}` : ''}</p>}
        <dl className="pf-spec">
          {p.meta?.bhk && <div><dt>Type</dt><dd>{p.meta.bhk}</dd></div>}
          {p.category && <div><dt>Category</dt><dd>{p.category}</dd></div>}
          {scope.length > 0 && <div><dt>Scope</dt><dd>{scope.join(', ')}</dd></div>}
        </dl>
        <Link className="pf-cta" to="/get-a-quote">Get This Design <span aria-hidden="true">→</span></Link>
      </div>
    </Reveal>
  );
}

export function Projects() {
  const { items, loading, error } = useContent('project');
  const [tab, setTab] = useState('delivered');
  const [type, setType] = useState('All');
  const counts = useMemo(() => ({
    delivered: items.filter((p) => statusOf(p) === 'delivered').length,
    upcoming: items.filter((p) => statusOf(p) === 'upcoming').length,
  }), [items]);
  const inTab = useMemo(() => items.filter((p) => statusOf(p) === tab), [items, tab]);
  const types = useMemo(() => ['All', ...new Set(inTab.map((p) => p.meta?.bhk || p.category).filter(Boolean))], [inTab]);
  const list = type === 'All' ? inTab : inTab.filter((p) => (p.meta?.bhk || p.category) === type);
  const pick = (t) => { setTab(t); setType('All'); };
  const tabs = [
    { id: 'delivered', tag: 'Completed', title: 'Delivered Projects', text: 'A collection of completed spaces highlighting our style and finish quality.' },
    { id: 'upcoming', tag: 'Upcoming', title: 'Upcoming Projects', text: 'Designs and sites in progress, with detailed plans and fresh ideas.' },
  ];
  return (
    <>
      <Seo title="Interior design portfolio" description="Delivered and upcoming residential and commercial interior design projects by Ivy Interio across Indirapuram, Ghaziabad, Noida and Delhi NCR." />
      <PageHero title="Interior Design Portfolio" sub="Proposed and completed homes and workplaces by Ivy Interio, designed around how you live and work." />
      <section className="sec"><div className="wrap">
        <div className="pf-tabs" role="tablist" aria-label="Portfolio sections">
          {tabs.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={`pf-tab${tab === t.id ? ' on' : ''}`} onClick={() => pick(t.id)}>
              <small>{t.tag} · {counts[t.id]}</small>
              <b>{t.title}</b>
              <span>{t.text}</span>
              <i aria-hidden="true">Explore →</i>
            </button>
          ))}
        </div>
        <h2 className="pf-h">{tab === 'delivered' ? 'Featured projects: delivered by Ivy Interio' : 'Upcoming projects by Ivy Interio'}</h2>
        {types.length > 2 && <div className="chips" role="group" aria-label="Filter by type">{types.map((c) => <button key={c} type="button" className={c === type ? 'on' : ''} aria-pressed={c === type} onClick={() => setType(c)}>{c}</button>)}</div>}
        <State loading={loading} error={error} empty={!list.length} emptyText={tab === 'upcoming' ? 'New upcoming projects will be listed here soon.' : 'No projects in this category yet.'}>
          <div className="pf-grid">{list.map((p, i) => <PortfolioCard key={itemKey(p)} p={p} i={i % 6} />)}</div>
        </State>
      </div></section>
      <section className="sec tint"><div className="wrap narrow">
        <h2>FAQ about our portfolio</h2>
        <FAQList items={PORTFOLIO_FAQS} />
      </div></section>
      <CtaBlock s={{ heading: 'Designs for every budget', ctaLabel: 'Get a free quote', ctaUrl: '/get-a-quote' }} />
    </>
  );
}

export function ProjectDetail() {
  const { slug } = useParams();
  const { items, loading, error } = useContent('project');
  if (loading) return <State loading />;
  const find = (l) => l.find((p) => p.slug === slug || p._id === slug || slugify(p.title) === slug);
  const p = find(items) || (error ? find(FALLBACK.project) : null);
  if (!p) return <PageHero title="Project not found" sub="This project may have been unpublished or moved."><Link className="btn" to="/projects">All projects</Link></PageHero>;
  const facts = [['Status', statusOf(p) === 'upcoming' ? 'Upcoming' : 'Completed'], ['Type', p.meta?.bhk], ['Society / Project', p.meta?.society], ['Scope', p.meta?.scope], ['Category', p.category], ['Location', p.location], ['Year', p.meta?.year], ['Area', p.meta?.area], ['Duration', p.meta?.duration], ['Style', p.meta?.style]].filter(([, v]) => v);
  const next = items.filter((x) => itemKey(x) !== itemKey(p)).slice(0, 2);
  return (
    <>
      <Seo title={p.seo?.title || p.title} description={p.seo?.description || p.description} image={p.seo?.ogImage || p.image} />
      <PageHero title={p.title} sub={p.description} image={p.image} />
      <section className="sec"><div className="wrap split">
        <div className="split-text prose"><Prose text={p.content || p.description} /></div>
        <dl className="facts">{facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      </div></section>
      {p.gallery?.length > 0 && <section className="sec tint"><div className="wrap"><h2>Gallery</h2><div className="mosaic">{p.gallery.map((g, i) => <div className="m" key={g + i}><img src={g} alt={`${p.title} view ${i + 1}`} loading="lazy" /></div>)}</div></div></section>}
      {next.length > 0 && <section className="sec"><div className="wrap"><h2>More projects</h2><div className="pgrid two">{next.map((x, i) => <ProjectCard key={itemKey(x)} p={x} i={i} />)}</div></div></section>}
      <CtaBlock s={{ heading: 'Planning something similar?', ctaLabel: 'Get a quote', ctaUrl: '/get-a-quote' }} />
    </>
  );
}
