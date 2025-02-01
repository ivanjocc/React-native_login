const path = require("path");
const faceapi = require("face-api.js");
const canvas = require("canvas");

// Configurar entorno de Node.js con `canvas`
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Función para cargar modelos de reconocimiento facial
const loadModels = async () => {
  try {
    const modelPath = path.join(__dirname, "../models"); // Ruta a los modelos descargados
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath); // Modelo de detección de rostros
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath); // Modelo de puntos de referencia faciales
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath); // Modelo de reconocimiento facial
    console.log("Modelos de Face API cargados correctamente.");
  } catch (error) {
    console.error("Error al cargar los modelos de Face API:", error);
    throw new Error("No se pudieron cargar los modelos de Face API.");
  }
};

// Función para validar el rostro
const validateFace = async (imageBuffer) => {
  try {
    // Cargar imagen desde el buffer proporcionado
    const img = await canvas.loadImage(imageBuffer);

    // Detectar rostros y calcular descriptores
    const detections = await faceapi
      .detectAllFaces(img, new faceapi.SsdMobilenetv1Options())
      .withFaceLandmarks()
      .withFaceDescriptors();

    // Validar detecciones
    if (detections.length === 0) {
      console.log("No se detectaron rostros.");
      return null;
    }

    console.log("Detecciones realizadas:", detections);
    return detections.map((detection) => detection.descriptor); // Devuelve los descriptores faciales
  } catch (error) {
    console.error("Error al validar el rostro:", error);
    return null;
  }
};

module.exports = { loadModels, validateFace };
