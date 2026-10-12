import { useEffect, useState } from 'react';
import { testimonials } from '../data/content.js';

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((value) => (value + 1) % testimonials.length), 5200);
    return () => clearInterval(timer);
  }, []);
  const item = testimonials[index];
  return (
    <section id="testimonials" className="section testimonials">
      <div className="wrap testimonial-wrap">
        <div><p className="eyebrow">Client Stories</p><h2>Spaces that become <em>memories.</em></h2><p className="sub">Good design should feel personal long after the reveal.</p></div>
        <div className="testimonial-card" key={index}>
          <div className="quote-mark">“</div>
          <p>{item.quote}</p>
          <strong>{item.name}</strong><small>{item.role}</small>
          <div className="slider-dots">{testimonials.map((_, i) => <button key={i} aria-label={`Testimonial ${i+1}`} className={i === index ? 'active' : ''} onClick={() => setIndex(i)} />)}</div>
        </div>
      </div>
    </section>
  );
}
