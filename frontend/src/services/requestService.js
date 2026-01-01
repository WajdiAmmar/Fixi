import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// ENVOYER UNE NOUVELLE DEMANDE
export const sendRequest = async (requestData) => {
  const response = await axios.post(`${API_URL}/request/send`, requestData);
  return response.data;
};


// RÉCUPÉRER TOUTES LES DEMANDES
export const getAllRequests = async () => {
  const response = await axios.get(`${API_URL}/request/`);
  return response.data;
};

// RÉCUPÉRER LES DEMANDES D'UN UTILISATEUR
export const getRequestsByUser = async (userId) => {
  const response = await axios.get(`${API_URL}/request/user/${userId}`);
  return response.data;
};

// RÉCUPÉRER LES DEMANDES D'UN ARTISAN
export const getRequestsByArtisan = async (artisanId) => {
  const response = await axios.get(`${API_URL}/request/artisan/${artisanId}`);
  return response.data;
};

// METTRE À JOUR LE STATUT D'UNE DEMANDE
export const updateRequestStatus = async (requestId, status) => {
  const response = await axios.patch(`${API_URL}/request/status/${requestId}`, { status });
  return response.data;
};
