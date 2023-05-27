import { useState } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';

import CourseOverview from './CourseOverview';
import CourseCreate from './CourseCreate';
import CourseUpdate from './CourseUpdate';

const CourseDetails = ({ selectedAction, setSelectedAction, selectedCourse, setSelectedCourse }) => {
  const { breakpoints, width } = useTheme();
  const isSidebarTemporary = useMediaQuery(breakpoints.down('md'));

  const open = !!selectedAction;
  const handleClose = () => {
    setSelectedAction(null);
    setSelectedCourse(null);
  };

  return (
    <Drawer
      anchor="right"
      variant={isSidebarTemporary ? 'temporary' : 'persistent'}
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { width: width.detailsDrawer, boxSizing: 'border-box', p: 3 },
      }}
    >
      <Toolbar/>
      {selectedAction === 'create' && <CourseCreate close={handleClose}/>}
      {selectedAction === 'update' && <CourseUpdate close={handleClose} course={selectedCourse}/>}
    </Drawer>
  );
};

const Courses = () => {
  // The details sidebar will contain different contents depending on which action
  // the user is currently trying to perform (e.g., create or update a course).
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  return <>
    <CourseOverview
      selectedAction={selectedAction}
      setSelectedAction={setSelectedAction}
      selectedCourse={selectedCourse}
      setSelectedCourse={setSelectedCourse}
    />

    <CourseDetails
      selectedAction={selectedAction}
      setSelectedAction={setSelectedAction}
      selectedCourse={selectedCourse}
      setSelectedCourse={setSelectedCourse}
    />
  </>;
};

export default Courses;
