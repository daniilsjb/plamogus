import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';

import CourseOverview from './CourseOverview';

const CourseDetails = ({ selectedAction, setSelectedAction, selectedCourse, setSelectedCourse }) => {
  const { breakpoints, width } = useTheme();
  const isSidebarTemporary = useMediaQuery(breakpoints.down('md'));

  const close = () => {
    setSelectedAction(null);
    setSelectedCourse(null);
  };

  return (
    <Drawer
      anchor="right"
      variant={isSidebarTemporary ? 'temporary' : 'persistent'}
      open={!!selectedAction}
      onClose={close}
      PaperProps={{
        sx: { width: width.detailsDrawer, boxSizing: 'border-box', p: 3 },
      }}
    >
      <Toolbar/>
      {selectedAction === 'create' && <CourseCreate close={close}/>}
      {selectedAction === 'update' && <CourseUpdate close={close} course={selectedCourse}/>}
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