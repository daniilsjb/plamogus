import axios from 'axios';

const BASE_URL = 'http://localhost:8080/assignments';

export const findAllSteps = async (assignmentId) => {
  const response = await axios.get(`${BASE_URL}/${assignmentId}/steps`);
  return response.data;
};

export const createStep = async (assignmentId, step) => {
  const response = await axios.post(`${BASE_URL}/${assignmentId}/steps`, step);
  return response.data;
};

export const updateStep = async (assignmentId, index, step) => {
  const response = await axios.put(`${BASE_URL}/${assignmentId}/steps/${index}`, step);
  return response.data;
};

export const deleteStep = async (assignmentId, index) => {
  const response = await axios.delete(`${BASE_URL}/${assignmentId}/steps/${index}`);
  return response.data;
};

export const completeStep = async (assignmentId, index) => {
  const response = await axios.put(`${BASE_URL}/${assignmentId}/steps/${index}/completion`);
  return response.data;
};

export const uncompleteStep = async (assignmentId, index) => {
  const response = await axios.delete(`${BASE_URL}/${assignmentId}/steps/${index}/completion`);
  return response.data;
};
