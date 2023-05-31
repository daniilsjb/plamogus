import { useMutation, useQueryClient } from "react-query";
import { createAssignment, deleteAssignment, toggleAssignmentCompletion, updateAssignment } from "../api/assignment";

export const useAssignmentCompletion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleAssignmentCompletion,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
};

export const useAssignmentCreation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAssignment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
};

export const useAssignmentUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAssignment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
};

export const useAssignmentDeletion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAssignment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
};
