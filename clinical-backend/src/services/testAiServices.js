const { inferRisk } = require("./aiServices");

(async () => {
  try {
    const response = await inferRisk({
      prompt: "What are the symptoms of hypertension?",
      model: "ALIENTELLIGENCE/medicaldiagnostictools",
    });

    console.log("AI Response:", response);
  } catch (error) {
    console.error("Error testing AI model:", error.message);
  }
})();
