import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateScript(product) {
  const prompt = `Create a short, curious and viral-sounding product review script for TikTok, YouTube Shorts, and Instagram Reels. Sound like a real person but professional. Mention the product name: ${product.name} and highlight: ${product.features.join(', ')}. End with a curiosity-driven CTA to check the link in bio.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message.content.trim();
}
