import { useState } from "react";
import { useQuery } from "react-query";
import { Navigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import AssignmentOverview from "./AssignmentOverview";
import AssignmentCreate from "./AssignmentCreate";
import AssignmentUpdate from "./AssignmentUpdate";
import DetailsSidebar from "../../components/DetailsSidebar";

import { findAllAssignments } from "../../api/assignment";
import { AssignmentContext, useAssignmentContext } from "./AssignmentContext";

const Assignments = () => {
  const [queryParams, setQueryParams] = useState({ order: "asc" });
  const { status, data } = useAssignmentsQuery({ queryParams });

  if (status === "error") {
    return <Navigate to="/error"/>;
  } else if (status === "loading") {
    return <Loading/>;
  } else {
    return <Content
      data={data}
      queryParams={queryParams}
      setQueryParams={setQueryParams}
    />;
  }
};

const useAssignmentsQuery = ({ queryParams }) => {
  return useQuery({
    queryKey: ["assignments", queryParams],
    queryFn: () => findAllAssignments(queryParams),
    keepPreviousData: true,
  });
};

const Loading = () => {
  return (
    <Box sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <CircularProgress/>
      <Typography sx={{ mt: 3 }} variant="h6">Hold up a moment!</Typography>
      <Typography sx={{ mt: 1 }}>We are just loading your assignments...</Typography>
    </Box>
  );
};

const Content = ({ data, queryParams, setQueryParams }) => {
  // The details sidebar will contain different contents depending on which action
  // the user is currently trying to perform (e.g., create or update an assignment).
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const handleCreate = () => {
    setSelectedAction("create");
    setSelectedAssignment(null);
  };

  const handleSelect = (assignment) => {
    setSelectedAction("update");
    setSelectedAssignment(assignment);
  };

  const handleClear = () => {
    setSelectedAction(null);
    setSelectedAssignment(null);
  };

  const context = {
    queryParams,
    setQueryParams,
    selectedAction,
    selectedAssignment,
    handleCreate,
    handleSelect,
    handleClear,
  };

  return (
    <AssignmentContext.Provider value={context}>
      <Box sx={{ display: "flex", height: "100%" }}>
        <AssignmentOverview data={data}/>
        <AssignmentDetails/>
      </Box>
    </AssignmentContext.Provider>
  );
};

const AssignmentDetails = () => {
  const { selectedAction, handleClear } = useAssignmentContext();
  return (
    <DetailsSidebar open={!!selectedAction} onClose={handleClear}>
      <Toolbar/>
      {selectedAction === "create" && <AssignmentCreate/>}
      {selectedAction === "update" && <AssignmentUpdate/>}
    </DetailsSidebar>
  );
};

export default Assignments;
