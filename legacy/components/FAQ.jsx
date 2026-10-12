import { useState } from 'react';
import { faqs } from '../data/content.js';

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="section faq-section">
      <div className="wrap faq-grid">
        <div><p className="eyebrow">FAQ</p><h2>Questions before <em>we begin?</em></h2><p className="sub">A few things clients usually want to know before starting an interior project.</p></div>
        <div className="faq-list">{faqs.map(([q, a], i) => <div className={`faq-item ${open === i ? 'open' : ''}`} key={q}>
          <button onClick={() => setOpen(open === i ? -1 : i)}><span>{q}</span><b>{open === i ? '−' : '+'}</b></button>
          <div className="faq-answer"><p>{a}</p></div>
        </div>)}</div>
      </div>
    </section>
  );
}
