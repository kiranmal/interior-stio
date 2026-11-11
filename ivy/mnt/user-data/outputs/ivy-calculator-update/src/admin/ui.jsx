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

// Shrink big photos in the browser before upload (max 2000px wide, WebP/JPEG), so phone photos
// stay well under the server's body-size limits and load fast on the website.
async function shrinkImage(file) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size < 600 * 1024) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 2000 / bmp.width);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale); canvas.height = Math.round(bmp.height * scale);
    canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/webp', 0.85));
    return blob && blob.size < file.size ? new File([blob], file.name.replace(/\.\w+$/, '') + '.webp', { type: 'image/webp' }) : file;
  } catch { return file; }
}

async function uploadFile(api, file) {
  const form = new FormData(); form.append('file', await shrinkImage(file));
  const r = await api('/api/admin/upload', { method: 'POST', form });
  return r.url;
}

/** Multi-photo uploader: pick several files at once, see thumbnails, remove any. Value is one URL per line (same format as before). */
export function GalleryField({ label = 'Gallery', value, onChange, help }) {
  const { api } = useAdmin();
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const urls = String(value || '').split('\n').map((u) => u.trim()).filter(Boolean);
  const commit = (list) => onChange(list.join('\n'));
  async function pick(e) {
    const files = [...(e.target.files || [])]; e.target.value = '';
    if (!files.length) return;
    setErr(''); const added = [];
    for (let i = 0; i < files.length; i += 1) {
      setBusy(`Uploading ${i + 1} of ${files.length}…`);
      try { added.push(await uploadFile(api, files[i])); } catch (x) { setErr(`${files[i].name}: ${x.message}`); }
    }
    setBusy(''); if (added.length) commit([...urls, ...added]);
  }
  const move = (i, d) => { const l = [...urls]; const j = i + d; if (j < 0 || j >= l.length) return; [l[i], l[j]] = [l[j], l[i]]; commit(l); };
  return (
    <div className="a-field full">
      <span>{label}</span>
      <div className="a-gal">
        {urls.map((u, i) => (
          <figure key={u + i}>
            <img src={u} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.opacity = 0.2; }} />
            <figcaption>
              <button type="button" className="a-btn sm" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move photo ${i + 1} earlier`}>◀</button>
              <button type="button" className="a-btn sm" disabled={i === urls.length - 1} onClick={() => move(i, 1)} aria-label={`Move photo ${i + 1} later`}>▶</button>
              <button type="button" className="a-btn sm danger" onClick={() => commit(urls.filter((_, x) => x !== i))} aria-label={`Remove photo ${i + 1}`}>Remove</button>
            </figcaption>
          </figure>
        ))}
        <label className="a-gal-add">{busy || '+ Add photos'}<input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" onChange={pick} hidden disabled={Boolean(busy)} /></label>
      </div>
      {err && <small className="err">{err}</small>}
      {help && <small>{help}</small>}
    </div>
  );
}

export function ImageField({ label = 'Image', value, onChange, help }) {
  const { api } = useAdmin();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function pick(e) {
    const file = e.target.files?.[0]; e.target.value = '';
    if (!file) return;
    setBusy(true); setErr('');
    try { onChange(await uploadFile(api, file)); }
    catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  return (
    <div className="a-field full">
      <span>{label}</span>
      <div className="a-img">
        {value ? <img src={value} alt="" onError={(e) => { e.currentTarget.style.opacity = 0.2; }} /> : <div className="a-img-empty">No image</div>}
        <div className="a-img-ctl">
          <label className="a-btn sm primary">{busy ? 'Uploading…' : value ? 'Change photo' : 'Upload photo from your computer'}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={pick} hidden disabled={busy} /></label>
          <details className="a-url"><summary>Or paste an image link</summary><input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="https://… image URL" aria-label={`${label} URL`} /></details>
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
