const HealthData = require("../models/healthData");
const { inferRisk } = require("../services/aiServices");
const { sendNotification } = require("../services/socketService");

const saveHealthDataWithAlert = async (data) => {
  const healthData = await saveHealthDataWithAnalysis(data);

  if (healthData.analysis.riskLevel === "High") {
    sendNotification({
      message: "High health risk detected",
      userId: healthData.userId,
      data: healthData,
    });
  }

  return healthData;
};

const saveHealthDataWithAnalysis = async (data) => {
  const healthData = new HealthData(data);
  const riskAnalysis = await inferRisk(data);
  healthData.analysis = riskAnalysis; // Guardar el análisis en el registro
  return await healthData.save();
};

const saveHealthData = async (req, res) => {
  try {
    const { userId, heartRate, bloodPressure, oxygenLevel } = req.body;

    const healthData = new HealthData({
      userId,
      heartRate,
      bloodPressure,
      oxygenLevel,
    });

    await healthData.save();
    res
      .status(201)
      .json({ message: "Health data saved successfully", healthData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to save health data", error: error.message });
  }
};

const getHealthDataByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const healthData = await HealthData.find({ userId });

    if (!healthData.length) {
      return res
        .status(404)
        .json({ message: "No health data found for this user" });
    }

    res.status(200).json(healthData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch health data", error: error.message });
  }
};

module.exports = { saveHealthData, getHealthDataByUser };
