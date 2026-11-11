import { useState } from 'react';
import { gallery } from '../data/content.js';

export default function Gallery() {
  const [active, setActive] = useState('All');
  const categories = ['All', ...new Set(gallery.map((item) => item.category))];
  const items = active === 'All' ? gallery : gallery.filter((item) => item.category === active);
  return (
    <section id="gallery" className="section gallery-section">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Design Gallery</p>
          <h2>Details worth <em>coming home to.</em></h2>
          <p className="sub">A visual collection of materials, spaces and details that shape the Ivy Interio style.</p>
        </div>
        <div className="gallery-tabs">{categories.map((cat) => <button key={cat} className={active === cat ? 'active' : ''} onClick={() => setActive(cat)}>{cat}</button>)}</div>
        <div className="gallery-grid">
          {items.map((item) => <article className="gallery-item" key={item.title}>
            <img src={item.image} alt={item.title} loading="lazy" />
            <div><small>{item.category}</small><h3>{item.title}</h3></div>
          </article>)}
        </div>
      </div>
    </section>
  );
}
