import { createContext, useContext } from "react";

export const AssignmentContext = createContext({});

export const useAssignmentContext = () => {
  return useContext(AssignmentContext);
};
