import { Link } from 'react-router-dom';
import useReveal from '../hooks/useReveal.js';
import { itemSlug } from '../lib/format.js';

export function Reveal({ as: Tag = 'div', i = 0, className = '', children, ...rest }) {
  const ref = useReveal();
  return <Tag ref={ref} className={`rv ${className}`} style={{ '--i': i }} {...rest}>{children}</Tag>;
}

export function SectionHead({ title, sub, action, to, align }) {
  return (
    <Reveal className={`sec-head ${align || ''}`}>
      <div><h2>{title}</h2>{sub && <p className="lede">{sub}</p>}</div>
      {action && to && <Link className="tlink" to={to}>{action}</Link>}
    </Reveal>
  );
}

export function PageHero({ title, sub, image, children }) {
  return (
    <section className={`phero${image ? ' has-img' : ''}`}>
      {image && <img src={image} alt="" loading="eager" />}
      <div className="wrap phero-in"><h1>{title}</h1>{sub && <p className="lede">{sub}</p>}{children}</div>
    </section>
  );
}

export function State({ loading, error, empty, emptyText = 'Nothing to show yet.', children }) {
  if (loading) return <div className="state" role="status" aria-busy="true">Loading…</div>;
  if (empty) return <div className="state">{emptyText}</div>;
  return <>{error && <p className="notice" role="status">Showing saved highlights while we reconnect to the studio server.</p>}{children}</>;
}

export function ProjectCard({ p, i = 0 }) {
  return (
    <Reveal as="article" i={i} className="pcard">
      <Link to={`/projects/${itemSlug(p)}`} className="pcard-link">
        <span className="pcard-img">{p.image && <img src={p.image} alt={`${p.title}${p.location ? `, ${p.location}` : ''}`} loading="lazy" />}</span>
        <span className="pcard-body"><b>{p.title}</b><small>{[p.category, p.location].filter(Boolean).join(', ')}</small></span>
      </Link>
    </Reveal>
  );
}

export function Stars({ n = 5 }) {
  const v = Math.max(1, Math.min(5, Number(n) || 5));
  return <span className="stars" role="img" aria-label={`${v} out of 5 stars`}>{'★'.repeat(v)}<span aria-hidden="true" className="dim">{'★'.repeat(5 - v)}</span></span>;
}

export function Prose({ text }) {
  return <>{String(text || '').split(/\n{2,}/).map((p, i) => p.trim() && <p key={i}>{p.trim()}</p>)}</>;
}
