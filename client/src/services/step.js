import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export const findAllSteps = async (assignmentId) => {
  const response = await axios.get(`${BASE_URL}/assignments/${assignmentId}/steps`);
  return response.data;
};

export const createStep = async (assignmentId, step) => {
  const response = await axios.post(`${BASE_URL}/assignments/${assignmentId}/steps`, step);
  return response.data;
};

export const updateStep = async (id, step) => {
  const response = await axios.put(`${BASE_URL}/steps/${id}`, step);
  return response.data;
};

export const deleteStep = async (id) => {
  const response = await axios.delete(`${BASE_URL}/steps/${id}`);
  return response.data;
};

export const completeStep = async (id) => {
  const response = await axios.put(`${BASE_URL}/steps/${id}/completion`);
  return response.data;
};

export const uncompleteStep = async (id) => {
  const response = await axios.delete(`${BASE_URL}/steps/${id}/completion`);
  return response.data;
};
