import { exec } from 'child_process';
import fs from 'fs/promises';

export async function generateVideo(product, audioPath) {
  const output = `/tmp/${product.id}-video.mp4`;

  // Create temporary list of media files for ffmpeg concat
  const mediaListPath = `/tmp/${product.id}-medialist.txt`;
  let mediaListContent = '';

  for (const mediaUrl of product.media) {
    const filename = `/tmp/${product.id}-${mediaUrl.split('/').pop()}`;
    await downloadFile(mediaUrl, filename);
    mediaListContent += `file '${filename}'\n`;
  }

  await fs.writeFile(mediaListPath, mediaListContent);

  // Create slideshow/clip video
  const cmd = `
    ffmpeg -f concat -safe 0 -i ${mediaListPath} -i ${audioPath} \
    -filter_complex "[0:v]zoompan=z='min(zoom+0.0015,1.5)':d=125[video]" \
    -map "[video]" -map 1:a -shortest -y ${output}
  `;

  await new Promise((resolve, reject) => {
    exec(cmd, (err) => (err ? reject(err) : resolve()));
  });

  return uploadToCloud(output);
}

async function downloadFile(url, outputPath) {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  await fs.writeFile(outputPath, Buffer.from(buffer));
}

async function uploadToCloud(filePath) {
  const fileBuffer = await fs.readFile(filePath);
  const base64 = fileBuffer.toString('base64');
  return `data:video/mp4;base64,${base64}`;
}
