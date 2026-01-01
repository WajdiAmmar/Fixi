import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// ENVOYER UNE NOUVELLE RÉPONSE
export const sendResponse = async (responseData) => {
  const response = await axios.post(`${API_URL}/response/send`, responseData);
  return response.data;
};

// RÉCUPÉRER TOUTES LES RÉPONSES
export const getAllResponses = async () => {
  const response = await axios.get(`${API_URL}/response/`);
  return response.data;
};

// RÉCUPÉRER LES RÉPONSES D'UNE DEMANDE SPÉCIFIQUE
export const getResponsesByRequest = async (requestId) => {
  const response = await axios.get(`${API_URL}/response/request/${requestId}`);
  return response.data;
};

// RÉCUPÉRER LES RÉPONSES D'UN ARTISAN
export const getResponsesByArtisan = async (artisanId) => {
  const response = await axios.get(`${API_URL}/response/artisan/${artisanId}`);
  return response.data;
};
