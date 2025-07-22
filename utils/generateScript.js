const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateScript(product) {
  const prompt = `Create a short, viral, conversational product video script for social media. Mention the product: ${product.name}, highlight: ${product.features.join(', ')}. End with "Check the link in bio."`;

  const completion = await openai.createChatCompletion({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.data.choices[0].message.content.trim();
}

module.exports = { generateScript };
