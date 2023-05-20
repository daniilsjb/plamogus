import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';

import AssignmentOverview from './AssignmentOverview';
import AssignmentCreate from './AssignmentCreate';
import AssignmentUpdate from './AssignmentUpdate';

const AssignmentDetails = ({ selectedAction, setSelectedAction, selectedAssignment, setSelectedAssignment }) => {
  const { breakpoints, width } = useTheme();
  const isSidebarTemporary = useMediaQuery(breakpoints.down('md'));

  const open = !!selectedAction;
  const handleClose = () => {
    setSelectedAction(null);
    setSelectedAssignment(null);
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      onClose={handleClose}
      variant={isSidebarTemporary ? 'temporary' : 'persistent'}
      PaperProps={{
        sx: { width: width.detailsDrawer, boxSizing: 'border-box', p: 3 },
      }}
    >
      <Toolbar/>
      {selectedAction === 'create' && <AssignmentCreate close={handleClose}/>}
      {selectedAction === 'update' && <AssignmentUpdate close={handleClose} assignment={selectedAssignment}/>}
    </Drawer>
  );
};

const Assignments = () => {
  // The details sidebar will contain different contents depending on which action
  // the user is currently trying to perform (e.g., create or update a course).
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  return <>
    <AssignmentOverview
      selectedAction={selectedAction}
      setSelectedAction={setSelectedAction}
      selectedAssignment={selectedAssignment}
      setSelectedAssignment={setSelectedAssignment}
    />

    <AssignmentDetails
      selectedAction={selectedAction}
      setSelectedAction={setSelectedAction}
      selectedAssignment={selectedAssignment}
      setSelectedAssignment={setSelectedAssignment}
    />
  </>;
};

export default Assignments;
