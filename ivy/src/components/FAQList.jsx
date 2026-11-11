import { useState } from 'react';
import { itemKey } from '../lib/format.js';

export function FAQList({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="faq">{items.map((f, i) => {
      const id = `faq-${i}`; const isOpen = open === i;
      return (
        <div className={`faq-i${isOpen ? ' open' : ''}`} key={itemKey(f)}>
          <h3><button type="button" aria-expanded={isOpen} aria-controls={`${id}-p`} id={`${id}-b`} onClick={() => setOpen(isOpen ? null : i)}>{f.title}<span aria-hidden="true">{isOpen ? '–' : '+'}</span></button></h3>
          <div id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} hidden={!isOpen}><p>{f.description}</p></div>
        </div>
      );
    })}</div>
  );
}
