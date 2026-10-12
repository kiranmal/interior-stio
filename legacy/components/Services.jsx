import { services as fallback } from '../data/content.js';
import useReveal from '../hooks/useReveal.js';
import useRemoteContent from '../hooks/useRemoteContent.js';

export default function Services() {
  const ref = useReveal();
  const services = useRemoteContent('service', fallback.map((item, index) => ({ ...item, order: index + 1, meta: { icon: item.icon } })));
  return <section id="services" className="section services"><div className="wrap"><div className="section-head"><p className="eyebrow">Our Services</p><h2>Spaces designed <em>around you.</em></h2><p className="sub">From concept to completion, Ivy Interio brings design, planning and execution together for homes and commercial spaces.</p></div><div className="service-grid reveal" ref={ref}>{services.map((service) => <article className="service" key={service._id || service.title}><div className="service-icon">{service.meta?.icon || service.icon || '◇'}</div><h3>{service.title}</h3><p>{service.description || service.text}</p><a href="#calculator" className="service-link">Plan your space →</a></article>)}</div></div></section>;
}
