import { createContext, useContext, useEffect, useState } from "react";
import { getCached } from "../lib/api.js";
import * as seed from "../data/seedData.js";

// Fixed display order in code (matched by slug). Listed items come first, in this order.
const FIXED_ORDER = {
  service: [
    "residential-interiors",
    "bedroom-design",
    "living-room-design",
    "commercial-interiors",
    "office-interiors",
    "modular-kitchen",
  ],
};
function applyFixedOrder(type, items) {
  const order = FIXED_ORDER[type];
  if (!order) return items;
  const rank = (i) => {
    const r = order.indexOf(i.slug);
    return r === -1 ? order.length : r;
  };
  return [...items].sort((a, b) => rank(a) - rank(b));
}

const FALLBACK = {
  service: seed.services,
  project: seed.projects,
  gallery: seed.gallery,
  testimonial: seed.testimonials,
  blog: seed.blog,
  team: seed.team,
  faq: seed.faqs,
  banner: seed.banners,
};
// Types introduced in v2 may not exist in an older live database yet: show defaults until the admin adds their own.
const FALLBACK_WHEN_EMPTY = ["team", "faq", "banner"];

export function useContent(type) {
  const [state, setState] = useState({
    items: [],
    loading: true,
    error: null,
    fallback: false,
  });
  useEffect(() => {
    let alive = true;
    getCached(`/api/content?type=${encodeURIComponent(type)}`)
      .then((d) => {
        if (!alive) return;
        const items = Array.isArray(d.items) ? d.items : [];
        const noRecordsAtAll = d.hasAny === false;
        if (
          !items.length &&
          (noRecordsAtAll || FALLBACK_WHEN_EMPTY.includes(type))
        )
          setState({
            items: applyFixedOrder(type, FALLBACK[type]),
            loading: false,
            error: null,
            fallback: true,
          });
        else
          setState({
            items: applyFixedOrder(type, items),
            loading: false,
            error: null,
            fallback: false,
          });
      })
      .catch((error) => {
        if (alive)
          setState({
            items: applyFixedOrder(type, FALLBACK[type] || []),
            loading: false,
            error,
            fallback: true,
          });
      });
    return () => {
      alive = false;
    };
  }, [type]);
  return state;
}

export function usePage(key) {
  const [state, setState] = useState({ page: null, loading: true });
  useEffect(() => {
    let alive = true;
    getCached(`/api/pages/${encodeURIComponent(key)}`)
      .then((d) => alive && setState({ page: d.page, loading: false }))
      .catch(
        () =>
          alive &&
          setState({
            page: key === "home" ? seed.homePage : null,
            loading: false,
          }),
      );
    return () => {
      alive = false;
    };
  }, [key]);
  return state;
}

const SiteContext = createContext(seed.settings);
export const SiteProvider = SiteContext.Provider;
export const useSite = () => useContext(SiteContext);

export function useSettingsLoader() {
  const [settings, setSettings] = useState(seed.settings);
  useEffect(() => {
    let alive = true;
    getCached("/api/settings", 60000)
      .then(
        (d) =>
          alive &&
          d.settings &&
          setSettings({ ...seed.settings, ...d.settings }),
      )
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return settings;
}
export { FALLBACK };
