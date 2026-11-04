import { useEffect, useState } from 'react';
import { useAdmin } from './context.js';
import { Field, useToast } from './ui.jsx';
import { DEFAULT_CALCULATOR } from '../lib/calculatorDefaults.js';
import { clearCache } from '../lib/api.js';

const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const BLANK = {
  finishLevels: { name: '', rate: '', rangeAdd: 400 },
  areaTypes: { name: '', factor: 1 },
  propertyTypes: { name: '', multiplier: 1 },
};

// Editable table for one list (finish levels / area types / property types).
function ListEditor({ title, help, items, cols, onChange, blank, canEdit }) {
  const set = (i, k, val) => onChange(items.map((it, x) => (x === i ? { ...it, [k]: val } : it)));
  return (
    <fieldset className="a-fieldset">
      <legend>{title}</legend>
      {help && <p className="a-muted">{help}</p>}
      <div className="a-table-wrap">
        <table className="a-table">
          <thead><tr>{cols.map((c) => <th key={c.key}>{c.label}</th>)}<th /></tr></thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                {cols.map((c) => (
                  <td key={c.key}>
                    <input
                      aria-label={`${title} ${i + 1} ${c.label}`}
                      type={c.number ? 'number' : 'text'}
                      step={c.step}
                      min={c.number ? 0 : undefined}
                      disabled={!canEdit}
                      value={it[c.key] ?? ''}
                      onChange={(e) => set(i, c.key, e.target.value)}
                    />
                  </td>
                ))}
                <td>
                  {canEdit && (
                    <button type="button" className="a-btn sm danger" disabled={items.length <= 1} onClick={() => onChange(items.filter((_, x) => x !== i))}>
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {canEdit && items.length < 12 && (
        <div className="a-actions"><button type="button" className="a-btn sm" onClick={() => onChange([...items, { ...blank }])}>Add row</button></div>
      )}
    </fieldset>
  );
}

export default function CalculatorSettings() {
  const { api, admin } = useAdmin();
  const canEdit = admin.role === 'admin';
  const [toast, toastNode] = useToast();
  const [v, setV] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [previewArea, setPreviewArea] = useState('1000');

  useEffect(() => {
    api('/api/admin/calculator')
      .then((r) => setV({ ...DEFAULT_CALCULATOR, ...(r.config || {}) }))
      .catch((e) => setErr(e.message));
  }, [api]);

  if (!v) return err ? <p className="a-error" role="alert">{err}</p> : <p className="a-muted">Loading…</p>;
  const up = (patch) => setV({ ...v, ...patch });

  async function save(e) {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      const r = await api('/api/admin/calculator', { method: 'PUT', body: v });
      setV(r.config); clearCache(); toast('Calculator saved. The website now uses these values.');
    } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }

  const pa = Number(previewArea) || 0;
  const aType = v.areaTypes[0];

  return (
    <>
      <div className="a-head">
        <div>
          <h1>Cost calculator</h1>
          <p className="a-muted">{canEdit ? 'Control every rate and option used by the website cost calculator.' : 'Only administrators can change the calculator.'}</p>
        </div>
        {canEdit && <button type="button" className="a-btn" onClick={() => { if (window.confirm('Reset the form to the original default values? (Not saved until you click Save.)')) setV(DEFAULT_CALCULATOR); }}>Reset to defaults</button>}
      </div>
      {toastNode}
      <form className="a-card pad" onSubmit={save}>
        <h2>Area limits</h2>
        <div className="a-grid">
          <Field label="Minimum area (sq ft)"><input type="number" min="50" disabled={!canEdit} value={v.minArea} onChange={(e) => up({ minArea: e.target.value })} /></Field>
          <Field label="Maximum area (sq ft)"><input type="number" min="100" disabled={!canEdit} value={v.maxArea} onChange={(e) => up({ maxArea: e.target.value })} /></Field>
        </div>

        <ListEditor
          title="Finish levels" canEdit={canEdit} items={v.finishLevels} blank={BLANK.finishLevels}
          help="Rate = ₹ per sq ft (lower end of the range). Range add-on = extra ₹ per sq ft added to get the upper end."
          cols={[{ key: 'name', label: 'Name' }, { key: 'rate', label: 'Rate (₹/sq ft)', number: true }, { key: 'rangeAdd', label: 'Range add-on (₹/sq ft)', number: true }]}
          onChange={(finishLevels) => up({ finishLevels })}
        />
        <Field label="Pre-selected finish level">
          <select disabled={!canEdit} value={v.defaultFinish} onChange={(e) => up({ defaultFinish: e.target.value })}>
            {v.finishLevels.filter((f) => f.name).map((f) => <option key={f.name}>{f.name}</option>)}
          </select>
        </Field>

        <ListEditor
          title="Area types" canEdit={canEdit} items={v.areaTypes} blank={BLANK.areaTypes}
          help="Factor converts the area the customer enters into carpet-area equivalent. Carpet area = 1, built-up is usually about 0.85."
          cols={[{ key: 'name', label: 'Name' }, { key: 'factor', label: 'Factor', number: true, step: '0.01' }]}
          onChange={(areaTypes) => up({ areaTypes })}
        />

        <ListEditor
          title="Property types" canEdit={canEdit} items={v.propertyTypes} blank={BLANK.propertyTypes}
          help="Multiplier scales the final price for that property type. Leave at 1 for no change (e.g. 1.1 = 10% more)."
          cols={[{ key: 'name', label: 'Name' }, { key: 'multiplier', label: 'Multiplier', number: true, step: '0.01' }]}
          onChange={(propertyTypes) => up({ propertyTypes })}
        />

        <h2>Messages</h2>
        <div className="a-grid">
          <Field label="Note shown under the estimate" full><input disabled={!canEdit} maxLength={300} value={v.disclaimer} onChange={(e) => up({ disclaimer: e.target.value })} /></Field>
          <Field label="Message after the visitor sends their details" full><input disabled={!canEdit} maxLength={300} value={v.successMessage} onChange={(e) => up({ successMessage: e.target.value })} /></Field>
        </div>

        <h2>Quick preview</h2>
        <Field label="Area to test (sq ft, entered as carpet area)">
          <input type="number" value={previewArea} onChange={(e) => setPreviewArea(e.target.value)} />
        </Field>
        <div className="a-table-wrap">
          <table className="a-table">
            <thead><tr><th>Finish level</th><th>Estimated range for {pa || 0} sq ft</th></tr></thead>
            <tbody>
              {v.finishLevels.map((f, i) => {
                const lo = pa * (Number(aType?.factor) || 1) * (Number(f.rate) || 0);
                const hi = pa * (Number(aType?.factor) || 1) * ((Number(f.rate) || 0) + (Number(f.rangeAdd) || 0));
                return <tr key={i}><td>{f.name || '—'}</td><td>{inr(lo)} – {inr(hi)}</td></tr>;
              })}
            </tbody>
          </table>
        </div>

        {err && <p className="a-error" role="alert">{err}</p>}
        {canEdit && <div className="a-actions end"><button className="a-btn primary" disabled={busy}>{busy ? 'Saving…' : 'Save calculator'}</button></div>}
      </form>
    </>
  );
}
