/** Optional Cloudinary integration. Uploads are disabled unless all three variables are set. */
export function cloudinaryEnabled() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

export async function uploadBuffer(buffer, { folder } = {}) {
  if (!cloudinaryEnabled()) throw Object.assign(new Error('Image uploads are not configured on the server.'), { status: 501, expose: true });
  let cloudinary;
  try { ({ v2: cloudinary } = await import('cloudinary')); }
  catch { throw Object.assign(new Error('The cloudinary package is not installed on the server.'), { status: 501, expose: true }); }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder || process.env.CLOUDINARY_FOLDER || 'ivy-interio', resource_type: 'image', overwrite: false },
      (err, result) => (err ? reject(err) : resolve({ url: result.secure_url, publicId: result.public_id, width: result.width, height: result.height })),
    );
    stream.end(buffer);
  });
}
