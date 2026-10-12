import { useEffect, useState } from 'react';

const slides = [
  { image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=90', kicker: 'Premium Interior Design & Decor', title: <>Beautiful spaces <em>for a better life.</em></>, text: 'Modern, functional and timeless interiors shaped around your personality, lifestyle and everyday needs.' },
  { image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=90', kicker: 'Thoughtful Planning', title: <>Interiors that feel <em>like you.</em></>, text: 'From first sketch to final handover, every material, light and detail is planned with purpose.' },
  { image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2200&q=90', kicker: 'Made For Everyday Living', title: <>Design that works <em>beautifully.</em></>, text: 'Smart storage, refined finishes and practical layouts for homes that are meant to be lived in.' },
  { image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2200&q=90', kicker: 'Workspaces & Commercial', title: <>Spaces built for <em>ambition.</em></>, text: 'Professional environments that make your team, brand and customers feel the difference.' }
];

export default function Hero() {
  const [active, setActive] = useState(0);
  useEffect(() => { const timer = setInterval(() => setActive((v) => (v + 1) % slides.length), 6500); return () => clearInterval(timer); }, []);
  const slide = slides[active];

  return (
    <section id="top" className="hero">
      <div className="hero-media">
        {slides.map((item, index) => <img key={item.image} className={index === active ? 'active' : ''} src={item.image} alt="Ivy Interio interior design" />)}
      </div>
      <div className="hero-content">
        <div className="hero-copy" key={active}>
          <p className="eyebrow">{slide.kicker}</p>
          <h1>{slide.title}</h1>
          <p className="lead">{slide.text}</p>
          <div className="hero-actions"><a className="btn gold" href="#projects">Explore Our Work →</a><a className="btn ghost" href="#contact">Start Your Project</a></div>
          <div className="hero-points"><div className="hero-point"><span /> Modern Design</div><div className="hero-point"><span /> Premium Quality</div><div className="hero-point"><span /> Clear Planning</div><div className="hero-point"><span /> End-to-End Support</div></div>
        </div>
      </div>
      <div className="hero-slider"><div className="hero-dots">{slides.map((item, index) => <button type="button" aria-label={`Slide ${index + 1}`} className={index === active ? 'active' : ''} key={item.image} onClick={() => setActive(index)} />)}</div><span>0{active + 1} / 0{slides.length}</span></div>
      <div className="hero-scroll"><i /> Scroll to explore</div>
    </section>
  );
}
