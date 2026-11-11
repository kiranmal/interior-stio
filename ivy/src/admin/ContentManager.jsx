import { useCallback, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAdmin } from './context.js';
import { Confirm, Field, ImageField, Modal, Pager, Pill, useToast, when } from './ui.jsx';
import { TYPES, SEO_TYPES } from './schemas.js';

const PAGE = 10;
const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');

function blank(type) {
  const base = { type, title: '', slug: '', description: '', content: '', image: '', gallery: '', tags: '', category: '', location: '', author: '', order: 0, active: true, featured: false, publishedAt: type === 'blog' ? new Date().toISOString().slice(0, 10) : '', meta: {}, seo: { title: '', description: '', canonical: '', ogImage: '' } };
  return base;
}
function fromItem(item) {
  return { ...blank(item.type), ...item, gallery: (item.gallery || []).join('\n'), tags: (item.tags || []).join(', '), publishedAt: toDateInput(item.publishedAt), meta: { ...(item.meta || {}) }, seo: { title: '', description: '', canonical: '', ogImage: '', ...(item.seo || {}) } };
}

function Editor({ type, item, onClose, onSaved }) {
  const cfg = TYPES[type];
  const { api } = useAdmin();
  const [v, setV] = useState(() => (item ? fromItem(item) : blank(type)));
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k, val) => setV((s) => ({ ...s, [k]: val }));
  const setMeta = (k, val) => setV((s) => ({ ...s, meta: { ...s.meta, [k]: val } }));

  async function save(e) {
    e.preventDefault(); setError('');
    const errs = {};
    for (const [key, label, kind, opt] of cfg.fields) {
      if (!opt?.required) continue;
      if (!String(kind.startsWith('meta') ? v.meta[key] : v[key] ?? '').trim()) errs[key] = `${label} is required.`;
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const payload = { ...v, order: Number(v.order) || 0, publishedAt: v.publishedAt || undefined };
    if (!SEO_TYPES.includes(type)) delete payload.seo;
    else if (!Object.values(v.seo).some(Boolean)) payload.seo = { title: '', description: '', canonical: '', ogImage: '' };
    if (type === 'testimonial') payload.meta = { ...v.meta, rating: Math.min(5, Math.max(1, Number(v.meta.rating) || 5)) };
    delete payload._id; delete payload.createdAt; delete payload.updatedAt;
    setBusy(true);
    try {
      const r = item ? await api(`/api/content/admin/${item._id}`, { method: 'PATCH', body: payload }) : await api('/api/content/admin', { method: 'POST', body: payload });
      onSaved(r.item, !item);
    } catch (x) { setError(x.message); } finally { setBusy(false); }
  }

  const renderField = ([key, label, kind, opt = {}]) => {
    const err = errors[key];
    switch (kind) {
      case 'text': return <Field key={key} label={label} help={opt.help} error={err}><input value={v[key] || ''} onChange={(e) => set(key, e.target.value)} maxLength={key === 'title' ? 160 : 120} /></Field>;
      case 'textarea': return <Field key={key} label={label} full error={err}><textarea rows={3} value={v[key] || ''} onChange={(e) => set(key, e.target.value)} maxLength={2000} /></Field>;
      case 'long': return <Field key={key} label={label} full help={opt.help}><textarea rows={9} value={v[key] || ''} onChange={(e) => set(key, e.target.value)} maxLength={60000} /></Field>;
      case 'image': return <div key={key} className={`full${err ? ' bad' : ''}`}><ImageField label={label} value={v[key]} onChange={(x) => set(key, x)} />{err && <small className="err">{err}</small>}</div>;
      case 'gallery': return <Field key={key} label={label} full><textarea rows={4} value={v[key] || ''} onChange={(e) => set(key, e.target.value)} /></Field>;
      case 'tags': return <Field key={key} label={label} full><input value={v[key] || ''} onChange={(e) => set(key, e.target.value)} /></Field>;
      case 'number': return <Field key={key} label={label}><input type="number" value={v[key] ?? 0} onChange={(e) => set(key, e.target.value)} /></Field>;
      case 'date': return <Field key={key} label={label} help="Future dates keep the article hidden until then."><input type="date" value={v[key] || ''} onChange={(e) => set(key, e.target.value)} /></Field>;
      case 'check': return <label key={key} className="a-check"><input type="checkbox" checked={Boolean(v[key])} onChange={(e) => set(key, e.target.checked)} />{label}</label>;
      case 'meta-text': return <Field key={key} label={label} error={err}><input value={v.meta[key] ?? ''} onChange={(e) => setMeta(key, e.target.value)} maxLength={300} /></Field>;
      case 'meta-number': return <Field key={key} label={label} error={err}><input type="number" min={opt.min} max={opt.max} value={v.meta[key] ?? ''} onChange={(e) => setMeta(key, e.target.value === '' ? '' : Number(e.target.value))} /></Field>;
      default: return null;
    }
  };

  return (
    <Modal wide title={`${item ? 'Edit' : 'New'} ${cfg.label.toLowerCase()}`} onClose={onClose}>
      <form onSubmit={save} noValidate>
        <div className="a-grid">{cfg.fields.map(renderField)}</div>
        <label className="a-check"><input type="checkbox" checked={Boolean(v.active)} onChange={(e) => set('active', e.target.checked)} />Published (visible on the website)</label>
        {SEO_TYPES.includes(type) && (
          <fieldset className="a-fieldset"><legend>Search and sharing (optional)</legend><div className="a-grid">
            <Field label="SEO title" help={`${(v.seo.title || '').length}/70`}><input maxLength={70} value={v.seo.title} onChange={(e) => set('seo', { ...v.seo, title: e.target.value })} /></Field>
            <Field label="Canonical URL"><input value={v.seo.canonical} onChange={(e) => set('seo', { ...v.seo, canonical: e.target.value })} placeholder="https://…" /></Field>
            <Field label="Meta description" full help={`${(v.seo.description || '').length}/200`}><textarea rows={2} maxLength={200} value={v.seo.description} onChange={(e) => set('seo', { ...v.seo, description: e.target.value })} /></Field>
            <Field label="Social image URL" full><input value={v.seo.ogImage} onChange={(e) => set('seo', { ...v.seo, ogImage: e.target.value })} /></Field>
          </div></fieldset>
        )}
        {error && <p className="a-error" role="alert">{error}</p>}
        <div className="a-actions end"><button type="button" className="a-btn" onClick={onClose}>Cancel</button><button className="a-btn primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button></div>
      </form>
    </Modal>
  );
}

export default function ContentManager() {
  const { type } = useParams();
  const cfg = TYPES[type];
  const { api } = useAdmin();
  const [toast, toastNode] = useToast();
  const [state, setState] = useState({ items: [], loading: true, error: '', total: 0 });
  const [q, setQ] = useState(''); const [status, setStatus] = useState(''); const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null); // item | 'new'
  const [removing, setRemoving] = useState(null);

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      const r = await api(`/api/content/admin?type=${type}&limit=100&q=${encodeURIComponent(q)}${status ? `&status=${status}` : ''}`);
      setState({ items: r.items, total: r.total, loading: false, error: '' });
    } catch (e) { setState((s) => ({ ...s, loading: false, error: e.message })); }
  }, [api, type, q, status]);

  useEffect(() => { setPage(1); }, [type, q, status]);
  useEffect(() => { if (!cfg) return undefined; const t = setTimeout(load, q ? 250 : 0); return () => clearTimeout(t); }, [load, cfg, q]);
  if (!cfg) return <Navigate to="/admin" replace />;

  const pages = Math.max(1, Math.ceil(state.items.length / PAGE));
  const shown = state.items.slice((page - 1) * PAGE, page * PAGE);
  const canReorder = !q && !status && state.total <= 100;

  async function toggle(item) {
    try { await api(`/api/content/admin/${item._id}`, { method: 'PATCH', body: { active: !item.active } }); toast(`${item.title} ${item.active ? 'unpublished' : 'published'}.`); load(); } catch (e) { toast(e.message, 'err'); }
  }
  async function move(item, dir) {
    const ids = state.items.map((i) => i._id); const i = ids.indexOf(item._id); const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    try { await api('/api/content/admin/reorder', { method: 'POST', body: { ids } }); load(); } catch (e) { toast(e.message, 'err'); }
  }
  async function remove() {
    const item = removing; setRemoving(null);
    try { await api(`/api/content/admin/${item._id}`, { method: 'DELETE' }); toast(`Deleted "${item.title}".`); load(); } catch (e) { toast(e.message, 'err'); }
  }

  return (
    <>
      <div className="a-head"><div><h1>{cfg.plural}</h1><p className="a-muted">{cfg.hint}</p></div><button type="button" className="a-btn primary" onClick={() => setEditing('new')}>Add {cfg.label.toLowerCase()}</button></div>
      {toastNode}
      <div className="a-card">
        <div className="a-filters">
          <input type="search" placeholder={`Search ${cfg.plural.toLowerCase()}…`} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status"><option value="">All statuses</option><option value="published">Published</option><option value="draft">Drafts</option></select>
        </div>
        {state.error && <p className="a-error" role="alert">{state.error} <button type="button" className="a-btn sm" onClick={load}>Retry</button></p>}
        <div className="a-table-wrap"><table className="a-table">
          <thead><tr><th>Preview</th><th>{cfg.primary}</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead>
          <tbody>
            {state.loading && <tr><td colSpan={5} className="a-empty">Loading…</td></tr>}
            {!state.loading && !shown.length && <tr><td colSpan={5} className="a-empty">No {cfg.plural.toLowerCase()} found. {!q && 'Use “Add” to create the first one, or run npm run seed on the server for starter content.'}</td></tr>}
            {shown.map((it) => (
              <tr key={it._id}>
                <td>{it.image ? <img className="a-thumb" src={it.image} alt="" loading="lazy" /> : <span className="a-thumb none" />}</td>
                <td><strong>{it.title}</strong><small>{cfg.secondary(it)}</small></td>
                <td><Pill on={it.active} /></td><td>{when(it.updatedAt)}</td>
                <td><div className="a-row-actions">
                  <button type="button" className="a-btn sm" onClick={() => setEditing(it)}>Edit</button>
                  <button type="button" className="a-btn sm" onClick={() => toggle(it)}>{it.active ? 'Unpublish' : 'Publish'}</button>
                  {canReorder && <><button type="button" className="a-btn sm" onClick={() => move(it, -1)} aria-label={`Move ${it.title} up`}>Up</button><button type="button" className="a-btn sm" onClick={() => move(it, 1)} aria-label={`Move ${it.title} down`}>Down</button></>}
                  <button type="button" className="a-btn sm danger" onClick={() => setRemoving(it)}>Delete</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table></div>
        <Pager page={page} pages={pages} total={state.items.length} onPage={setPage} />
      </div>
      {editing && <Editor type={type} item={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSaved={(it, created) => { setEditing(null); toast(`${created ? 'Created' : 'Saved'} "${it.title}".`); load(); }} />}
      {removing && <Confirm text={`Delete “${removing.title}” permanently? This cannot be undone.`} onConfirm={remove} onCancel={() => setRemoving(null)} />}
    </>
  );
}
