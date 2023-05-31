import client from "./client/config";

export const getDashboard = async () => {
  const response = await client.get(`/dashboard`);
  return response.data;
};
