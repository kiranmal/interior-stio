import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { SiteProvider, useSettingsLoader, useSite } from "../hooks/useData.js";
import { phoneDigits } from "../lib/format.js";
import { Icon } from "./icons.jsx";

export const SERVICE_LINKS = [
  ["Residential Interiors", "/residential-interiors"],
  ["Commercial Interiors", "/commercial-interiors"],
  ["Office Interiors", "/office-interiors"],
  ["Modular Kitchen", "/modular-kitchen"],
  ["Bedroom Design", "/bedroom-design"],
  ["Living Room Design", "/living-room-design"],
];
const NAV_BEFORE = [["Home", "/"]];
const NAV_AFTER = [
  ["About", "/about"],
  ["Projects", "/projects"],
  ["Gallery", "/gallery"],
  ["Our Process", "/#process"],
  ["Contact", "/contact"],
];

function Header() {
  const site = useSite();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`hdr${solid || open ? " solid" : ""}${pathname === "/" ? " on-hero" : ""}`}
    >
      <div className="hdr-in">
        <Link to="/" className="brand" aria-label={`${site.siteName} home`}>
          <img
            src={site.logo || "/images/ivy-interio-logo.jpg"}
            alt=""
            width="40"
            height="40"
          />
          <span>
            <b>{site.siteName}</b>
            <i>{site.tagline}</i>
          </span>
        </Link>
        <button
          type="button"
          className="burger"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr">{open ? "Close menu" : "Open menu"}</span>
          <s />
          <s />
          <s />
        </button>
        <nav
          id="primary-nav"
          className={`nav${open ? " open" : ""}`}
          aria-label="Primary"
        >
          {NAV_BEFORE.map(([l, to]) => (
            <NavLink key={to} to={to} end className="navlink">
              {l}
            </NavLink>
          ))}
          <div className="has-sub">
            <NavLink to="/services" className="navlink">
              Services
            </NavLink>
            <ul className="sub" aria-label="Services">
              {SERVICE_LINKS.map(([l, to]) => (
                <li key={to}>
                  <NavLink to={to}>{l}</NavLink>
                </li>
              ))}
            </ul>
          </div>
          {NAV_AFTER.map(([l, to]) =>
            to.includes("#") ? (
              <Link key={to} to={to} className="navlink">
                {l}
              </Link>
            ) : (
              <NavLink key={to} to={to} className="navlink">
                {l}
              </NavLink>
            ),
          )}
          <Link to="/get-a-quote" className="btn sm">
            Get a Quote <Icon name="arrow" size={13} />
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const s = useSite();
  const socials = [
    ["Instagram", s.instagram, "instagram"],
    ["Facebook", s.facebook, "facebook"],
    ["YouTube", s.youtube, "youtube"],
    ["LinkedIn", s.linkedin, "linkedin"],
    ["Pinterest", s.pinterest, "pinterest"],
  ].filter(([, u]) => u);
  const address = [s.addressLine1, s.addressLine2, s.addressLine3].filter(Boolean).join(", ");
  return (
    <footer className="ftr">
      <div className="wrap ftr-grid">
        <div className="ftr-about">
          <Link to="/" className="ftr-logo" aria-label={`${s.siteName} home`}>
            <img src={s.logo || "/images/ivy-interio-logo.jpg"} alt="" width="40" height="40" />
            <span>
              <b>{s.siteName}</b>
              <i>{s.tagline}</i>
            </span>
          </Link>
          <p className="ftr-text">{s.footerText}</p>
          {socials.length > 0 && (
            <ul className="social" aria-label="Social media">
              {socials.map(([l, u, ic]) => (
                <li key={l}>
                  <a href={u} target="_blank" rel="noopener noreferrer" aria-label={l}>
                    <Icon name={ic} size={16} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <nav aria-label="Services">
          <h2>Services</h2>
          <ul>
            {SERVICE_LINKS.map(([l, to]) => (
              <li key={to}>
                <Link to={to}>{l}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Quick links">
          <h2>Quick Links</h2>
          <ul>
            {[
              ["Home", "/"],
              ["About", "/about"],
              ["Projects", "/projects"],
              ["Gallery", "/gallery"],
              ["Our Process", "/#process"],
              ["Contact", "/contact"],
            ].map(([l, to]) => (
              <li key={to}>
                <Link to={to}>{l}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2>Contact Us</h2>
          <ul className="ftr-contact">
            {address && (
              <li>
                <Icon name="pin" size={16} />
                <address>{address}</address>
              </li>
            )}
            {s.phone && (
              <li>
                <Icon name="phone" size={16} />
                <a href={`tel:+91${phoneDigits(s.phone)}`}>{s.phone}</a>
              </li>
            )}
            {s.email && (
              <li>
                <Icon name="mail" size={16} />
                <a href={`mailto:${s.email}`}>{s.email}</a>
              </li>
            )}
            {s.workingHours && (
              <li>
                <Icon name="clock" size={16} />
                <span>{s.workingHours}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="wrap ftr-bottom">
        <span>
          © {new Date().getFullYear()} {s.siteName}. All rights reserved.
        </span>
        <span className="legal">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
          <Link to="/admin">Admin</Link>
        </span>
      </div>
    </footer>
  );
}

export default function Layout() {
  const settings = useSettingsLoader();
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({
        top: 0,
        behavior: "instant" in window ? "instant" : "auto",
      });
      return undefined;
    }
    // sections render after the CMS responds, so retry briefly until the anchor exists
    let tries = 0;
    const timer = setInterval(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el || ++tries > 20) {
        clearInterval(timer);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
    return () => clearInterval(timer);
  }, [pathname, hash]);
  const wa = phoneDigits(settings.whatsapp);
  return (
    <SiteProvider value={settings}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      {wa && (
        <a
          className="wa"
          href={`https://wa.me/91${wa}?text=${encodeURIComponent(
            `Hello ${settings.siteName || "Ivy Interio"}, I want to discuss my interior project.`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chat with ${settings.siteName || "Ivy Interio"} on WhatsApp`}
        >
          <img src="/images/whatsapp.svg" alt="" width="56" height="56" />
        </a>
      )}
    </SiteProvider>
  );
}
