import client from "./client/config";

export const findAllCourses = async (params) => {
  const response = await client.get("/courses", { params });
  return response.data;
};

export const createCourse = async (course) => {
  const response = await client.post("/courses", course);
  return response.data;
};

export const updateCourse = async (course) => {
  const response = await client.put(`/courses/${course.id}`, course);
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await client.delete(`/courses/${id}`);
  return response.data;
};
