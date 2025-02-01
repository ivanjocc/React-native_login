// voiceRecognition.js
const User = require("../models/User");
//const voiceApi = require("some-voice-recognition-lib");
const speech = require("@google-cloud/speech");
const client = new speech.SpeechClient();


// Validar reconocimiento de voz
const validateVoice = async (audioBuffer) => {
    try {
      const audioBytes = audioBuffer.toString("base64");
  
      const request = {
        audio: { content: audioBytes },
        config: {
          encoding: "LINEAR16",
          sampleRateHertz: 16000,
          languageCode: "en-US",
        },
      };
  
      const [response] = await client.recognize(request);
      const transcription = response.results
        .map((result) => result.alternatives[0].transcript)
        .join("\n");
  
      console.log("Transcripción:", transcription);
      return transcription;
    } catch (error) {
      console.error("Error en reconocimiento de voz:", error);
      return null;
    }
  };

module.exports = { validateVoice };
