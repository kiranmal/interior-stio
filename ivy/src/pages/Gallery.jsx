import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Seo from '../hooks/useSeo.jsx';
import { useContent } from '../hooks/useData.js';
import { PageHero, State } from '../components/ui.jsx';
import { itemKey } from '../lib/format.js';

function Lightbox({ items, index, onClose, onMove }) {
  const ref = useRef(null);
  const item = items[index];
  useEffect(() => {
    const prev = document.activeElement;
    ref.current?.focus();
    const key = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onMove(1);
      if (e.key === 'ArrowLeft') onMove(-1);
      if (e.key === 'Tab') { // keep focus inside the dialog
        const f = ref.current?.querySelectorAll('button'); if (!f?.length) return;
        const first = f[0]; const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = ''; prev?.focus?.(); };
  }, [onClose, onMove]);
  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={item.title} ref={ref} tabIndex={-1} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button type="button" className="lb-x" onClick={onClose}>Close</button>
      <button type="button" className="lb-n prev" onClick={() => onMove(-1)} aria-label="Previous image">Prev</button>
      <figure><img src={item.image} alt={item.title} /><figcaption>{item.title}{item.category ? ` – ${item.category}` : ''}</figcaption></figure>
      <button type="button" className="lb-n next" onClick={() => onMove(1)} aria-label="Next image">Next</button>
    </div>
  );
}

export default function Gallery() {
  const { items, loading, error } = useContent('gallery');
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState(null);
  const withImg = items.filter((g) => g.image);
  const cats = useMemo(() => ['All', ...new Set(withImg.map((g) => g.category).filter(Boolean))], [withImg]);
  const list = cat === 'All' ? withImg : withImg.filter((g) => g.category === cat);
  const move = useCallback((d) => setOpen((i) => (i === null ? null : (i + d + list.length) % list.length)), [list.length]);
  const close = useCallback(() => setOpen(null), []);
  return (
    <>
      <Seo title="Gallery" description="A gallery of living rooms, kitchens, bedrooms and workspaces designed by Ivy Interio." />
      <PageHero title="Gallery" sub="Rooms, details and finished spaces." />
      <section className="sec"><div className="wrap">
        {cats.length > 2 && <div className="chips" role="group" aria-label="Filter by room">{cats.map((c) => <button key={c} type="button" className={c === cat ? 'on' : ''} aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>)}</div>}
        <State loading={loading} error={error} empty={!list.length} emptyText="No images yet.">
          <ul className="gal">{list.map((g, i) => <li key={itemKey(g)}><button type="button" onClick={() => setOpen(i)} aria-label={`Open ${g.title}`}><img src={g.image} alt={g.title} loading="lazy" /><span>{g.title}</span></button></li>)}</ul>
        </State>
      </div></section>
      {open !== null && list[open] && <Lightbox items={list} index={open} onClose={close} onMove={move} />}
    </>
  );
}
