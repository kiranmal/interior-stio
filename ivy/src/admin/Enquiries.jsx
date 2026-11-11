import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAdmin } from './context.js';
import { Confirm, Modal, Pager, useToast, when } from './ui.jsx';
import { inr, phoneDigits } from '../lib/format.js';

const STATUS = ['new', 'contacted', 'discussion', 'site-visit', 'converted', 'closed'];
const SOURCES = { 'contact-form': 'Contact form', quote: 'Quote form', 'cost-calculator': 'Cost calculator' };

function Detail({ id, onClose, onChanged }) {
  const { api, admin } = useAdmin();
  const [e, setE] = useState(null); const [note, setNote] = useState(''); const [err, setErr] = useState(''); const [del, setDel] = useState(false);
  useEffect(() => { api(`/api/admin/enquiries/${id}`).then((r) => setE(r.enquiry)).catch((x) => setErr(x.message)); }, [api, id]);
  async function status(v) { try { const r = await api(`/api/admin/enquiries/${id}`, { method: 'PATCH', body: { status: v } }); setE(r.enquiry); onChanged(); } catch (x) { setErr(x.message); } }
  async function addNote(ev) { ev.preventDefault(); if (!note.trim()) return; try { const r = await api(`/api/admin/enquiries/${id}/notes`, { method: 'POST', body: { text: note } }); setE(r.enquiry); setNote(''); } catch (x) { setErr(x.message); } }
  async function remove() { try { await api(`/api/admin/enquiries/${id}`, { method: 'DELETE' }); onChanged(true); onClose(); } catch (x) { setErr(x.message); setDel(false); } }
  return (
    <Modal wide title={e ? `Enquiry from ${e.name}` : 'Enquiry'} onClose={onClose}>
      {err && <p className="a-error" role="alert">{err}</p>}
      {!e ? <p className="a-muted">Loading…</p> : <>
        <dl className="a-dl">
          <div><dt>Phone</dt><dd><a href={`tel:+91${phoneDigits(e.phone)}`}>{e.phone}</a> · <a href={`https://wa.me/91${phoneDigits(e.phone)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a></dd></div>
          <div><dt>Email</dt><dd>{e.email ? <a href={`mailto:${e.email}`}>{e.email}</a> : '–'}</dd></div>
          <div><dt>City</dt><dd>{e.city || '–'}</dd></div><div><dt>Service</dt><dd>{e.service || '–'}</dd></div>
          <div><dt>Source</dt><dd>{SOURCES[e.source] || e.source}</dd></div><div><dt>Received</dt><dd>{when(e.createdAt)}</dd></div>
          {e.budget && <div><dt>Budget</dt><dd>{e.budget}</dd></div>}{e.propertyType && <div><dt>Property</dt><dd>{e.propertyType}</dd></div>}
          {e.area > 0 && <div><dt>Area</dt><dd>{e.area} sq ft</dd></div>}{e.quality && <div><dt>Finish</dt><dd>{e.quality}</dd></div>}
          {e.estimatedLower > 0 && <div><dt>Estimate</dt><dd>{inr(e.estimatedLower)} to {inr(e.estimatedUpper)}</dd></div>}
          <div className="full"><dt>Message</dt><dd className="pre">{e.message || '–'}</dd></div>
        </dl>
        <label className="a-field"><span>Status</span><select value={e.status} onChange={(ev) => status(ev.target.value)}>{STATUS.map((s) => <option key={s}>{s}</option>)}</select></label>
        <h3>Internal notes</h3>
        <ul className="a-notes">{(e.notes || []).map((n, i) => <li key={i}><p>{n.text}</p><small>{n.by} · {when(n.at)}</small></li>)}{!e.notes?.length && <li className="a-muted">No notes yet.</li>}</ul>
        <form onSubmit={addNote} className="a-inline"><input value={note} onChange={(ev) => setNote(ev.target.value)} placeholder="Add a private note…" maxLength={1000} aria-label="Note" /><button className="a-btn primary sm">Add note</button></form>
        {admin.role === 'admin' && <div className="a-actions end"><button type="button" className="a-btn danger" onClick={() => setDel(true)}>Delete enquiry</button></div>}
        {del && <Confirm text="Delete this enquiry permanently?" onConfirm={remove} onCancel={() => setDel(false)} />}
      </>}
    </Modal>
  );
}

export default function Enquiries() {
  const { api } = useAdmin();
  const [params, setParams] = useSearchParams();
  const [toast, toastNode] = useToast();
  const [f, setF] = useState({ q: '', status: params.get('status') || '', source: '', from: '', to: '' });
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ enquiries: [], total: 0, pages: 1, loading: true, error: '' });
  const open = params.get('open');

  const load = useCallback(async () => {
    setData((d) => ({ ...d, loading: true, error: '' }));
    const qs = new URLSearchParams({ page, limit: 15, ...Object.fromEntries(Object.entries(f).filter(([, v]) => v)) });
    try { const r = await api(`/api/admin/enquiries?${qs}`); setData({ ...r, loading: false, error: '' }); }
    catch (e) { setData((d) => ({ ...d, loading: false, error: e.message })); }
  }, [api, f, page]);
  useEffect(() => { const t = setTimeout(load, f.q ? 250 : 0); return () => clearTimeout(t); }, [load, f.q]);
  const upd = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setPage(1); };
  const close = () => { const p = new URLSearchParams(params); p.delete('open'); setParams(p, { replace: true }); };

  return (
    <>
      <div className="a-head"><div><h1>Enquiries</h1><p className="a-muted">Leads from the contact, quote and calculator forms.</p></div></div>
      {toastNode}
      <div className="a-card">
        <div className="a-filters five">
          <input type="search" placeholder="Search name, phone, email, city…" value={f.q} onChange={upd('q')} aria-label="Search" />
          <select value={f.status} onChange={upd('status')} aria-label="Status"><option value="">All statuses</option>{STATUS.map((s) => <option key={s}>{s}</option>)}</select>
          <select value={f.source} onChange={upd('source')} aria-label="Source"><option value="">All sources</option>{Object.entries(SOURCES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
          <input type="date" value={f.from} onChange={upd('from')} aria-label="From date" /><input type="date" value={f.to} onChange={upd('to')} aria-label="To date" />
        </div>
        {data.error && <p className="a-error" role="alert">{data.error} <button type="button" className="a-btn sm" onClick={load}>Retry</button></p>}
        <div className="a-table-wrap"><table className="a-table">
          <thead><tr><th>Received</th><th>Name</th><th>Contact</th><th>Service</th><th>Source</th><th>Status</th><th /></tr></thead>
          <tbody>
            {data.loading && <tr><td colSpan={7} className="a-empty">Loading…</td></tr>}
            {!data.loading && !data.enquiries.length && <tr><td colSpan={7} className="a-empty">No enquiries match.</td></tr>}
            {data.enquiries.map((e) => (
              <tr key={e._id}><td>{when(e.createdAt)}</td><td><strong>{e.name}</strong><small>{e.city}</small></td><td>{e.phone}<small>{e.email}</small></td><td>{e.service || '–'}</td><td>{SOURCES[e.source] || e.source}</td>
                <td><span className={`a-pill st-${e.status}`}>{e.status}</span></td><td><button type="button" className="a-btn sm" onClick={() => setParams({ open: e._id })}>View</button></td></tr>
            ))}
          </tbody>
        </table></div>
        <Pager page={data.page || page} pages={data.pages} total={data.total} onPage={setPage} />
      </div>
      {open && <Detail id={open} onClose={close} onChanged={(deleted) => { if (deleted) toast('Enquiry deleted.'); load(); }} />}
    </>
  );
}
