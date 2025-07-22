import { generateScript } from '../utils/generateScript.js';
import { generateVideo } from '../utils/generateVideo.js';
import { textToSpeech } from '../utils/textToSpeech.js';
import { uploadToWebhook } from '../utils/uploadWebhook.js';

export default async function handler(req, res) {
  try {
    const productsModule = await import('../data/products.json', { assert: { type: "json" } });
    const products = productsModule.default;

    const product = products[Math.floor(Math.random() * products.length)];
    const script = await generateScript(product);
    const audio = await textToSpeech(script);
    const videoUrl = await generateVideo(product, audio);
    await uploadToWebhook(product, script, videoUrl);

    res.status(200).json({ message: 'Video created and sent to webhook successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
