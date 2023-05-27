import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/dashboard';

export const getDashboard = async () => {
  const response = await axios.get(`${BASE_URL}`);
  return response.data;
};
