import { Link } from 'react-router-dom';
import Seo from '../hooks/useSeo.jsx';

export default function NotFound() {
  return (
    <section className="sec nf"><Seo title="Page not found" noindex />
      <div className="wrap narrow"><h1>This page could not be found</h1><p className="lede">The link may be old or mistyped. These might help:</p>
        <div className="actions"><Link className="btn" to="/">Back to home</Link><Link className="tlink" to="/projects">Browse projects</Link><Link className="tlink" to="/contact">Contact the studio</Link></div></div></section>
  );
}
