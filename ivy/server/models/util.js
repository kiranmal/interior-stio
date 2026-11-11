export const parseJson = (v, fallback) => {
  if (v === null || v === undefined) return fallback;
  if (typeof v === 'string') { try { return JSON.parse(v); } catch { return fallback; } }
  return v; // mysql2 already parses JSON columns on MySQL
};
export const toJson = (v) => (v === undefined || v === null ? null : JSON.stringify(v));
export const nn = (v) => (v === null || v === undefined ? undefined : v);
export const bit = (v) => (v ? 1 : 0);
/** Escape LIKE wildcards in user input (used together with ESCAPE '\\'). */
export const likeTerm = (s) => `%${String(s).replace(/[\\%_]/g, '\\$&')}%`;
