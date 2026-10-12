import { useEffect, useRef, useState } from 'react';
import { useAdmin } from './context.js';

export function useToast() {
  const [toast, setToast] = useState(null);
  useEffect(() => { if (!toast) return undefined; const t = setTimeout(() => setToast(null), 4500); return () => clearTimeout(t); }, [toast]);
  const node = toast ? <div className={`a-toast ${toast.kind}`} role="status" aria-live="polite">{toast.text}<button type="button" onClick={() => setToast(null)} aria-label="Dismiss">×</button></div> : null;
  return [(text, kind = 'ok') => setToast({ text, kind }), node];
}

export function Modal({ title, onClose, children, wide }) {
  const ref = useRef(null);
  useEffect(() => {
    const prev = document.activeElement; ref.current?.focus();
    const k = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', k);
    return () => { document.removeEventListener('keydown', k); prev?.focus?.(); };
  }, [onClose]);
  return (
    <div className="a-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`a-modal${wide ? ' wide' : ''}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <header><h2>{title}</h2><button type="button" onClick={onClose} aria-label="Close">×</button></header>
        <div className="a-modal-body">{children}</div>
      </div>
    </div>
  );
}

export function Confirm({ title = 'Are you sure?', text, confirmLabel = 'Delete', onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p>{text}</p>
      <div className="a-actions end"><button type="button" className="a-btn" onClick={onCancel}>Cancel</button><button type="button" className="a-btn danger" onClick={onConfirm}>{confirmLabel}</button></div>
    </Modal>
  );
}

export function Pager({ page, pages, total, onPage }) {
  if (pages <= 1) return <p className="a-muted a-pager">{total} record{total === 1 ? '' : 's'}</p>;
  return (
    <div className="a-pager"><span className="a-muted">{total} records</span>
      <button type="button" className="a-btn sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</button>
      <span>Page {page} of {pages}</span>
      <button type="button" className="a-btn sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</button></div>
  );
}

export function Field({ label, help, error, children, full }) {
  return <label className={`a-field${full ? ' full' : ''}${error ? ' bad' : ''}`}><span>{label}</span>{children}{help && <small>{help}</small>}{error && <small className="err">{error}</small>}</label>;
}

export function ImageField({ label = 'Image', value, onChange, help }) {
  const { api, uploads } = useAdmin();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function pick(e) {
    const file = e.target.files?.[0]; e.target.value = '';
    if (!file) return;
    setBusy(true); setErr('');
    try { const form = new FormData(); form.append('file', file); const r = await api('/api/admin/upload', { method: 'POST', form }); onChange(r.url); }
    catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  return (
    <div className="a-field full">
      <span>{label}</span>
      <div className="a-img">
        {value ? <img src={value} alt="" onError={(e) => { e.currentTarget.style.opacity = 0.2; }} /> : <div className="a-img-empty">No image</div>}
        <div className="a-img-ctl">
          <input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="https://… image URL" aria-label={`${label} URL`} />
          {uploads ? <label className="a-btn sm">{busy ? 'Uploading…' : 'Upload image'}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={pick} hidden disabled={busy} /></label>
            : <small>Uploads are not configured on the server. Paste an image URL, or set the CLOUDINARY_* variables to enable uploads.</small>}
          {value && <button type="button" className="a-btn sm" onClick={() => onChange('')}>Remove</button>}
          {err && <small className="err">{err}</small>}
        </div>
      </div>
      {help && <small>{help}</small>}
    </div>
  );
}

export const when = (d) => (d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '–');
export const Pill = ({ on, yes = 'Published', no = 'Draft' }) => <span className={`a-pill ${on ? 'on' : ''}`}>{on ? yes : no}</span>;
