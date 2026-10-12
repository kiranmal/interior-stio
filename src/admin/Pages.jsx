import { useCallback, useEffect, useState } from 'react';
import { useAdmin } from './context.js';
import { Confirm, Field, ImageField, Pill, useToast, when } from './ui.jsx';
import { homePage } from '../data/seedData.js';

const SECTION_TYPES = { hero: 'Hero (uses Banners for slides)', intro: 'Image and text', text: 'Text block', banner: 'Full-width banner', cta: 'Call to action', services: 'Services list', projects: 'Projects', gallery: 'Gallery preview', testimonials: 'Testimonials', blog: 'Blog posts', faq: 'FAQs', process: 'Process steps', team: 'Team' };
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));

function Editor({ initial, isNew, onClose, onSaved }) {
  const { api, admin } = useAdmin();
  const [p, setP] = useState(() => ({ key: '', title: '', status: 'draft', sections: [], seo: { title: '', description: '', canonical: '', ogImage: '' }, ...initial, seo: { title: '', description: '', canonical: '', ogImage: '', ...(initial.seo || {}) } }));
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const [del, setDel] = useState(false);
  const setSec = (i, patch) => setP((s) => ({ ...s, sections: s.sections.map((x, j) => (j === i ? { ...x, ...patch } : x)) }));
  const move = (i, d) => setP((s) => { const a = [...s.sections]; const j = i + d; if (j < 0 || j >= a.length) return s; [a[i], a[j]] = [a[j], a[i]]; return { ...s, sections: a }; });

  async function save(status) {
    setError('');
    if (!p.title.trim()) { setError('Page title is required.'); return; }
    if (!/^[a-z0-9-]+$/.test(p.key)) { setError('Page key may only contain lowercase letters, numbers and hyphens.'); return; }
    setBusy(true);
    try { const r = await api(`/api/admin/pages/${p.key}`, { method: 'PUT', body: { ...p, status: status || p.status } }); onSaved(r.page); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function remove() { try { await api(`/api/admin/pages/${p.key}`, { method: 'DELETE' }); onSaved(null, true); } catch (e) { setError(e.message); setDel(false); } }

  return (
    <div className="a-card pad">
      <div className="a-head"><h2>{isNew ? 'New page' : `Edit “${p.title}”`}</h2><button type="button" className="a-btn" onClick={onClose}>Back to pages</button></div>
      <div className="a-grid">
        <Field label="Page title"><input value={p.title} onChange={(e) => setP({ ...p, title: e.target.value })} maxLength={160} /></Field>
        <Field label="Page key / URL" help={p.key === 'home' ? 'The homepage (/)' : `Public URL: /p/${p.key || 'your-key'}`}><input value={p.key} disabled={!isNew} onChange={(e) => setP({ ...p, key: e.target.value.toLowerCase() })} placeholder="e.g. offers" /></Field>
      </div>
      <h3>Sections (top to bottom)</h3>
      {!p.sections.length && <p className="a-muted">No sections yet. Add one below.</p>}
      {p.sections.map((s, i) => (
        <fieldset className="a-section" key={s.id}>
          <legend>{i + 1}. {SECTION_TYPES[s.type]}</legend>
          <div className="a-row-actions">
            <label className="a-check"><input type="checkbox" checked={s.visible !== false} onChange={(e) => setSec(i, { visible: e.target.checked })} />Visible</label>
            <button type="button" className="a-btn sm" onClick={() => move(i, -1)} disabled={i === 0}>Up</button><button type="button" className="a-btn sm" onClick={() => move(i, 1)} disabled={i === p.sections.length - 1}>Down</button>
            <button type="button" className="a-btn sm danger" onClick={() => setP({ ...p, sections: p.sections.filter((_, j) => j !== i) })}>Remove</button>
          </div>
          <div className="a-grid">
            <Field label="Heading"><input value={s.heading || ''} onChange={(e) => setSec(i, { heading: e.target.value })} maxLength={200} /></Field>
            <Field label="Subheading"><input value={s.subheading || ''} onChange={(e) => setSec(i, { subheading: e.target.value })} maxLength={300} /></Field>
            {['intro', 'text', 'banner', 'cta'].includes(s.type) && <Field label="Body text" full><textarea rows={4} value={s.body || ''} onChange={(e) => setSec(i, { body: e.target.value })} /></Field>}
            {['intro', 'banner'].includes(s.type) && <ImageField label="Image" value={s.image} onChange={(v) => setSec(i, { image: v })} />}
            {['hero', 'intro', 'text', 'banner', 'cta'].includes(s.type) && <><Field label="Button label"><input value={s.ctaLabel || ''} onChange={(e) => setSec(i, { ctaLabel: e.target.value })} maxLength={60} /></Field><Field label="Button link"><input value={s.ctaUrl || ''} onChange={(e) => setSec(i, { ctaUrl: e.target.value })} placeholder="/contact or https://…" /></Field></>}
          </div>
        </fieldset>
      ))}
      <div className="a-inline"><select id="addsec" defaultValue="" aria-label="Section type" onChange={(e) => { if (e.target.value) { setP({ ...p, sections: [...p.sections, { id: uid(), type: e.target.value, heading: '', visible: true }] }); e.target.value = ''; } }}>
        <option value="">Add a section…</option>{Object.entries(SECTION_TYPES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></div>
      <fieldset className="a-fieldset"><legend>SEO</legend><div className="a-grid">
        <Field label="SEO title" help={`${p.seo.title.length}/70`}><input maxLength={70} value={p.seo.title} onChange={(e) => setP({ ...p, seo: { ...p.seo, title: e.target.value } })} /></Field>
        <Field label="Canonical URL"><input value={p.seo.canonical} onChange={(e) => setP({ ...p, seo: { ...p.seo, canonical: e.target.value } })} /></Field>
        <Field label="Meta description" full help={`${p.seo.description.length}/200`}><textarea rows={2} maxLength={200} value={p.seo.description} onChange={(e) => setP({ ...p, seo: { ...p.seo, description: e.target.value } })} /></Field>
      </div></fieldset>
      {error && <p className="a-error" role="alert">{error}</p>}
      <div className="a-actions end">
        {!isNew && admin.role === 'admin' && p.key !== 'home' && <button type="button" className="a-btn danger" onClick={() => setDel(true)}>Delete page</button>}
        <button type="button" className="a-btn" disabled={busy} onClick={() => save('draft')}>Save as draft</button>
        <button type="button" className="a-btn primary" disabled={busy} onClick={() => save('published')}>{busy ? 'Saving…' : 'Save and publish'}</button>
      </div>
      {del && <Confirm text={`Delete page “${p.title}”?`} onConfirm={remove} onCancel={() => setDel(false)} />}
    </div>
  );
}

export default function PagesManager() {
  const { api } = useAdmin();
  const [toast, toastNode] = useToast();
  const [state, setState] = useState({ pages: [], loading: true, error: '' });
  const [editing, setEditing] = useState(null);
  const load = useCallback(async () => { try { const r = await api('/api/admin/pages'); setState({ pages: r.pages, loading: false, error: '' }); } catch (e) { setState({ pages: [], loading: false, error: e.message }); } }, [api]);
  useEffect(() => { load(); }, [load]);
  const hasHome = state.pages.some((p) => p.key === 'home');
  if (editing) return <>{toastNode}<Editor initial={editing.page} isNew={editing.isNew} onClose={() => setEditing(null)} onSaved={(pg, deleted) => { setEditing(null); toast(deleted ? 'Page deleted.' : `Saved “${pg.title}” (${pg.status}).`); load(); }} /></>;
  return (
    <>
      <div className="a-head"><div><h1>Pages and sections</h1><p className="a-muted">Control what the homepage and extra pages show, their order and their buttons.</p></div>
        <button type="button" className="a-btn primary" onClick={() => setEditing({ isNew: true, page: { sections: [] } })}>New page</button></div>
      {toastNode}
      {!hasHome && !state.loading && <div className="a-card pad"><p>The homepage has no saved layout yet, so the site shows its built-in default. Create it to start editing sections.</p><button type="button" className="a-btn primary" onClick={() => setEditing({ isNew: true, page: { ...homePage, status: 'draft' } })}>Create homepage from defaults</button></div>}
      <div className="a-card"><div className="a-table-wrap"><table className="a-table"><thead><tr><th>Title</th><th>URL</th><th>Status</th><th>Sections</th><th>Updated</th><th /></tr></thead><tbody>
        {state.loading && <tr><td colSpan={6} className="a-empty">Loading…</td></tr>}
        {state.error && <tr><td colSpan={6} className="a-empty a-error">{state.error}</td></tr>}
        {state.pages.map((p) => <tr key={p.key}><td><strong>{p.title}</strong></td><td>{p.key === 'home' ? '/' : `/p/${p.key}`}</td><td><Pill on={p.status === 'published'} /></td><td>{p.sections.length}</td><td>{when(p.updatedAt)}</td><td><button type="button" className="a-btn sm" onClick={() => setEditing({ isNew: false, page: p })}>Edit</button></td></tr>)}
      </tbody></table></div></div>
    </>
  );
}
