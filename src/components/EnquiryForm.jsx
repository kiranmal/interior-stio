import { useState } from 'react';
import { request } from '../lib/api.js';

const SERVICES = ['Residential Interiors', 'Commercial Interiors', 'Office Interiors', 'Modular Kitchen', 'Bedroom Design', 'Living Room Design', 'Other'];
const BUDGETS = ['Under ₹5 L', '₹5 – 10 L', '₹10 – 20 L', '₹20 – 40 L', '₹40 L +', 'Not sure yet'];
const empty = { name: '', phone: '', email: '', city: '', service: '', budget: '', propertyType: '', message: '', website: '' };

export function validate(v, quote) {
  const e = {};
  if (v.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!/^[6-9]\d{9}$/.test(v.phone.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, ''))) e.phone = 'Enter a valid 10-digit mobile number.';
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) e.email = 'Enter a valid email address.';
  if (v.message.trim().length < 5) e.message = quote ? 'Tell us a little about your space.' : 'Please write a short message.';
  return e;
}

export default function EnquiryForm({ variant = 'contact', defaultService = '' }) {
  const quote = variant === 'quote';
  const [v, setV] = useState({ ...empty, service: defaultService });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const errs = validate(v, quote);
    setErrors(errs);
    if (Object.keys(errs).length) { setStatus({ state: 'error', message: 'Please fix the highlighted fields.' }); return; }
    setStatus({ state: 'sending', message: '' });
    try {
      const res = await request('/api/enquiry', { method: 'POST', body: { ...v, source: quote ? 'quote' : 'contact-form' } });
      setStatus({ state: 'ok', message: res.message || 'Thank you. We will contact you shortly.' });
      setV({ ...empty });
    } catch (err) { setStatus({ state: 'error', message: err.message }); }
  }

  const f = (k, label, props = {}) => (
    <div className={`field${errors[k] ? ' bad' : ''}`}>
      <label htmlFor={`f-${variant}-${k}`}>{label}</label>
      <input id={`f-${variant}-${k}`} value={v[k]} onChange={set(k)} aria-invalid={Boolean(errors[k])} aria-describedby={errors[k] ? `e-${variant}-${k}` : undefined} {...props} />
      {errors[k] && <small id={`e-${variant}-${k}`} className="err">{errors[k]}</small>}
    </div>
  );

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="grid2">
        {f('name', 'Your name', { autoComplete: 'name', required: true })}
        {f('phone', 'Mobile number', { type: 'tel', inputMode: 'numeric', autoComplete: 'tel', required: true, placeholder: '10-digit number' })}
        {f('email', 'Email (optional)', { type: 'email', autoComplete: 'email' })}
        {f('city', 'City / locality', { autoComplete: 'address-level2' })}
        <div className="field"><label htmlFor={`f-${variant}-service`}>Service</label>
          <select id={`f-${variant}-service`} value={v.service} onChange={set('service')}><option value="">Select a service</option>{SERVICES.map((s) => <option key={s}>{s}</option>)}</select></div>
        {quote
          ? <div className="field"><label htmlFor="f-quote-budget">Approximate budget</label><select id="f-quote-budget" value={v.budget} onChange={set('budget')}><option value="">Select a range</option>{BUDGETS.map((s) => <option key={s}>{s}</option>)}</select></div>
          : <div className="field" />}
      </div>
      {quote && <div className="field"><label htmlFor="f-quote-property">Property type and size</label><input id="f-quote-property" value={v.propertyType} onChange={set('propertyType')} placeholder="e.g. 3 BHK apartment, 1,400 sq ft" maxLength={50} /></div>}
      <div className={`field${errors.message ? ' bad' : ''}`}>
        <label htmlFor={`f-${variant}-message`}>{quote ? 'About your project' : 'Message'}</label>
        <textarea id={`f-${variant}-message`} rows={5} value={v.message} onChange={set('message')} maxLength={2000} aria-invalid={Boolean(errors.message)} />
        {errors.message && <small className="err">{errors.message}</small>}
      </div>
      <div className="hp" aria-hidden="true"><label>Leave this empty<input tabIndex={-1} autoComplete="off" value={v.website} onChange={set('website')} /></label></div>
      <button className="btn" disabled={status.state === 'sending'}>{status.state === 'sending' ? 'Sending…' : quote ? 'Request my quote' : 'Send message'}</button>
      <p className={`form-msg ${status.state}`} role="status" aria-live="polite">{status.message}</p>
    </form>
  );
}
