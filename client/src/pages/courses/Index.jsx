import { useState } from "react";
import Toolbar from "@mui/material/Toolbar";

import CourseOverview from "./CourseOverview";
import CourseCreate from "./CourseCreate";
import CourseUpdate from "./CourseUpdate";
import DetailsSidebar from "../../components/DetailsSidebar";

const Courses = () => {
  // The details sidebar will contain different contents depending on which action
  // the user is currently trying to perform (e.g., create or update a course).
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleCreate = () => {
    setSelectedAction("create");
    setSelectedCourse(null);
  };

  const handleSelect = (course) => {
    setSelectedAction("update");
    setSelectedCourse(course);
  };

  const handleClose = () => {
    setSelectedAction(null);
    setSelectedCourse(null);
  };

  return <>
    <CourseOverview
      detailsOpen={!!selectedAction}
      handleCreate={handleCreate}
      handleSelect={handleSelect}
      selectedCourse={selectedCourse}
    />

    <CourseDetails
      onClose={handleClose}
      selectedAction={selectedAction}
      selectedCourse={selectedCourse}
    />
  </>;
};

const CourseDetails = ({
  onClose,
  selectedAction,
  selectedCourse,
}) => {
  return (
    <DetailsSidebar open={!!selectedAction} onClose={onClose}>
      <Toolbar/>
      {selectedAction === "create" && <CourseCreate close={onClose}/>}
      {selectedAction === "update" && <CourseUpdate close={onClose} course={selectedCourse}/>}
    </DetailsSidebar>
  );
};

export default Courses;
