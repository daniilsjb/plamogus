import axios from 'axios';

const BASE_URL = 'http://localhost:8080/courses';

export const findAllCourses = async (params) => {
  const response = await axios.get(`${BASE_URL}`, { params });
  return response.data;
};

export const findOneCourse = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createCourse = async (course) => {
  const response = await axios.post(`${BASE_URL}`, course);
  return response.data;
};

export const updateCourse = async (course) => {
  const response = await axios.put(`${BASE_URL}/${course.id}`, course);
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
