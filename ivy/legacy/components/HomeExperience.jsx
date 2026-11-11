import { useEffect, useState } from 'react';
import { gallery as fallbackGallery, testimonials as fallbackTestimonials } from '../data/homeExtra.js';
import useReveal from '../hooks/useReveal.js';
import useRemoteContent from '../hooks/useRemoteContent.js';

const API = import.meta.env.VITE_API_URL || '';

function Reveal({ children, className = '' }) { const ref = useReveal(); return <div ref={ref} className={`reveal ${className}`}>{children}</div>; }

export default function HomeExperience() {
  const gallery = useRemoteContent('gallery', fallbackGallery);
  const testimonials = useRemoteContent('testimonial', fallbackTestimonials);
  const [testimonial, setTestimonial] = useState(0);
  const [faq, setFaq] = useState(0);
  const [blog, setBlog] = useState([]);

  useEffect(() => { fetch(`${API}/api/content?type=blog`).then((r) => r.ok ? r.json() : null).then((d) => d?.items?.length && setBlog(d.items)).catch(() => {}); }, []);
  useEffect(() => { const timer = setInterval(() => setTestimonial((v) => (v + 1) % testimonials.length), 5000); return () => clearInterval(timer); }, [testimonials.length]);

  const faqs = [
    ['How does the interior process work?', 'We begin with a consultation, understand your needs, create the design direction, prepare the estimate and then coordinate execution through handover.'],
    ['Can you work within a fixed budget?', 'Yes. We can shape the design, materials and scope around a target budget while keeping the important functional requirements intact.'],
    ['Do you handle complete home interiors?', 'Yes. We can plan living rooms, bedrooms, kitchens, wardrobes, lighting, furniture and other interior requirements as one project.'],
    ['How do I start?', 'Use the enquiry form or calculator on this website. Share your basic details and our team can contact you for a consultation.']
  ];

  return <>
    <section className="section intro" id="about"><div className="wrap intro-grid"><Reveal className="intro-copy"><p className="eyebrow">Inspired by Living</p><h2>Design should feel <em>effortless.</em></h2><p className="sub">Ivy Interio creates thoughtful interiors where aesthetics and everyday function work together. We believe a beautiful home should also feel comfortable, organised and personal.</p><div className="intro-sign">IVY INTERIO <span>Interior Design Studio</span></div></Reveal><Reveal className="intro-visual"><img src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=88" alt="Elegant Ivy Interio living space"/><div className="floating-note"><strong>150+</strong><span>spaces designed with purpose</span></div></Reveal></div></section>

    <section className="section experience"><div className="wrap"><div className="section-head"><p className="eyebrow">Why Ivy Interio</p><h2>The details make the <em>difference.</em></h2></div><div className="experience-grid"><Reveal><article className="experience-card"><span>01</span><h3>Personalised Design</h3><p>Layouts and finishes are developed around the people who will actually use the space.</p></article></Reveal><Reveal><article className="experience-card"><span>02</span><h3>Transparent Planning</h3><p>A clear scope, practical material choices and a structured process reduce surprises.</p></article></Reveal><Reveal><article className="experience-card"><span>03</span><h3>Execution Support</h3><p>Design intent stays connected to execution so the final space feels like the original vision.</p></article></Reveal><Reveal><article className="experience-card"><span>04</span><h3>Timeless Aesthetic</h3><p>We favour warm materials, useful storage and details that continue to feel relevant over time.</p></article></Reveal></div></div></section>

    <section className="section gallery-section" id="gallery"><div className="wrap"><div className="section-head"><p className="eyebrow">Visual Journal</p><h2>A little <em>inspiration.</em></h2><p className="sub">Explore a selection of spaces, materials and moods that influence our work.</p></div><div className="gallery-grid">{gallery.map((item, index) => <Reveal className={index === 0 ? 'gallery-tall' : ''} key={item._id || item.title}><article className="gallery-card"><img src={item.image} alt={item.title} loading="lazy"/><div><span>{item.category || 'Interior'}</span><h3>{item.title}</h3></div></article></Reveal>)}</div></div></section>

    <section className="section testimonial-section"><div className="wrap testimonial-wrap"><div><p className="eyebrow">Client Stories</p><h2>Spaces that <em>stay with you.</em></h2><p className="sub">Good design is not only visible. It is felt every day.</p></div><div className="testimonial-stage"><div className="testimonial-card" key={testimonial}><div className="stars">★★★★★</div><blockquote>“{testimonials[testimonial]?.description}”</blockquote><strong>{testimonials[testimonial]?.title}</strong><span>{testimonials[testimonial]?.meta?.role || 'Client'}</span><div className="testimonial-dots">{testimonials.map((item, index) => <button type="button" aria-label={`Testimonial ${index + 1}`} className={index === testimonial ? 'active' : ''} key={item._id || index} onClick={() => setTestimonial(index)} />)}</div></div></div></div></section>

    <section className="section faq-section" id="faq"><div className="wrap faq-grid"><div><p className="eyebrow">FAQ</p><h2>Questions before <em>you begin.</em></h2><p className="sub">A few quick answers to help you take the first step with confidence.</p></div><div className="faq-list">{faqs.map(([question, answer], index) => <article className={`faq-item ${faq === index ? 'open' : ''}`} key={question}><button type="button" onClick={() => setFaq(faq === index ? -1 : index)}><span>{question}</span><b>{faq === index ? '−' : '+'}</b></button><div className="faq-answer"><p>{answer}</p></div></article>)}</div></div></section>

    <section className="section journal" id="journal"><div className="wrap"><div className="section-head row-head"><div><p className="eyebrow">From The Journal</p><h2>Ideas for your <em>next space.</em></h2></div><a className="text-link" href="#contact">Talk to our team →</a></div><div className="blog-grid">{blog.map((item) => <article className="blog-card" key={item._id || item.title}><div className="blog-number">01</div><p>{item.meta?.readTime || 'Design note'}</p><h3>{item.title}</h3><span>{item.description}</span><a href="#contact">Read / discuss →</a></article>)}</div></div></section>
  </>;
}
