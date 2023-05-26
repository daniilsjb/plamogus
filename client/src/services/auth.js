import axios from 'axios';

const BASE_URL = 'http://localhost:8080/auth';

export const register = async (request) => {
  const response = await axios.post(`${BASE_URL}/register`, request);
  localStorage.setItem('auth_token', response.data.token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
  return response.data;
};

export const login = async (request) => {
  const response = await axios.post(`${BASE_URL}/login`, request);
  localStorage.setItem('auth_token', response.data.token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('auth_token');
  axios.defaults.headers.common['Authorization'] = '';
};
