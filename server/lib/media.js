import { query } from './db.js';

/** Image uploads stored in MySQL, used when Cloudinary is not configured.
 *  The table is created automatically on first upload, so no migration is needed. */
let tableReady = false;
async function ensureTable() {
  if (tableReady) return;
  await query(`CREATE TABLE IF NOT EXISTS media_files (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    mime_type   VARCHAR(40)  NOT NULL,
    size_bytes  INT UNSIGNED NOT NULL,
    data        MEDIUMBLOB   NOT NULL,
    uploaded_by VARCHAR(160) NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  tableReady = true;
}

/** Detect the real image type from the file bytes (the browser-supplied mimetype can be faked). */
export function sniffImage(b) {
  if (b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  if (b.toString('ascii', 4, 8) === 'ftyp' && /avif|avis/.test(b.toString('ascii', 8, 12))) return 'image/avif';
  return null;
}

export async function saveImage(buffer, uploadedBy) {
  const mime = sniffImage(buffer);
  if (!mime) throw Object.assign(new Error('That file is not a valid JPG, PNG, WebP or AVIF image.'), { status: 400, expose: true });
  await ensureTable();
  const r = await query('INSERT INTO media_files (mime_type, size_bytes, data, uploaded_by) VALUES (?, ?, ?, ?)', [mime, buffer.length, buffer, uploadedBy || null]);
  return String(r.insertId);
}

export async function getImage(id) {
  await ensureTable();
  const rows = await query('SELECT mime_type, data FROM media_files WHERE id = ?', [id]);
  return rows[0] || null;
}
