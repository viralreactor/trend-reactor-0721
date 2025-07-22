const axios = require('axios');
const fs = require('fs/promises');

async function textToSpeech(text) {
  try {
    const audioPath = `/tmp/voice.mp3`;

    const elevenResponse = await axios.post(
      'https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL',
      { text },
      { headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY }, responseType: 'arraybuffer' }
    );

    await fs.writeFile(audioPath, elevenResponse.data);
    return audioPath;
  } catch (e) {
    try {
      const playhtResponse = await axios.post(
        'https://api.play.ht/api/v2/tts',
        { text, voice: "en-US-Wavenet-F" },
        { headers: { 'Authorization': `Bearer ${process.env.PLAYHT_API_KEY}` }, responseType: 'arraybuffer' }
      );
      await fs.writeFile('/tmp/playht.mp3', playhtResponse.data);
      return '/tmp/playht.mp3';
    } catch (err) {
      const openaiResponse = await axios.post(
        'https://api.openai.com/v1/audio/speech',
        { input: text, voice: "alloy", model: "tts-1" },
        { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }, responseType: 'arraybuffer' }
      );
      await fs.writeFile('/tmp/openai.mp3', openaiResponse.data);
      return '/tmp/openai.mp3';
    }
  }
}

module.exports = { textToSpeech };
