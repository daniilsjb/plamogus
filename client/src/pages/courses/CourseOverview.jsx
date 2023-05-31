import { useState } from "react";
import { useQuery } from "react-query";
import { Navigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Icon from "@mui/material/Icon";
import SchoolIcon from "@mui/icons-material/School";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableBody from "@mui/material/TableBody";

import SearchBar from "../../components/SearchBar";
import { findAllCourses } from "../../api/course";

const CourseOverview = ({
  detailsOpen,
  handleCreate,
  handleSelect,
  selectedCourse,
}) => {
  const [queryParams, setQueryParams] = useState({ order: "asc" });
  const setQueryParam = (name, value) => {
    setQueryParams({
      ...queryParams,
      [name]: value,
    });
  };

  const { status, data } = useQuery({
    queryKey: ["courses", queryParams],
    queryFn: () => findAllCourses(queryParams),
    keepPreviousData: true,
  });

  if (status === "loading") {
    return <CoursesLoading/>;
  } else if (status === "error") {
    return <Navigate to="/error"/>;
  }

  return (
    <ContentContainer detailsOpen={detailsOpen} sx={{ display: "flex", flexDirection: "column", flex: 1, gap: 3 }}>
      {(data.length === 0 && !queryParams.search) ? (
        <CoursesEmpty handleCreate={handleCreate}/>
      ) : <>
        <CourseActionBar
          setQueryParam={setQueryParam}
          handleCreate={handleCreate}
        />

        {(data.length === 0 && !!queryParams.orderBy) ? (
          <FilteredCoursesEmpty/>
        ) : (
          <CourseTable
            data={data}
            handleSelect={handleSelect}
            selected={selectedCourse}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
          />
        )}
      </>}
    </ContentContainer>
  );
};

const CoursesLoading = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1 }}>
      <CircularProgress/>
      <Typography sx={{ mt: 3 }} variant="h6">Hold up a moment!</Typography>
      <Typography sx={{ mt: 1 }}>We are just loading your courses...</Typography>
    </Box>
  );
};

const CoursesEmpty = ({ handleCreate }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Icon component={SchoolIcon} sx={{ fontSize: "160px", color: "primary.main" }}></Icon>
      <Typography variant="h6">You don&apos;t have any courses.</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>Would you like to create one now?</Typography>
      <Button variant="outlined" sx={{ mt: 2 }} onClick={handleCreate}>New</Button>
    </Box>
  );
};

const FilteredCoursesEmpty = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Icon component={SearchOffIcon} sx={{ fontSize: "160px", color: "primary.main" }}></Icon>
      <Typography variant="h6">No courses match these criteria.</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>Try searching for something else instead.</Typography>
    </Box>
  );
};

const CourseActionBar = ({ setQueryParam, handleCreate }) => {
  return (
    <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
      <NewButton onClick={handleCreate}/>
      <SearchBar
        setSearch={(value) => setQueryParam("search", value)}
      />
    </Box>
  );
};

const NewButton = ({ onClick }) => {
  return (
    <Tooltip title="Create Course">
      <Button variant="contained" onClick={onClick}>New</Button>
    </Tooltip>
  );
};

const CourseTable = ({ data, queryParams, setQueryParams, handleSelect, selected }) => {
  const headCells = [
    { name: "code", label: "Code", numeric: false },
    { name: "title", label: "Title", numeric: false },
    { name: "semester", label: "Semester", numeric: true },
  ];

  const handleSortRequest = (criterion) => {
    const direction = (queryParams.orderBy === criterion && queryParams.order === "asc") ? "desc" : "asc";
    setQueryParams({
      ...queryParams,
      orderBy: criterion,
      order: direction,
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {headCells.map(({ name, label, numeric }) => (
              <TableCell key={name} align={numeric ? "center" : "left"}>
                <TableSortLabel
                  active={queryParams.orderBy === name}
                  direction={queryParams.orderBy === name ? queryParams.order : "asc"}
                  onClick={() => handleSortRequest(name)}
                >
                  {label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.map(it => (
            <CourseRow
              key={it.id}
              course={it}
              selected={selected?.id === it.id}
              onClick={() => handleSelect(it)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const CourseRow = ({ course, selected, onClick }) => {
  return (
    <TableRow hover={true} sx={{ cursor: "pointer" }} onClick={onClick} selected={selected}>
      <TableCell>{course.code}</TableCell>
      <TableCell>{course.title}</TableCell>
      <TableCell align="center">{course.semester}</TableCell>
    </TableRow>
  );
};

const ContentContainer = styled(Box, { shouldForwardProp: (prop) => prop !== "detailsOpen" })(
  ({ theme, detailsOpen }) => {
    const isSidebarTemporary = useMediaQuery(theme.breakpoints.down("md"));
    return {
      marginRight: (isSidebarTemporary || !detailsOpen) ? 0 : `${theme.width.detailsDrawer}px`,
      ...(!isSidebarTemporary && {
        ...(detailsOpen ? {
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        } : {
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }),
      }),
    };
  },
);

export default CourseOverview;
