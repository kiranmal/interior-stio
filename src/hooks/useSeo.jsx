import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getCached } from '../lib/api.js';
import { useSite } from './useData.js';

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!value) { el?.remove(); return; }
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', value);
}

/** <Seo title description image noindex />  — admin SEO entries for the current path override props, which override site defaults. */
export default function Seo({ title, description, image, noindex = false, type = 'website' }) {
  const { pathname } = useLocation();
  const site = useSite();
  const [override, setOverride] = useState(null);

  useEffect(() => {
    let alive = true;
    setOverride(null);
    getCached(`/api/seo?path=${encodeURIComponent(pathname)}`, 60000).then((d) => alive && setOverride(d.seo)).catch(() => {});
    return () => { alive = false; };
  }, [pathname]);

  useEffect(() => {
    const name = site.siteName || 'Ivy Interio';
    const t = override?.title || title;
    const finalTitle = t ? (t.includes(name) ? t : `${t} | ${name}`) : site.defaultTitle || name;
    const desc = override?.description || description || site.defaultDescription || '';
    const img = override?.ogImage || image || site.defaultOgImage || '';
    const canonical = override?.canonical || `${window.location.origin}${pathname === '/' ? '' : pathname}`;
    document.title = finalTitle;
    setMeta('name', 'description', desc);
    setMeta('name', 'robots', override?.noindex || noindex ? 'noindex, nofollow' : 'index, follow');
    setMeta('property', 'og:title', finalTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:site_name', name);
    setMeta('property', 'og:image', img);
    setMeta('name', 'twitter:card', img ? 'summary_large_image' : 'summary');
    setMeta('name', 'twitter:title', finalTitle);
    setMeta('name', 'twitter:description', desc);
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = canonical;
  }, [override, title, description, image, noindex, type, pathname, site]);
  return null;
}
