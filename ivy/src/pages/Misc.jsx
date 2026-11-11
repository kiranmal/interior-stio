import { Link, useParams } from 'react-router-dom';
import Seo from '../hooks/useSeo.jsx';
import { useContent, useSite, usePage, FALLBACK } from '../hooks/useData.js';
import { PageHero, State, Stars, Reveal, Prose } from '../components/ui.jsx';
import { BlogCard, TeamGrid, CtaBlock, Sections } from '../components/Sections.jsx';
import { FAQList } from '../components/FAQList.jsx';
import EnquiryForm from '../components/EnquiryForm.jsx';
import CostCalculator from '../components/CostCalculator.jsx';
import { PRIVACY, TERMS } from '../data/static.js';
import { itemKey, dateLabel, slugify, phoneDigits } from '../lib/format.js';

export function Team() {
  const { items, loading, error } = useContent('team');
  return <><Seo title="Our team" description="Meet the designers and project managers at Ivy Interio." /><PageHero title="Our team" sub="The designers and managers who see every project through." />
    <section className="sec"><div className="wrap"><State loading={loading} error={error} empty={!items.length}><TeamGrid items={items} /></State></div></section></>;
}

export function Testimonials() {
  const { items, loading, error } = useContent('testimonial');
  return <><Seo title="Client testimonials" description="What homeowners and business owners say about working with Ivy Interio." /><PageHero title="Testimonials" sub="Kind words from the people we have designed for." />
    <section className="sec"><div className="wrap"><State loading={loading} error={error} empty={!items.length} emptyText="Reviews will appear here soon.">
      <div className="tgrid light">{items.map((t, i) => <Reveal as="figure" i={i % 3} key={itemKey(t)}>{t.meta?.rating && <Stars n={t.meta.rating} />}<blockquote>{t.description}</blockquote><figcaption><b>{t.title}</b>{t.meta?.role && <span>{t.meta.role}</span>}</figcaption></Reveal>)}</div></State></div></section>
    <CtaBlock s={{ heading: 'Start your own project', ctaLabel: 'Get a quote', ctaUrl: '/get-a-quote' }} /></>;
}

export function Blog() {
  const { items, loading, error } = useContent('blog');
  return <><Seo title="Journal" description="Planning guides and design notes from the Ivy Interio studio." /><PageHero title="Journal" sub="Planning guides and design notes from the studio." />
    <section className="sec"><div className="wrap"><State loading={loading} error={error} empty={!items.length} emptyText="Articles will appear here soon."><div className="bgrid">{items.map((b, i) => <BlogCard key={itemKey(b)} b={b} i={i % 3} />)}</div></State></div></section></>;
}

export function BlogDetail() {
  const { slug } = useParams();
  const { items, loading, error } = useContent('blog');
  if (loading) return <State loading />;
  const find = (l) => l.find((b) => b.slug === slug || b._id === slug || slugify(b.title) === slug);
  const b = find(items) || (error ? find(FALLBACK.blog) : null);
  if (!b) return <PageHero title="Article not found" sub="It may have been unpublished or moved."><Link className="btn" to="/blog">Back to the journal</Link></PageHero>;
  const more = items.filter((x) => itemKey(x) !== itemKey(b)).slice(0, 2);
  return <>
    <Seo type="article" title={b.seo?.title || b.title} description={b.seo?.description || b.description} image={b.seo?.ogImage || b.image} />
    <PageHero title={b.title} sub={[b.author, dateLabel(b.publishedAt || b.createdAt), b.meta?.readTime].filter(Boolean).join(', ')} image={b.image} />
    <article className="sec"><div className="wrap narrow prose"><p className="lede">{b.description}</p><Prose text={b.content} />
      {b.tags?.length > 0 && <p className="tags">{b.tags.map((t) => <span key={t}>{t}</span>)}</p>}</div></article>
    {more.length > 0 && <section className="sec tint"><div className="wrap"><h2>Keep reading</h2><div className="bgrid">{more.map((x, i) => <BlogCard key={itemKey(x)} b={x} i={i} />)}</div></div></section>}
  </>;
}

export function Contact() {
  const s = useSite();
  return <><Seo title="Contact us" description="Contact Ivy Interio in Vaibhav Khand, Indirapuram, Ghaziabad to discuss your interior project." /><PageHero title="Contact us" sub="Tell us about your space. We usually reply within one working day." />
    <section className="sec"><div className="wrap split">
      <div className="split-text"><h2>Visit or call the studio</h2>
        <address>{[s.addressLine1, s.addressLine2, s.addressLine3].filter(Boolean).map((l) => <span key={l}>{l}<br /></span>)}</address>
        <p><a href={`tel:+91${phoneDigits(s.phone)}`}>{s.phone}</a><br /><a href={`mailto:${s.email}`}>{s.email}</a></p>
        {s.workingHours && <p className="muted">{s.workingHours}</p>}
        {s.mapUrl && <a className="tlink" href={s.mapUrl} target="_blank" rel="noopener noreferrer">Open in maps</a>}</div>
      <div className="panel"><h2>Send a message</h2><EnquiryForm variant="contact" /></div>
    </div></section></>;
}

export function Quote() {
  return <><Seo title="Get a free quote" description="Request a quote for your home or office interiors from Ivy Interio, or use the cost calculator for an indicative range." /><PageHero title="Get a free quote" sub="A few details are enough to start. We will call to refine the scope and share an estimate." />
    <section className="sec"><div className="wrap split">
      <div className="panel"><h2>Project details</h2><EnquiryForm variant="quote" /></div>
      <div className="panel soft"><h2>Quick cost estimate</h2><p className="muted">An indicative range based on area and finish level.</p><CostCalculator /></div>
    </div></section></>;
}

export function FAQs() {
  const { items, loading, error } = useContent('faq');
  return <><Seo title="Frequently asked questions" description="Answers about the interior design process, timelines, modular kitchens and project execution at Ivy Interio." /><PageHero title="Frequently asked questions" />
    <section className="sec"><div className="wrap narrow"><State loading={loading} error={error} empty={!items.length}><FAQList items={items} /></State>
      <p className="muted">Still curious? <Link className="tlink" to="/contact">Ask the studio</Link></p></div></section></>;
}

function Legal({ title, intro, parts, desc }) {
  return <><Seo title={title} description={desc} /><PageHero title={title} sub={intro} />
    <section className="sec"><div className="wrap narrow prose">{parts.map(([h, t]) => <div key={h}><h2>{h}</h2><p>{t}</p></div>)}</div></section></>;
}

function TermsBlock({ b }) {
  const site = useSite();
  if (typeof b === 'string') return <p>{b}</p>;
  if (b.lead) return <p><strong>{b.lead}</strong> {b.text}</p>;
  if (b.list) return <ul>{b.list.map((x) => <li key={x}>{x}</li>)}</ul>;
  if (b.contact) {
    const addr = [site.addressLine1, site.addressLine2, site.addressLine3].filter(Boolean).join(', ');
    return <address className="legal-contact">
      <strong>{site.siteName}</strong>
      {addr && <span>{addr}</span>}
      {site.phone && <a href={`tel:+91${phoneDigits(site.phone)}`}>{site.phone}</a>}
      {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
    </address>;
  }
  return null;
}

// Uses the CMS page "terms-and-conditions" (Admin → Pages) when it has been created; otherwise shows the client wording above.
export function Terms() {
  const { page, loading } = usePage('terms-and-conditions');
  if (loading) return <State loading />;
  if (page?.sections?.some((x) => x.visible !== false)) {
    return <><Seo title={page.seo?.title || 'Terms & Conditions'} description={page.seo?.description} /><PageHero title={page.title || 'Terms & Conditions'} /><Sections sections={page.sections} /></>;
  }
  return <><Seo title="Terms & Conditions" description="Terms of use for the Ivy Interio website, estimates, quotations and portfolio content." />
    <PageHero title="Terms &amp; Conditions" sub="Please read these terms before using our website or requesting an estimate." />
    <section className="sec legal-page"><div className="wrap narrow">
      <ol className="legal-list">{TERMS.map((t) => <li key={t.h} id={`terms-${slugify(t.h)}`}><h2>{t.h}</h2>{t.blocks.map((b, i) => <TermsBlock key={i} b={b} />)}</li>)}</ol>
    </div></section></>;
}
export const Privacy = () => <Legal title="Privacy policy" desc="How Ivy Interio collects, uses and protects the information you share through its website." intro="How we handle the information you share with us." parts={PRIVACY} />;
