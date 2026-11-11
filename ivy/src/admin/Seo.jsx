import { useCallback, useEffect, useState } from 'react';
import { useAdmin } from './context.js';
import { Confirm, Field, useToast } from './ui.jsx';

const SUGGEST = ['/', '/about', '/services', '/projects', '/gallery', '/team', '/testimonials', '/blog', '/contact', '/get-a-quote', '/faqs', '/privacy-policy', '/terms-and-conditions'];
const empty = { path: '/', title: '', description: '', canonical: '', ogImage: '', noindex: false };

export default function SeoManager() {
  const { api } = useAdmin();
  const [toast, toastNode] = useToast();
  const [rows, setRows] = useState([]); const [v, setV] = useState(empty); const [err, setErr] = useState(''); const [del, setDel] = useState(null);
  const load = useCallback(() => api('/api/admin/seo').then((r) => setRows(r.entries)).catch((e) => setErr(e.message)), [api]);
  useEffect(() => { load(); }, [load]);
  async function save(e) {
    e.preventDefault(); setErr('');
    try { await api('/api/admin/seo', { method: 'PUT', body: v }); toast(`SEO saved for ${v.path}.`); setV(empty); load(); } catch (x) { setErr(x.message); }
  }
  async function remove() { const id = del._id; setDel(null); try { await api(`/api/admin/seo/${id}`, { method: 'DELETE' }); toast('SEO entry removed.'); load(); } catch (x) { toast(x.message, 'err'); } }
  return (
    <>
      <div className="a-head"><div><h1>SEO</h1><p className="a-muted">Override title, description and social image for any public path. Empty fields fall back to sensible defaults from Settings. Services, projects and articles have their own SEO fields in their editors.</p></div></div>
      {toastNode}
      <form className="a-card pad" onSubmit={save}>
        <div className="a-grid">
          <Field label="Page path"><input list="seo-paths" value={v.path} onChange={(e) => setV({ ...v, path: e.target.value })} /><datalist id="seo-paths">{SUGGEST.map((s) => <option key={s} value={s} />)}</datalist></Field>
          <Field label="Title" help={`${v.title.length}/70`}><input maxLength={70} value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} /></Field>
          <Field label="Meta description" full help={`${v.description.length}/200`}><textarea rows={2} maxLength={200} value={v.description} onChange={(e) => setV({ ...v, description: e.target.value })} /></Field>
          <Field label="Canonical URL"><input value={v.canonical} onChange={(e) => setV({ ...v, canonical: e.target.value })} placeholder="https://…" /></Field>
          <Field label="Social image URL"><input value={v.ogImage} onChange={(e) => setV({ ...v, ogImage: e.target.value })} placeholder="https://…" /></Field>
        </div>
        <label className="a-check"><input type="checkbox" checked={v.noindex} onChange={(e) => setV({ ...v, noindex: e.target.checked })} />Ask search engines not to index this page</label>
        {err && <p className="a-error" role="alert">{err}</p>}
        <div className="a-actions end"><button className="a-btn primary">Save SEO entry</button></div>
      </form>
      <div className="a-card"><div className="a-table-wrap"><table className="a-table"><thead><tr><th>Path</th><th>Title</th><th>Description</th><th>Index</th><th /></tr></thead><tbody>
        {!rows.length && <tr><td colSpan={5} className="a-empty">No overrides yet.</td></tr>}
        {rows.map((r) => <tr key={r._id}><td><strong>{r.path}</strong></td><td>{r.title}</td><td>{r.description}</td><td>{r.noindex ? 'noindex' : 'index'}</td>
          <td><div className="a-row-actions"><button type="button" className="a-btn sm" onClick={() => setV({ ...empty, ...r })}>Edit</button><button type="button" className="a-btn sm danger" onClick={() => setDel(r)}>Delete</button></div></td></tr>)}
      </tbody></table></div></div>
      {del && <Confirm text={`Remove the SEO override for ${del.path}?`} onConfirm={remove} onCancel={() => setDel(null)} />}
    </>
  );
}
