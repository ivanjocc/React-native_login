import axios from "axios";

// const API_BASE_URL = "http://localhost:5001/api";

const API_BASE_URL = "https://clinical-backend-ia-3t0k.onrender.com/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Enregistrer un nouvel utilisateur
export const registerUser = async (donneesUtilisateur) => {
  try {
    const response = await api.post("/users", donneesUtilisateur);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'inscription de l'utilisateur :", error.response?.data || error.message);
    throw error;
  }
};

// Enregistrer des données de santé
export const saveHealthData = async (donneesSante) => {
  try {
    const response = await api.post("/health-data", donneesSante);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des données de santé :", error.response?.data || error.message);
    throw error;
  }
};

// Récupérer tous les utilisateurs
export const fetchUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error.response?.data || error.message);
    throw error;
  }
};

// Récupérer les données de santé par utilisateur
export const fetchHealthDataByUser = async (idUtilisateur) => {
  try {
    const response = await api.get(`/health-data/${idUtilisateur}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données de santé :", error.response?.data || error.message);
    throw error;
  }
};
