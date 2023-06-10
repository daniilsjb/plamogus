import { useState } from "react";
import { useQuery } from "react-query";
import { Navigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import CourseOverview from "./CourseOverview";
import CourseCreate from "./CourseCreate";
import CourseUpdate from "./CourseUpdate";
import DetailsSidebar from "../../components/DetailsSidebar";

import { findAllCourses } from "../../api/course";
import { CourseContext, useCourseContext } from "./CourseContext";

const Courses = () => {
  const [queryParams, setQueryParams] = useState({ order: "asc" });
  const { status, data } = useCourseQuery({ queryParams });

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

const useCourseQuery = ({ queryParams }) => {
  return useQuery({
    queryKey: ["courses", queryParams],
    queryFn: () => findAllCourses(queryParams),
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
      <Typography sx={{ mt: 1 }}>We are just loading your courses...</Typography>
    </Box>
  );
};

const Content = ({ data, queryParams, setQueryParams }) => {
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

  const handleClear = () => {
    setSelectedAction(null);
    setSelectedCourse(null);
  };

  const context = {
    queryParams,
    setQueryParams,
    selectedAction,
    selectedCourse,
    handleCreate,
    handleSelect,
    handleClear,
  };

  return (
    <CourseContext.Provider value={context}>
      <Box sx={{ display: "flex", height: "100%" }}>
        <CourseOverview data={data}/>
        <CourseDetails/>
      </Box>
    </CourseContext.Provider>
  );
};

const CourseDetails = () => {
  const { selectedAction, handleClear } = useCourseContext();
  return (
    <DetailsSidebar open={!!selectedAction} onClose={handleClear}>
      <Toolbar/>
      {selectedAction === "create" && <CourseCreate/>}
      {selectedAction === "update" && <CourseUpdate/>}
    </DetailsSidebar>
  );
};

export default Courses;
