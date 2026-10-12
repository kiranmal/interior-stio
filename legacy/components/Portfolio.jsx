import { projects as fallback } from '../data/content.js';
import useReveal from '../hooks/useReveal.js';
import useRemoteContent from '../hooks/useRemoteContent.js';

export default function Portfolio() {
  const ref = useReveal();
  const projects = useRemoteContent('project', fallback);
  return <section id="projects" className="section portfolio"><div className="wrap"><div className="section-head"><p className="eyebrow">Featured Projects</p><h2>Our latest <em>work.</em></h2><p className="sub">A glimpse of the warm, modern and practical spaces we create for everyday living and working.</p></div><div className="project-grid reveal" ref={ref}>{projects.map((project) => <article className="project" key={project._id || project.name || project.title}><img src={project.image} alt={project.title || project.name} loading="lazy"/><div className="project-info"><small>{project.category || project.type} · {project.location || project.place}</small><h3>{project.title || project.name}</h3><p>{project.description || 'Thoughtful planning, refined materials and functional details.'}</p></div></article>)}</div></div></section>;
}
