import axios from 'axios';

const BASE_URL = 'http://localhost:8080/assignments';

export const findAllAssignments = async () => {
  const response = await axios.get(`${BASE_URL}`);
  return response.data;
};

export const findOneAssignment = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createAssignment = async (assignment) => {
  const response = await axios.post(`${BASE_URL}`, assignment);
  return response.data;
};

export const updateAssignment = async (assignment) => {
  const response = await axios.put(`${BASE_URL}/${assignment.id}`, assignment);
  return response.data;
};

export const deleteAssignment = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};

export const completeAssignment = async (id) => {
  const response = await axios.put(`${BASE_URL}/${id}/completion`);
  return response.data;
};

export const uncompleteAssignment = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}/completion`);
  return response.data;
};
