import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { SiteProvider, useSettingsLoader, useSite } from '../hooks/useData.js';
import { phoneDigits } from '../lib/format.js';

export const SERVICE_LINKS = [
  ['Residential Interiors', '/residential-interiors'], ['Commercial Interiors', '/commercial-interiors'], ['Office Interiors', '/office-interiors'],
  ['Modular Kitchen', '/modular-kitchen'], ['Bedroom Design', '/bedroom-design'], ['Living Room Design', '/living-room-design'],
];
const NAV = [['About', '/about'], ['Projects', '/projects'], ['Gallery', '/gallery'], ['Journal', '/blog'], ['Contact', '/contact']];

function Header() {
  const site = useSite();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`hdr${solid || open ? ' solid' : ''}${pathname === '/' ? ' on-hero' : ''}`}>
      <div className="hdr-in">
        <Link to="/" className="brand" aria-label={`${site.siteName} home`}>
          <img src={site.logo || '/images/ivy-interio-logo.jpg'} alt="" width="46" height="46" />
          <span><b>{site.siteName}</b><i>{site.tagline}</i></span>
        </Link>
        <button type="button" className="burger" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen((v) => !v)}>
          <span className="sr">{open ? 'Close menu' : 'Open menu'}</span><s /><s /><s />
        </button>
        <nav id="primary-nav" className={`nav${open ? ' open' : ''}`} aria-label="Primary">
          <div className="has-sub">
            <NavLink to="/services" className="navlink">Services</NavLink>
            <ul className="sub" aria-label="Services">
              {SERVICE_LINKS.map(([l, to]) => <li key={to}><NavLink to={to}>{l}</NavLink></li>)}
            </ul>
          </div>
          {NAV.map(([l, to]) => <NavLink key={to} to={to} className="navlink">{l}</NavLink>)}
          <Link to="/get-a-quote" className="btn sm">Get a quote</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const s = useSite();
  const socials = [['Instagram', s.instagram], ['Facebook', s.facebook], ['LinkedIn', s.linkedin], ['YouTube', s.youtube], ['Pinterest', s.pinterest]].filter(([, u]) => u);
  return (
    <footer className="ftr">
      <div className="wrap ftr-grid">
        <div>
          <p className="ftr-brand">{s.siteName}</p>
          <p className="ftr-text">{s.footerText}</p>
          <address>
            {[s.addressLine1, s.addressLine2, s.addressLine3].filter(Boolean).map((l) => <span key={l}>{l}<br /></span>)}
          </address>
          <p><a href={`tel:+91${phoneDigits(s.phone)}`}>{s.phone}</a><br /><a href={`mailto:${s.email}`}>{s.email}</a></p>
          {s.workingHours && <p className="muted">{s.workingHours}</p>}
        </div>
        <nav aria-label="Services">
          <h2>Services</h2>
          <ul>{SERVICE_LINKS.map(([l, to]) => <li key={to}><Link to={to}>{l}</Link></li>)}</ul>
        </nav>
        <nav aria-label="Studio">
          <h2>Studio</h2>
          <ul>
            {[['About us', '/about'], ['Projects', '/projects'], ['Gallery', '/gallery'], ['Our team', '/team'], ['Testimonials', '/testimonials'], ['Journal', '/blog'], ['FAQs', '/faqs']].map(([l, to]) => <li key={to}><Link to={to}>{l}</Link></li>)}
          </ul>
        </nav>
        <nav aria-label="Contact and legal">
          <h2>Talk to us</h2>
          <ul>
            <li><Link to="/contact">Contact</Link></li><li><Link to="/get-a-quote">Get a quote</Link></li>
            <li><Link to="/privacy-policy">Privacy policy</Link></li><li><Link to="/terms-and-conditions">Terms and conditions</Link></li>
            {socials.map(([l, u]) => <li key={l}><a href={u} target="_blank" rel="noopener noreferrer">{l}</a></li>)}
          </ul>
        </nav>
      </div>
      <div className="wrap ftr-bottom"><span>© {new Date().getFullYear()} {s.siteName}. All rights reserved.</span><Link to="/admin">Admin</Link></div>
    </footer>
  );
}

export default function Layout() {
  const settings = useSettingsLoader();
  const { pathname, hash } = useLocation();
  useEffect(() => { if (!hash) window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' }); }, [pathname, hash]);
  const wa = phoneDigits(settings.whatsapp);
  return (
    <SiteProvider value={settings}>
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main" tabIndex={-1}><Outlet /></main>
      <Footer />
      {wa && <a className="wa" href={`https://wa.me/91${wa}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">WhatsApp</a>}
    </SiteProvider>
  );
}
