import useReveal from '../hooks/useReveal.js';

export default function About() {
  const ref = useReveal();
  return (
    <section id="about" className="section about-section">
      <div className="wrap about-grid reveal" ref={ref}>
        <div className="about-image">
          <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85" alt="Ivy Interio interior" loading="lazy" />
          <div className="image-badge"><strong>08+</strong><span>Years of design experience</span></div>
        </div>
        <div className="about-copy">
          <p className="eyebrow">The Ivy Approach</p>
          <h2>Interiors that feel <em>like you.</em></h2>
          <p className="sub">We combine thoughtful planning, warm materials and practical detailing to create spaces that look refined and work beautifully every day.</p>
          <div className="about-points">
            <div><b>01</b><span><strong>Design with purpose</strong><small>Every layout starts with how you actually use the space.</small></span></div>
            <div><b>02</b><span><strong>Materials that last</strong><small>We balance finish, maintenance, comfort and budget.</small></span></div>
            <div><b>03</b><span><strong>Clear execution</strong><small>A planned process keeps decisions and timelines visible.</small></span></div>
          </div>
          <a className="btn" href="#contact">Start your project →</a>
        </div>
      </div>
    </section>
  );
}
