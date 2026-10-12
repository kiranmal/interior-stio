import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './admin.css';
import { AdminContext, useAdmin } from './context.js';
import { request } from '../lib/api.js';
import Dashboard from './Dashboard.jsx';
import ContentManager from './ContentManager.jsx';
import Enquiries from './Enquiries.jsx';
import PagesManager from './Pages.jsx';
import SeoManager from './Seo.jsx';
import { SettingsPage, UsersPage, AccountPage } from './Manage.jsx';
import { TYPES } from './schemas.js';

const KEY = 'ivy-admin-token';

function Login({ onLogin }) {
  const [v, setV] = useState({ email: '', password: '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setErr(''); setBusy(true);
    try { const r = await request('/api/admin/login', { method: 'POST', body: v }); onLogin(r.token, r.admin); }
    catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  return (
    <div className="a-login"><form onSubmit={submit} aria-labelledby="al-h">
      <img src="/images/ivy-interio-logo.jpg" alt="" width="56" height="56" /><h1 id="al-h">Ivy Interio admin</h1>
      <p className="a-muted">Sign in to manage the website.</p>
      <label className="a-field"><span>Email</span><input type="email" autoComplete="username" required value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} /></label>
      <label className="a-field"><span>Password</span><input type="password" autoComplete="current-password" required value={v.password} onChange={(e) => setV({ ...v, password: e.target.value })} /></label>
      {err && <p className="a-error" role="alert">{err}</p>}
      <button className="a-btn primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      <Link to="/" className="a-muted">Back to website</Link>
    </form></div>
  );
}

function Shell() {
  const { admin, logout } = useAdmin();
  const [open, setOpen] = useState(false);
  const link = (to, label, end) => <NavLink to={to} end={end} onClick={() => setOpen(false)}>{label}</NavLink>;
  return (
    <div className="a-shell">
      <aside className={`a-side${open ? ' open' : ''}`} aria-label="Admin navigation">
        <Link to="/admin" className="a-brand"><img src="/images/ivy-interio-logo.jpg" alt="" width="36" height="36" /><b>Ivy Interio</b></Link>
        <nav>
          {link('/admin', 'Dashboard', true)}
          <h3>Website</h3>
          {link('/admin/pages', 'Pages and sections')}
          {['banner', 'service', 'project', 'gallery', 'testimonial', 'blog', 'team', 'faq'].map((t) => link(`/admin/content/${t}`, TYPES[t].plural))}
          <h3>Leads</h3>
          {link('/admin/enquiries', 'Enquiries')}
          <h3>Site</h3>
          {link('/admin/seo', 'SEO')}
          {link('/admin/settings', 'Settings')}
          {admin.role === 'admin' && link('/admin/users', 'Admin users')}
          {link('/admin/account', 'My account')}
        </nav>
      </aside>
      <div className="a-main">
        <header className="a-top">
          <button type="button" className="a-burger a-btn sm" aria-expanded={open} onClick={() => setOpen((o) => !o)}>Menu</button>
          <span className="a-muted">{admin.email} ({admin.role})</span>
          <span className="a-top-r"><a className="a-btn sm" href="/" target="_blank" rel="noopener noreferrer">View website</a><button type="button" className="a-btn sm" onClick={logout}>Sign out</button></span>
        </header>
        <main className="a-content">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="content/:type" element={<ContentManager />} />
            <Route path="enquiries" element={<Enquiries />} />
            <Route path="pages" element={<PagesManager />} />
            <Route path="seo" element={<SeoManager />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="users" element={admin.role === 'admin' ? <UsersPage /> : <Navigate to="/admin" replace />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [token, setToken] = useState(() => sessionStorage.getItem(KEY) || '');
  const [admin, setAdmin] = useState(null);
  const [uploads, setUploads] = useState(false);
  const [ready, setReady] = useState(!token);
  const navigate = useNavigate();

  useEffect(() => { document.title = 'Admin | Ivy Interio'; const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex, nofollow'; document.head.appendChild(m); return () => m.remove(); }, []);

  const logout = useCallback(() => { sessionStorage.removeItem(KEY); setToken(''); setAdmin(null); navigate('/admin'); }, [navigate]);
  const api = useCallback(async (path, opts = {}) => {
    try { return await request(path, { ...opts, token }); }
    catch (e) { if (e.status === 401 && path !== '/api/admin/login') logout(); throw e; }
  }, [token, logout]);

  useEffect(() => {
    if (!token) return;
    let alive = true;
    request('/api/admin/me', { token }).then((r) => alive && (setAdmin(r.admin), setReady(true))).catch(() => { if (alive) { sessionStorage.removeItem(KEY); setToken(''); setReady(true); } });
    request('/api/admin/upload/status', { token }).then((r) => alive && setUploads(Boolean(r.enabled))).catch(() => {});
    return () => { alive = false; };
  }, [token]);

  const ctx = useMemo(() => ({ token, admin, api, logout, uploads }), [token, admin, api, logout, uploads]);
  if (!ready) return <div className="state">Checking session…</div>;
  if (!token || !admin) return <Login onLogin={(t, a) => { sessionStorage.setItem(KEY, t); setToken(t); setAdmin(a); setReady(true); }} />;
  return <AdminContext.Provider value={ctx}><Shell /></AdminContext.Provider>;
}
