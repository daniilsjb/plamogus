import { useState } from "react";
import Toolbar from "@mui/material/Toolbar";

import AssignmentOverview from "./AssignmentOverview";
import AssignmentCreate from "./AssignmentCreate";
import AssignmentUpdate from "./AssignmentUpdate";
import DetailsSidebar from "../../components/DetailsSidebar";

const Assignments = () => {
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

  const handleClose = () => {
    setSelectedAction(null);
    setSelectedAssignment(null);
  };

  return <>
    <AssignmentOverview
      handleCreate={handleCreate}
      handleSelect={handleSelect}
      detailsOpen={!!selectedAction}
      selectedAssignment={selectedAssignment}
    />

    <AssignmentDetails
      onClose={handleClose}
      selectedAction={selectedAction}
      selectedAssignment={selectedAssignment}
    />
  </>;
};

const AssignmentDetails = ({
  onClose,
  selectedAction,
  selectedAssignment,
}) => {
  return (
    <DetailsSidebar open={!!selectedAction} onClose={onClose}>
      <Toolbar/>
      {selectedAction === "create" && <AssignmentCreate close={onClose}/>}
      {selectedAction === "update" && <AssignmentUpdate close={onClose} assignment={selectedAssignment}/>}
    </DetailsSidebar>
  );
};

export default Assignments;
