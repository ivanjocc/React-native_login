const { inferRisk } = require("../services/aiServices");
const HealthData = require("../models/healthData"); // Modelo de datos de salud

const getMedicalChatResponse = async (req, res) => {
  try {
    const { question } = req.body;

    // Validar la pregunta
    if (!question) {
      return res.status(400).json({ message: "Question is required." });
    }

    // Procesar la pregunta con el modelo de IA
    const analysis = await inferRisk({ prompt: question });
    console.log("AI Analysis:", analysis);

    // Generar recomendaciones
    const recommendations = `Based on the analysis:
      - ${analysis}`;

    res.status(200).json({ recommendations });
  } catch (error) {
    console.error("Error in Medical Chat:", error.message);
    res
      .status(500)
      .json({ message: "Unable to fetch recommendations at this time." });
  }
};

module.exports = { getMedicalChatResponse };
