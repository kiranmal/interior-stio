import { useCallback, useEffect, useState } from 'react';
import { useAdmin } from './context.js';
import { Confirm, Field, ImageField, Modal, Pill, useToast, when } from './ui.jsx';

export function SettingsPage() {
  const { api, admin } = useAdmin();
  const canEdit = admin.role === 'admin';
  const [toast, toastNode] = useToast();
  const [v, setV] = useState(null); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { api('/api/admin/settings').then((r) => setV(r.settings)).catch((e) => setErr(e.message)); }, [api]);
  if (!v) return err ? <p className="a-error" role="alert">{err}</p> : <p className="a-muted">Loading…</p>;
  const t = (k, label, extra = {}) => <Field label={label} key={k} full={extra.full}><input disabled={!canEdit} value={v[k] || ''} onChange={(e) => setV({ ...v, [k]: e.target.value })} {...extra.input} /></Field>;
  async function save(e) {
    e.preventDefault(); setErr(''); setBusy(true);
    try { const r = await api('/api/admin/settings', { method: 'PUT', body: v }); setV(r.settings); toast('Settings saved.'); } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  return (
    <>
      <div className="a-head"><div><h1>Settings</h1><p className="a-muted">{canEdit ? 'Global details used across the website.' : 'Only administrators can change settings.'}</p></div></div>
      {toastNode}
      <form className="a-card pad" onSubmit={save}>
        <h2>Brand</h2><div className="a-grid">{t('siteName', 'Site name')}{t('tagline', 'Tagline')}
          <div className="full"><ImageField label="Logo" value={v.logo} onChange={(x) => canEdit && setV({ ...v, logo: x })} /></div>
          <div className="full"><ImageField label="Favicon" value={v.favicon} onChange={(x) => canEdit && setV({ ...v, favicon: x })} /></div></div>
        <h2>Contact</h2><div className="a-grid">{t('phone', 'Phone')}{t('whatsapp', 'WhatsApp number')}{t('email', 'Email', { input: { type: 'email' } })}{t('workingHours', 'Working hours')}{t('addressLine1', 'Address line 1')}{t('addressLine2', 'Address line 2')}{t('addressLine3', 'Address line 3')}{t('mapUrl', 'Google Maps link')}</div>
        <h2>Social links</h2><div className="a-grid">{['instagram', 'facebook', 'linkedin', 'youtube', 'pinterest'].map((k) => t(k, k[0].toUpperCase() + k.slice(1), { input: { placeholder: 'https://…' } }))}</div>
        <h2>Footer and default SEO</h2><div className="a-grid">{t('footerText', 'Footer text', { full: true })}{t('defaultTitle', 'Default page title', { input: { maxLength: 70 } })}{t('defaultDescription', 'Default meta description', { input: { maxLength: 200 } })}
          <div className="full"><ImageField label="Default social image" value={v.defaultOgImage} onChange={(x) => canEdit && setV({ ...v, defaultOgImage: x })} /></div></div>
        {err && <p className="a-error" role="alert">{err}</p>}
        {canEdit && <div className="a-actions end"><button className="a-btn primary" disabled={busy}>{busy ? 'Saving…' : 'Save settings'}</button></div>}
      </form>
    </>
  );
}

export function UsersPage() {
  const { api, admin } = useAdmin();
  const [toast, toastNode] = useToast();
  const [users, setUsers] = useState([]); const [err, setErr] = useState(''); const [create, setCreate] = useState(false); const [del, setDel] = useState(null); const [pw, setPw] = useState(null);
  const load = useCallback(() => api('/api/admin/users').then((r) => setUsers(r.users)).catch((e) => setErr(e.message)), [api]);
  useEffect(() => { load(); }, [load]);
  const patch = (u, body, msg) => api(`/api/admin/users/${u.id}`, { method: 'PATCH', body }).then(() => { toast(msg); load(); }).catch((e) => toast(e.message, 'err'));
  return (
    <>
      <div className="a-head"><div><h1>Admin users</h1><p className="a-muted">Administrators can manage everything. Editors can manage content and enquiries but not settings, users or deletions of leads.</p></div><button type="button" className="a-btn primary" onClick={() => setCreate(true)}>Add user</button></div>
      {toastNode}{err && <p className="a-error" role="alert">{err}</p>}
      <div className="a-card"><div className="a-table-wrap"><table className="a-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last login</th><th /></tr></thead><tbody>
        {users.map((u) => <tr key={u.id}><td><strong>{u.name}</strong></td><td>{u.email}</td>
          <td><select value={u.role} disabled={u.id === admin.id} onChange={(e) => patch(u, { role: e.target.value }, 'Role updated.')} aria-label={`Role for ${u.email}`}><option>admin</option><option>editor</option></select></td>
          <td><Pill on={u.active} yes="Active" no="Disabled" /></td><td>{when(u.lastLoginAt)}</td>
          <td><div className="a-row-actions">
            <button type="button" className="a-btn sm" disabled={u.id === admin.id} onClick={() => patch(u, { active: !u.active }, u.active ? 'User disabled.' : 'User enabled.')}>{u.active ? 'Disable' : 'Enable'}</button>
            <button type="button" className="a-btn sm" onClick={() => setPw(u)}>Set password</button>
            <button type="button" className="a-btn sm danger" disabled={u.id === admin.id} onClick={() => setDel(u)}>Delete</button></div></td></tr>)}
      </tbody></table></div></div>
      {create && <UserForm title="Add user" onClose={() => setCreate(false)} onSubmit={async (b) => { await api('/api/admin/users', { method: 'POST', body: b }); toast('User created.'); setCreate(false); load(); }} withIdentity />}
      {pw && <UserForm title={`New password for ${pw.email}`} onClose={() => setPw(null)} onSubmit={async (b) => { await api(`/api/admin/users/${pw.id}`, { method: 'PATCH', body: { password: b.password } }); toast('Password updated.'); setPw(null); }} />}
      {del && <Confirm text={`Delete ${del.email}?`} onCancel={() => setDel(null)} onConfirm={async () => { const u = del; setDel(null); try { await api(`/api/admin/users/${u.id}`, { method: 'DELETE' }); toast('User deleted.'); load(); } catch (e) { toast(e.message, 'err'); } }} />}
    </>
  );
}

function UserForm({ title, onClose, onSubmit, withIdentity }) {
  const [v, setV] = useState({ name: '', email: '', role: 'editor', password: '' }); const [err, setErr] = useState('');
  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={async (e) => { e.preventDefault(); setErr(''); try { await onSubmit(v); } catch (x) { setErr(x.message); } }}>
        <div className="a-grid">
          {withIdentity && <><Field label="Name"><input value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} /></Field><Field label="Email"><input type="email" required value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} /></Field>
            <Field label="Role"><select value={v.role} onChange={(e) => setV({ ...v, role: e.target.value })}><option>editor</option><option>admin</option></select></Field></>}
          <Field label="Password" help="At least 10 characters, with letters and a number."><input type="password" autoComplete="new-password" required value={v.password} onChange={(e) => setV({ ...v, password: e.target.value })} /></Field>
        </div>
        {err && <p className="a-error" role="alert">{err}</p>}
        <div className="a-actions end"><button type="button" className="a-btn" onClick={onClose}>Cancel</button><button className="a-btn primary">Save</button></div>
      </form>
    </Modal>
  );
}

export function AccountPage() {
  const { api, admin } = useAdmin();
  const [v, setV] = useState({ currentPassword: '', newPassword: '', confirm: '' }); const [msg, setMsg] = useState({ kind: '', text: '' });
  async function submit(e) {
    e.preventDefault();
    if (v.newPassword !== v.confirm) { setMsg({ kind: 'err', text: 'The new passwords do not match.' }); return; }
    try { await api('/api/admin/change-password', { method: 'POST', body: { currentPassword: v.currentPassword, newPassword: v.newPassword } }); setMsg({ kind: 'ok', text: 'Password changed.' }); setV({ currentPassword: '', newPassword: '', confirm: '' }); }
    catch (x) { setMsg({ kind: 'err', text: x.message }); }
  }
  return (
    <>
      <div className="a-head"><div><h1>My account</h1><p className="a-muted">{admin.email} ({admin.role})</p></div></div>
      <form className="a-card pad narrow" onSubmit={submit}>
        <h2>Change password</h2>
        <Field label="Current password"><input type="password" autoComplete="current-password" required value={v.currentPassword} onChange={(e) => setV({ ...v, currentPassword: e.target.value })} /></Field>
        <Field label="New password" help="At least 10 characters, with letters and a number."><input type="password" autoComplete="new-password" required value={v.newPassword} onChange={(e) => setV({ ...v, newPassword: e.target.value })} /></Field>
        <Field label="Confirm new password"><input type="password" autoComplete="new-password" required value={v.confirm} onChange={(e) => setV({ ...v, confirm: e.target.value })} /></Field>
        {msg.text && <p className={msg.kind === 'ok' ? 'a-ok' : 'a-error'} role="status">{msg.text}</p>}
        <div className="a-actions end"><button className="a-btn primary">Update password</button></div>
      </form>
    </>
  );
}
