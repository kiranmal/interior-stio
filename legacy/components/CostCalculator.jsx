import { useState } from "react";
import { Calculator, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

function CostCalculator() {
  const [propertyType, setPropertyType] = useState("2 BHK");
  const [area, setArea] = useState("");
  const [quality, setQuality] = useState("Premium");
  const [estimate, setEstimate] = useState(null);

  const rates = {
    Standard: 1400,
    Premium: 2000,
    Luxury: 2800,
  };

  const calculateEstimate = () => {
    const numericArea = Number(area);

    if (!numericArea || numericArea < 300) {
      setEstimate(null);
      return;
    }

    const rate = rates[quality];
    const lower = numericArea * rate;
    const upper = numericArea * (rate + 400);

    setEstimate({
      lower,
      upper,
    });
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    }

    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    }

    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <section className="bg-[#f5f1e8] px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1f6b4d]">
            Plan Your Interior
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight text-[#17382b] sm:text-5xl">
            Get an estimated
            <span className="text-[#1f6b4d]"> interior budget.</span>
          </h2>

          <p className="mt-5 max-w-xl leading-7 text-slate-600">
            Get a quick idea of your interior investment based on your space
            and preferred finish level.
          </p>

          <div className="mt-7 flex items-start gap-3">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0 text-[#1f6b4d]"
            />
            <p className="text-sm leading-6 text-slate-600">
              The estimate is indicative. Final pricing depends on design,
              materials, measurements and project requirements.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#d9dfd9] bg-white p-6 shadow-xl shadow-[#174d39]/5 sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf3ed] text-[#174d39]">
              <Calculator size={24} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#17382b]">
                Interior Cost Calculator
              </h3>
              <p className="text-sm text-slate-500">
                Get your approximate budget
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Property Type
              </label>

              <select
                value={propertyType}
                onChange={(event) => setPropertyType(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#1f6b4d] focus:bg-white"
              >
                <option>1 BHK</option>
                <option>2 BHK</option>
                <option>3 BHK</option>
                <option>4 BHK</option>
                <option>Villa</option>
                <option>Office</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Area (sq. ft.)
              </label>

              <input
                type="number"
                min="300"
                value={area}
                onChange={(event) => setArea(event.target.value)}
                placeholder="e.g. 1200"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#1f6b4d] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Finish Level
              </label>

              <div className="grid grid-cols-3 gap-2">
                {Object.keys(rates).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuality(item)}
                    className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                      quality === item
                        ? "border-[#174d39] bg-[#174d39] text-white"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-[#9fbdac]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={calculateEstimate}
            className="mt-6 w-full rounded-xl bg-[#174d39] px-5 py-4 font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#236b4d] hover:shadow-lg"
          >
            Calculate Estimate
          </button>

          {estimate && (
            <div className="calculator-result mt-6 rounded-2xl bg-[#eef5f0] p-5">
              <p className="text-sm font-semibold text-[#1f6b4d]">
                Estimated budget for {propertyType}
              </p>

              <p className="mt-2 text-3xl font-black text-[#17382b]">
                {formatPrice(estimate.lower)} - {formatPrice(estimate.upper)}
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Approximate estimate for {area} sq. ft. Final quotation will
                depend on the selected design and materials.
              </p>

              <Link
                to="/contact"
                className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-[#174d39] shadow-sm transition hover:bg-[#174d39] hover:text-white"
              >
                Get Exact Quote
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CostCalculator;