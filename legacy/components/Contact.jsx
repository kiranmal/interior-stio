import { useMemo, useState } from 'react';
import { contact } from '../data/content.js';

const API = import.meta.env.VITE_API_URL || '';

const rates = {
  Standard: 1400,
  Premium: 2000,
  Luxury: 2800
};

const initialForm = {
  name: '',
  phone: '',
  email: '',
  city: '',
  service: 'Complete Home Interior',
  message: ''
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [calculator, setCalculator] = useState({ propertyType: '2 BHK', area: '', quality: 'Premium' });
  const [state, setState] = useState({ status: 'idle', msg: '' });
  const [calcState, setCalcState] = useState({ status: 'idle', msg: '' });
  const [estimate, setEstimate] = useState(null);

  const setFormValue = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const setCalcValue = (key) => (event) => {
    setCalculator((current) => ({ ...current, [key]: event.target.value }));
  };

  const calculate = () => {
    const area = Number(calculator.area);
    if (!area || area < 300) {
      setEstimate(null);
      setCalcState({ status: 'error', msg: 'Please enter an area of at least 300 sq. ft.' });
      return;
    }

    const rate = rates[calculator.quality];
    setEstimate({
      lower: area * rate,
      upper: area * (rate + 400)
    });
    setCalcState({ status: 'idle', msg: '' });
  };

  const formatPrice = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const estimatedRange = useMemo(() => {
    if (!estimate) return '';
    return `${formatPrice(estimate.lower)} - ${formatPrice(estimate.upper)}`;
  }, [estimate]);

  async function submitEnquiry(event) {
    event.preventDefault();
    setState({ status: 'loading', msg: '' });

    try {
      const res = await fetch(`${API}/api/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          source: 'contact-form'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not submit enquiry.');

      setForm(initialForm);
      setState({ status: 'ok', msg: 'Thank you! Your enquiry has been received.' });
    } catch (error) {
      setState({ status: 'error', msg: error.message || 'Could not send. Please call us.' });
    }
  }

  async function submitCalculator(event) {
    event.preventDefault();
    const area = Number(calculator.area);

    if (!area || area < 300) {
      setCalcState({ status: 'error', msg: 'Please enter a valid area first.' });
      return;
    }

    if (!estimate) {
      calculate();
      return;
    }

    setCalcState({ status: 'loading', msg: '' });

    try {
      const res = await fetch(`${API}/api/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name || 'Calculator Lead',
          phone: form.phone,
          email: form.email,
          city: form.city,
          service: form.service,
          message: form.message,
          source: 'cost-calculator',
          propertyType: calculator.propertyType,
          area,
          quality: calculator.quality,
          estimatedLower: estimate.lower,
          estimatedUpper: estimate.upper
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save calculator enquiry.');

      setCalcState({ status: 'ok', msg: 'Your estimate request has been sent to our team.' });
    } catch (error) {
      setCalcState({ status: 'error', msg: error.message || 'Could not send. Please try again.' });
    }
  }

  return (
    <>
      <section id="calculator" className="section calculator">
        <div className="wrap calc-grid">
          <div>
            <p className="eyebrow" style={{ color: '#e9d394' }}>Plan Your Interior</p>
            <h2>Get an <em>approximate</em> budget.</h2>
            <p className="sub">
              Choose your property, area and finish level to get an indicative
              interior budget. Our team can then prepare a customised quote.
            </p>
            <p className="sub" style={{ fontSize: '.78rem' }}>
              Indicative estimate only. Final pricing depends on design, materials,
              site conditions and project requirements.
            </p>
          </div>

          <div className="calc-card">
            <form className="calc-form" onSubmit={submitCalculator}>
              <div className="field">
                <label htmlFor="propertyType">Property Type</label>
                <select id="propertyType" value={calculator.propertyType} onChange={setCalcValue('propertyType')}>
                  <option>1 BHK</option>
                  <option>2 BHK</option>
                  <option>3 BHK</option>
                  <option>4 BHK</option>
                  <option>Villa</option>
                  <option>Office</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="area">Area (sq. ft.)</label>
                <input id="area" type="number" min="300" placeholder="e.g. 1200" value={calculator.area} onChange={setCalcValue('area')} />
              </div>

              <div className="field full">
                <label>Finish Level</label>
                <div className="quality">
                  {Object.keys(rates).map((quality) => (
                    <button
                      key={quality}
                      type="button"
                      className={calculator.quality === quality ? 'active' : ''}
                      onClick={() => setCalculator((current) => ({ ...current, quality }))}
                    >
                      {quality}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label htmlFor="calcName">Name</label>
                <input id="calcName" value={form.name} onChange={setFormValue('name')} placeholder="Your name" />
              </div>

              <div className="field">
                <label htmlFor="calcPhone">Phone</label>
                <input id="calcPhone" value={form.phone} onChange={setFormValue('phone')} placeholder="10-digit mobile" inputMode="tel" />
              </div>

              <div className="field full">
                <label htmlFor="calcEmail">Email</label>
                <input id="calcEmail" type="email" value={form.email} onChange={setFormValue('email')} placeholder="you@example.com" />
              </div>

              <div className="field full">
                <button className="btn" type="button" onClick={calculate}>Calculate Estimate →</button>
              </div>
            </form>

            {estimate && (
              <div className="estimate">
                <small>Estimated budget for {calculator.propertyType}</small>
                <strong>{estimatedRange}</strong>
                <span>{calculator.area} sq. ft. · {calculator.quality} finish</span>
                <div className="calc-actions">
                  <a className="btn gold" href="#contact">Request Full Quote</a>
                  <button className="btn" type="button" onClick={submitCalculator} disabled={calcState.status === 'loading'}>
                    {calcState.status === 'loading' ? 'Sending…' : 'Send to Ivy'}
                  </button>
                </div>
              </div>
            )}

            {calcState.msg && <p className={`form-message ${calcState.status}`} style={{ marginTop: 14 }}>{calcState.msg}</p>}
          </div>
        </div>
      </section>

      <section id="contact" className="section contact">
        <div className="wrap contact-grid">
          <div className="contact-card">
            <p className="eyebrow" style={{ color: '#e9d394' }}>Free Consultation</p>
            <h2>Let's create a space you love.</h2>
            <p>Tell us what you are planning and our team will get in touch with you.</p>

            <div className="contact-details">
              {contact.address.map((line) => <span key={line}>{line}</span>)}
              <a href={`tel:+91${contact.phone}`}>+91 {contact.phone}</a>
              <a href={`https://wa.me/91${contact.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp: {contact.whatsapp}</a>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </div>
          </div>

          <form className="contact-form" onSubmit={submitEnquiry}>
            <div className="calc-form">
              <div className="field">
                <label htmlFor="name">Name *</label>
                <input id="name" required value={form.name} onChange={setFormValue('name')} placeholder="Your name" />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone *</label>
                <input id="phone" required value={form.phone} onChange={setFormValue('phone')} placeholder="98765 43210" inputMode="tel" />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={form.email} onChange={setFormValue('email')} placeholder="you@example.com" />
              </div>
              <div className="field">
                <label htmlFor="city">City / Area</label>
                <input id="city" value={form.city} onChange={setFormValue('city')} placeholder="Ghaziabad / Noida" />
              </div>
              <div className="field full">
                <label htmlFor="service">Service Required</label>
                <select id="service" value={form.service} onChange={setFormValue('service')}>
                  <option>Complete Home Interior</option>
                  <option>Residential Interior</option>
                  <option>Commercial Interior</option>
                  <option>Office Interior</option>
                  <option>Modular Kitchen</option>
                  <option>Bedroom Design</option>
                  <option>Living Room Design</option>
                  <option>Custom Furniture</option>
                </select>
              </div>
              <div className="field full">
                <label htmlFor="message">Project Details</label>
                <textarea id="message" rows="5" value={form.message} onChange={setFormValue('message')} placeholder="Tell us about your space, requirements, timeline or budget..." />
              </div>
              <div className="field full">
                <button className="btn" disabled={state.status === 'loading'}>
                  {state.status === 'loading' ? 'Sending…' : 'Send Enquiry →'}
                </button>
              </div>
            </div>
            {state.msg && <p className={`form-message ${state.status}`} style={{ marginTop: 14 }}>{state.msg}</p>}
          </form>
        </div>
      </section>
    </>
  );
}
