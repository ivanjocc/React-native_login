import axios from 'axios';

// const BASE_URL = "http://localhost:5001/api/users";
const BASE_URL = "https://clinical-backend-ia-3t0k.onrender.com/api/users";

// Registro de usuarios
export const registerUser = async (userData: any) => {
  try {
    const response = await axios.post(BASE_URL, userData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Erreur lors de l'inscription";
  }
};

// Inicio de sesión
export const loginUser = async (loginData: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, loginData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Erreur lors de la connexion";
  }
};
