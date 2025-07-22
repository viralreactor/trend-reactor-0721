const fs = require('fs/promises');
const path = require('path');
const { generateScript } = require('../utils/generateScript');
const { generateVideo } = require('../utils/generateVideo');
const { textToSpeech } = require('../utils/textToSpeech');
const { uploadToWebhook } = require('../utils/uploadWebhook');

module.exports = async (req, res) => {
  try {
    const filePath = path.join(process.cwd(), 'data', 'products.json');
    const productsRaw = await fs.readFile(filePath, 'utf-8');
    const products = JSON.parse(productsRaw);

    const product = products[Math.floor(Math.random() * products.length)];
    const script = await generateScript(product);
    const audio = await textToSpeech(script);
    const videoUrl = await generateVideo(product, audio);
    await uploadToWebhook(product, script, videoUrl);

    res.status(200).json({ message: 'Video created and sent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
