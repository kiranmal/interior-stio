import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../hooks/useSeo.jsx';
import { useContent, FALLBACK } from '../hooks/useData.js';
import { PageHero, ProjectCard, State, Prose } from '../components/ui.jsx';
import { CtaBlock } from '../components/Sections.jsx';
import { itemKey, slugify } from '../lib/format.js';

export function Projects() {
  const { items, loading, error } = useContent('project');
  const [cat, setCat] = useState('All');
  const cats = useMemo(() => ['All', ...new Set(items.map((p) => p.category).filter(Boolean))], [items]);
  const list = cat === 'All' ? items : items.filter((p) => p.category === cat);
  return (
    <>
      <Seo title="Projects and portfolio" description="Recent residential and commercial interior projects by Ivy Interio across Indirapuram, Ghaziabad, Noida and Delhi NCR." />
      <PageHero title="Projects" sub="A look at recent homes, kitchens and workplaces." />
      <section className="sec"><div className="wrap">
        {cats.length > 2 && <div className="chips" role="group" aria-label="Filter by category">{cats.map((c) => <button key={c} type="button" className={c === cat ? 'on' : ''} aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>)}</div>}
        <State loading={loading} error={error} empty={!list.length} emptyText="No projects in this category yet.">
          <div className="pgrid wide">{list.map((p, i) => <ProjectCard key={itemKey(p)} p={p} i={i % 6} />)}</div>
        </State>
      </div></section>
      <CtaBlock s={{ heading: 'Want something like this?', ctaLabel: 'Start your project', ctaUrl: '/get-a-quote' }} />
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
  const facts = [['Category', p.category], ['Location', p.location], ['Year', p.meta?.year], ['Area', p.meta?.area], ['Duration', p.meta?.duration], ['Style', p.meta?.style]].filter(([, v]) => v);
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
