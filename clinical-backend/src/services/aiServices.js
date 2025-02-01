const { exec } = require("child_process");

/**
 * Ejecuta el modelo Ollama localmente y devuelve la respuesta.
 * @param {Object} options - Configuración del modelo.
 * @param {string} options.prompt - Texto del prompt a enviar al modelo.
 * @param {string} [options.model="monotykamary/medichat-llama3"] - Modelo a ejecutar.
 * @returns {Promise<string>} - Respuesta del modelo.
 */
const inferRisk = async ({ prompt, model = "ALIENTELLIGENCE/medicaldiagnostictools" }) => {
  return new Promise((resolve, reject) => {
    console.log("Executing model:", model);
    console.log("Prompt being sent:", prompt);

    //Construir el comando con echo y ollama
    const command = `echo "${prompt}" | ollama run ${model}`;
    //const command = `echo "${prompt}" | ollama run --server=http://172.18.0.2:5002 ${model}`;


    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Exec error:", stderr || error.message);
        return reject(new Error("AI model execution failed."));
      }

      console.log("Model Response:", stdout.trim());
      resolve(stdout.trim());
    });
  });
};

const regression = (healthData) => {
  const heartRates = healthData.map((d) => d.heartRate);
  const avgHeartRate = heartRates.reduce((a, b) => a + b, 0) / heartRates.length;

  const oxygenLevels = healthData.map((d) => d.oxygenLevel);
  const avgOxygenLevel = oxygenLevels.reduce((a, b) => a + b, 0) / oxygenLevels.length;

  return {
    nextHeartRate: avgHeartRate,
    nextOxygenLevel: avgOxygenLevel,
  };
};

const classifyRisk = (data) => {
  if (data.heartRate > 120 || data.bloodPressure.includes("140/100")) {
    return "High Risk";
  } else if (data.heartRate > 90 || data.oxygenLevel < 92) {
    return "Moderate Risk";
  } else {
    return "Low Risk";
  }
};

module.exports = { inferRisk, regression, classifyRisk };
