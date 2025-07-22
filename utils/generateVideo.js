import { exec } from 'child_process';
import fs from 'fs/promises';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function generateVideo(product, audioPath) {
  const output = `/tmp/${product.id}-video.mp4`;
  const image = product.image;

  const cmd = `
    ffmpeg -loop 1 -i ${image} -i ${audioPath} -filter_complex "[0:v]zoompan=z='min(zoom+0.0015,1.5)':d=125[video]" -map "[video]" -map 1:a -t 30 -y ${output}
  `;

  await new Promise((resolve, reject) => {
    exec(cmd, (err) => (err ? reject(err) : resolve()));
  });

  return await uploadToCloudinary(output, product.id);
}

async function uploadToCloudinary(filePath, publicId) {
  const res = await cloudinary.uploader.upload(filePath, {
    resource_type: "video",
    public_id: `trendreactor/${publicId}-${Date.now()}`,
    overwrite: true,
  });

  return res.secure_url; // This will be the video URL you send to Make.com
}
