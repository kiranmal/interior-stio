import { useEffect, useState } from "react";
import { getCached, request } from "../lib/api.js";
import { inr } from "../lib/format.js";
import { DEFAULT_CALCULATOR } from "../lib/calculatorDefaults.js";

const money = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

// Merge whatever the admin saved over the defaults, so a missing/old field never breaks the page.
function normalise(c) {
  const list = (v, fallback) => (Array.isArray(v) && v.length ? v : fallback);
  return {
    ...DEFAULT_CALCULATOR,
    ...(c || {}),
    finishLevels: list(c?.finishLevels, DEFAULT_CALCULATOR.finishLevels),
    areaTypes: list(c?.areaTypes, DEFAULT_CALCULATOR.areaTypes),
    propertyTypes: list(c?.propertyTypes, DEFAULT_CALCULATOR.propertyTypes),
  };
}

// Rates are per sq ft of CARPET area. Built-up / super built-up areas are scaled down
// to a carpet-area equivalent using the admin-defined factor. All numbers now come
// from Admin > Cost calculator.
export default function CostCalculator() {
  const [cfg, setCfg] = useState(DEFAULT_CALCULATOR);
  const [area, setArea] = useState("");
  const [quality, setQuality] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [areaType, setAreaType] = useState("");
  const [contact, setContact] = useState({ name: "", phone: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  useEffect(() => {
    let alive = true;
    getCached("/api/calculator", 30000)
      .then((d) => alive && d.config && setCfg(normalise(d.config)))
      .catch(() => {}); // keep defaults if the API is unreachable
    return () => {
      alive = false;
    };
  }, []);

  // Selected values fall back to the first/default option if the admin renamed or removed one.
  const level =
    cfg.finishLevels.find((l) => l.name === quality) ||
    cfg.finishLevels.find((l) => l.name === cfg.defaultFinish) ||
    cfg.finishLevels[0];
  const aType = cfg.areaTypes.find((a) => a.name === areaType) || cfg.areaTypes[0];
  const pType =
    cfg.propertyTypes.find((p) => p.name === propertyType) ||
    cfg.propertyTypes[Math.min(1, cfg.propertyTypes.length - 1)];

  const n = Number(area);
  const valid = n >= cfg.minArea && n <= cfg.maxArea;
  const carpet = n * aType.factor;
  const mult = Number(pType.multiplier) || 1;
  const lower = valid ? Math.round(carpet * level.rate * mult) : 0;
  const upper = valid
    ? Math.round(carpet * (level.rate + (Number(level.rangeAdd) || 0)) * mult)
    : 0;

  async function send(e) {
    e.preventDefault();
    if (!valid) {
      setStatus({
        state: "error",
        message: `Enter an area between ${cfg.minArea.toLocaleString("en-IN")} and ${cfg.maxArea.toLocaleString("en-IN")} sq ft.`,
      });
      return;
    }
    setStatus({ state: "sending", message: "" });
    try {
      await request("/api/enquiry", {
        method: "POST",
        body: {
          ...contact,
          source: "cost-calculator",
          propertyType: pType.name,
          areaType: aType.name,
          area: n,
          quality: level.name,
          estimatedLower: lower,
          estimatedUpper: upper,
          message: `Calculator estimate (${aType.name}): ${inr(lower)} to ${inr(upper)}`,
        },
      });
      setStatus({
        state: "ok",
        message: cfg.successMessage || DEFAULT_CALCULATOR.successMessage,
      });
    } catch (err) {
      setStatus({ state: "error", message: err.message });
    }
  }

  return (
    <div className="calc">
      <div className="grid2">
        <div className="field">
          <label htmlFor="c-type">Property</label>
          <select
            id="c-type"
            value={pType.name}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            {cfg.propertyTypes.map((o) => (
              <option key={o.name}>{o.name}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="c-area-type">Type of Area</label>
          <select
            id="c-area-type"
            value={aType.name}
            onChange={(e) => setAreaType(e.target.value)}
          >
            {cfg.areaTypes.map((o) => (
              <option key={o.name}>{o.name}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="c-area">Area (sq ft)</label>
          <input
            id="c-area"
            inputMode="numeric"
            value={area}
            onChange={(e) => setArea(e.target.value.replace(/\D/g, ""))}
            placeholder="e.g. 1200"
          />
        </div>
      </div>
      <fieldset className="seg">
        <legend>Finish level</legend>
        {cfg.finishLevels.map((l) => (
          <label key={l.name} className={level.name === l.name ? "on" : ""}>
            <input
              type="radio"
              name="quality"
              checked={level.name === l.name}
              onChange={() => setQuality(l.name)}
            />
            {l.name}
          </label>
        ))}
      </fieldset>
      <div className="estimate" aria-live="polite">
        {valid ? (
          <>
            <span>Indicative range</span>
            <strong>
              {money(lower)} – {money(upper)}
            </strong>
            <small>{cfg.disclaimer}</small>
          </>
        ) : (
          <small>Enter your area to see an indicative range.</small>
        )}
      </div>
      <form onSubmit={send} className="grid2 calc-send" noValidate>
        <div className="field">
          <label htmlFor="c-name">Name</label>
          <input
            id="c-name"
            value={contact.name}
            onChange={(e) => setContact({ ...contact, name: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="c-phone">Mobile</label>
          <input
            id="c-phone"
            type="tel"
            inputMode="numeric"
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            required
          />
        </div>
        <button className="btn" disabled={status.state === "sending"}>
          Send me a detailed estimate
        </button>
        <p
          className={`form-msg ${status.state}`}
          role="status"
          aria-live="polite"
        >
          {status.message}
        </p>
      </form>
    </div>
  );
}
