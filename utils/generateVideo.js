const { v2: cloudinary } = require('cloudinary');
const fs = require('fs/promises');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function generateVideo(product, audioPath) {
  const images = product.images;

  // For simplicity, use the first image for now (upgrade later for full slideshow)
  const image = images[0];

  // Upload image to Cloudinary
  const upload = await cloudinary.uploader.upload(image, { resource_type: "image" });

  // Upload audio to Cloudinary
  const audioBuffer = await fs.readFile(audioPath);
  const audioBase64 = audioBuffer.toString('base64');

  const audioUpload = await cloudinary.uploader.upload(`data:audio/mp3;base64,${audioBase64}`, {
    resource_type: "video"
  });

  // Create simple Cloudinary video with image + audio overlay
  const videoUrl = cloudinary.url(upload.public_id + ".jpg", {
    resource_type: "video",
    overlay: { url: audioUpload.secure_url },
    transformation: [{ width: 720, crop: "scale" }]
  });

  return videoUrl;
}

module.exports = { generateVideo };
