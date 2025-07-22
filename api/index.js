import fs from 'fs/promises';
import { generateScript } from '../utils/generateScript.js';
import { generateVideo } from '../utils/generateVideo.js';
import { textToSpeech } from '../utils/textToSpeech.js';
import { uploadToWebhook } from '../utils/uploadWebhook.js';

export default async function handler(req, res) {
  try {
    // Load products.json dynamically using fs
    const productsRaw = await fs.readFile('./data/products.json', 'utf-8');
    const products = JSON.parse(productsRaw);

    // Pick a random product
    const product = products[Math.floor(Math.random() * products.length)];

    // Generate the script, voice, and video
    const script = await generateScript(product);
    const audio = await textToSpeech(script);
    const videoUrl = await generateVideo(product, audio);

    // Upload to webhook
    await uploadToWebhook(product, script, videoUrl);

    res.status(200).json({ message: 'Video created and sent to webhook successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
