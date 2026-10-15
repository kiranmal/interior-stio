import { query, tx } from '../lib/db.js';

export const SOCIAL_PLATFORMS = ['instagram', 'facebook', 'linkedin', 'youtube', 'pinterest'];

/** Returns one flat object (same shape the API always returned): scalar settings + social links. */
export async function getAll() {
  const [rows, links] = await Promise.all([query('SELECT setting_key, setting_value FROM site_settings'), query('SELECT platform, url FROM social_links')]);
  const out = {};
  for (const r of rows) out[r.setting_key] = r.setting_value ?? '';
  for (const l of links) out[l.platform] = l.url;
  return out;
}

export async function save(data, updatedBy) {
  await tx(async (t) => {
    let order = 0;
    for (const [k, v] of Object.entries(data)) {
      if (SOCIAL_PLATFORMS.includes(k)) {
        order = SOCIAL_PLATFORMS.indexOf(k);
        if (v) await t.query('INSERT INTO social_links (platform, url, sort_order) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE url = VALUES(url), sort_order = VALUES(sort_order)', [k, v, order]);
        else await t.query('DELETE FROM social_links WHERE platform = ?', [k]);
      } else {
        await t.query('INSERT INTO site_settings (setting_key, setting_value, updated_by) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_by = VALUES(updated_by)', [k, String(v ?? ''), updatedBy || null]);
      }
    }
  });
  return getAll();
}
export async function isEmpty() { return (await query('SELECT 1 FROM site_settings LIMIT 1')).length === 0; }
