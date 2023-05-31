import client from "./client/config";

export const findAllAssignments = async (params) => {
  const response = await client.get("/assignments", { params });
  return response.data;
};

export const createAssignment = async (assignment) => {
  const response = await client.post("/assignments", assignment);
  return response.data;
};

export const updateAssignment = async (assignment) => {
  const response = await client.put(`/assignments/${assignment.id}`, assignment);
  return response.data;
};

export const deleteAssignment = async (id) => {
  const response = await client.delete(`/assignments/${id}`);
  return response.data;
};

export const completeAssignment = async (id) => {
  const response = await client.put(`/assignments/${id}/completion`);
  return response.data;
};

export const uncompleteAssignment = async (id) => {
  const response = await client.delete(`/assignments/${id}/completion`);
  return response.data;
};

export const toggleAssignmentCompletion = async (assignment) => {
  if (!assignment.completed) {
    return completeAssignment(assignment.id);
  } else {
    return uncompleteAssignment(assignment.id);
  }
};
