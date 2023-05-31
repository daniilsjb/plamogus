import { useMutation, useQueryClient } from "react-query";
import { createStep, deleteStep, toggleStepCompletion, updateStep } from "../api/step";

export const useStepCompletion = (assignmentId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleStepCompletion,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["steps", assignmentId] });
    },
  });
};

export const useStepCreation = (assignmentId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStep,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["steps", assignmentId] });
    },
  });
};

export const useStepUpdate = (assignmentId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }) => updateStep(id, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["steps", assignmentId] });
    },
  });
};

export const useStepDeletion = (assignmentId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStep,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["steps", assignmentId] });
    },
  });
};