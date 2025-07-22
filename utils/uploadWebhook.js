const axios = require('axios');

async function uploadToWebhook(product, script, videoUrl) {
  await axios.post(process.env.WEBHOOK_URL, {
    product: product.name,
    caption: script,
    video: videoUrl
  });
}

module.exports = { uploadToWebhook };
