import { useEffect, useRef } from 'react';

/** Adds the "in" class once when the element scrolls into view. No-ops gracefully without IntersectionObserver. */
export default function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) { el.classList.add('in'); return undefined; }
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) { el.classList.add('in'); return undefined; } // already on screen: never leave it hidden
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
