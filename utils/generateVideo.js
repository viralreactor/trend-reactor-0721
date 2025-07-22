import { exec } from 'child_process';
import fs from 'fs/promises';
import cloudinary from 'cloudinary';

// Cloudinary Config (Make sure you add these to Vercel env variables)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function generateVideo(product, audioPath) {
  const output = `/tmp/${product.id}-video.mp4`;
  const images = product.images;

  if (!images || images.length === 0) {
    throw new Error("Product must have at least one image in 'images' array");
  }

  const inputImages = images.map((img, idx) => `-loop 1 -t 5 -i ${img}`).join(' ');

  const zooms = images.map((_, idx) => 
    `[${idx}:v]scale=1080:1920,zoompan=z='min(zoom+0.0015,1.1)':d=125,setsar=1[img${idx}]`
  ).join('; ');

  const concatInputs = images.map((_, idx) => `[img${idx}]`).join('');

  const cmd = `
    ffmpeg ${inputImages} -i ${audioPath} -filter_complex "${zooms}; ${concatInputs}concat=n=${images.length}:v=1:a=0[outv]" -map "[outv]" -map ${images.length}:a -y ${output}
  `;

  await new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) reject(err);
      else resolve();
    });
  });

  // Upload to Cloudinary
  const result = await cloudinary.v2.uploader.upload(output, {
    resource_type: 'video',
    folder: 'trend-reactor-videos'
  });

  return result.secure_url;
}
