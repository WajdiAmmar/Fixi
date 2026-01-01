import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const createArtisanProfile = async (formData) => {
  const response = await axios.post(`${API_URL}/artisan-profiles`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const getAllArtisanProfiles = async () => {
  const response = await axios.get(`${API_URL}/artisan-profiles`);
  return response.data;
};
export const getArtisanProfileById = async (id) => {
  const response = await axios.get(`${API_URL}/artisan-profiles/${id}`);
  return response.data;
};
export const updateArtisanProfile = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/artisan-profiles/${id}`, updatedData);
  return response.data;
};
export const deleteArtisanProfile = async (id) => {
  const response = await axios.delete(`${API_URL}/artisan-profiles/${id}`);
  return response.data;
};

export const checkUserArtisanProfile = async (userId) => {
  const response = await axios.get(`${API_URL}/artisan-profiles/check/${userId}`);
  return response.data;
};
export const getRandomArtisanProfiles = async () => {
  const response = await axios.get(
    `${API_URL}/artisan-profiles/random`
  );
  return response.data;
};
export const getArtisanProfilesByServiceId = async (serviceId) => {
  const response = await axios.get(
    `${API_URL}/artisan-profiles/service/${serviceId}`
  );
  return response.data;
};
