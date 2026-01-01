import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Récupérer tous les services
export const getServices = async () => {
  const response = await axios.get(`${API_URL}/services`);
  return response.data;
};
export const getRandomServices = async (limit = 5) => {
  const response = await axios.get(`${API_URL}/services/random?limit=${limit}`);
  return response.data;
};
// Créer un nouveau service
export const createService = async (serviceData) => {
  const response = await axios.post(`${API_URL}/services`, serviceData);
  return response.data;
};

// Mettre à jour un service
export const updateService = async (id, serviceData) => {
  const response = await axios.put(`${API_URL}/services/${id}`, serviceData);
  return response.data;
};

// Supprimer un service
export const deleteService = async (id) => {
  const response = await axios.delete(`${API_URL}/services/${id}`);
  return response.data;
};

