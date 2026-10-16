import { useState } from "react";
import { request } from "../lib/api.js";
import { inr } from "../lib/format.js";

const RATES = { Standard: 1400, Premium: 2000, Luxury: 2800 };
const money = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

// Rates above are per sq ft of CARPET area. Built-up and super built-up
// areas include walls and common areas, so they are scaled down to a
// carpet-area equivalent. Change these numbers to tune the estimate.
const AREA_TYPES = {
  "Carpet Area": 1,
  "Built-up Area": 0.85,
  "Super Built-up Area": 0.7,
};

export default function CostCalculator() {
  const [area, setArea] = useState("");
  const [quality, setQuality] = useState("Premium");
  const [propertyType, setPropertyType] = useState("2 BHK");
  const [areaType, setAreaType] = useState("Carpet Area");
  const [contact, setContact] = useState({ name: "", phone: "" });
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const n = Number(area);
  const valid = n >= 300 && n <= 20000;
  const carpet = n * AREA_TYPES[areaType];
  const lower = valid ? Math.round(carpet * RATES[quality]) : 0;
  const upper = valid ? Math.round(carpet * (RATES[quality] + 400)) : 0;

  async function send(e) {
    e.preventDefault();
    if (!valid) {
      setStatus({
        state: "error",
        message: "Enter an area between 300 and 20,000 sq ft.",
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
          propertyType,
          areaType,
          area: n,
          quality,
          estimatedLower: lower,
          estimatedUpper: upper,
          message: `Calculator estimate (${areaType}): ${inr(lower)} to ${inr(upper)}`,
        },
      });
      setStatus({
        state: "ok",
        message: "Thank you. We will call you with a detailed estimate.",
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
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            {["1 BHK", "2 BHK", "3 BHK", "4 BHK +", "Villa", "Office"].map(
              (o) => (
                <option key={o}>{o}</option>
              ),
            )}
          </select>
        </div>
        <div className="field">
          <label htmlFor="c-area-type">Type of Area</label>
          <select
            id="c-area-type"
            value={areaType}
            onChange={(e) => setAreaType(e.target.value)}
          >
            {Object.keys(AREA_TYPES).map((o) => (
              <option key={o}>{o}</option>
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
        {Object.keys(RATES).map((q) => (
          <label key={q} className={quality === q ? "on" : ""}>
            <input
              type="radio"
              name="quality"
              checked={quality === q}
              onChange={() => setQuality(q)}
            />
            {q}
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
            <small>
              Final cost depends on scope, materials and site conditions.
            </small>
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
