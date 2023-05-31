import client from "./client/config";

export const findAllSteps = async (assignmentId) => {
  const response = await client.get(`/assignments/${assignmentId}/steps`);
  return response.data;
};

export const createStep = async (assignmentId, step) => {
  const response = await client.post(`/assignments/${assignmentId}/steps`, step);
  return response.data;
};

export const updateStep = async (id, step) => {
  const response = await client.put(`/steps/${id}`, step);
  return response.data;
};

export const deleteStep = async (id) => {
  const response = await client.delete(`/steps/${id}`);
  return response.data;
};

export const completeStep = async (id) => {
  const response = await client.put(`/steps/${id}/completion`);
  return response.data;
};

export const uncompleteStep = async (id) => {
  const response = await client.delete(`/steps/${id}/completion`);
  return response.data;
};

export const toggleStepCompletion = async (step) => {
  if (!step.completed) {
    return completeStep(step.id);
  } else {
    return uncompleteStep(step.id);
  }
};
