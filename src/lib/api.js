const API = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
if (import.meta.env.PROD && !API) console.warn('VITE_API_URL is not set: API calls go to this site\'s own origin and will fail unless an API is proxied here.');

export class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}

export async function request(path, { method = 'GET', body, token, signal, form } = {}) {
  const headers = {};
  if (body && !form) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  let res;
  try {
    res = await fetch(`${API}${path}`, { method, headers, signal, body: form || (body ? JSON.stringify(body) : undefined) });
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0);
  }
  let data = null;
  try { data = await res.json(); } catch { /* non-JSON response */ }
  if (!res.ok) throw new ApiError(data?.error || `Request failed (${res.status}).`, res.status);
  if (data === null) throw new ApiError('Unexpected response from the server.', res.status);
  return data;
}

// Tiny in-memory cache for public GETs so navigating between pages does not refetch constantly.
const cache = new Map();
export async function getCached(path, ttl = 30000) {
  const hit = cache.get(path);
  if (hit && Date.now() - hit.t < ttl) return hit.v;
  const v = await request(path);
  cache.set(path, { t: Date.now(), v });
  return v;
}
export const clearCache = () => cache.clear();
export const apiConfigured = Boolean(API) || !import.meta.env.PROD;
