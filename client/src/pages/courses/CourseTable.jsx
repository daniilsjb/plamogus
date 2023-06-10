import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableBody from "@mui/material/TableBody";

import { useCourseContext } from "./CourseContext";

const headCells = [
  { name: "code", label: "Code", numeric: false },
  { name: "title", label: "Title", numeric: false },
  { name: "semester", label: "Semester", numeric: true },
];

const CourseTable = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {headCells.map(it => <CourseLabel key={it.name} cell={it}/>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map(it => <CourseRow key={it.id} course={it}/>)}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const CourseLabel = ({ cell }) => {
  const { queryParams, setQueryParams } = useCourseContext();

  const isCriterionSelected = queryParams.orderBy === cell.name;
  const isAscendingSelected = isCriterionSelected && (queryParams.order === "asc");

  const handleClick = () => {
    const direction = isAscendingSelected ? "desc" : "asc";
    const criterion = cell.name;

    setQueryParams({
      ...queryParams,
      orderBy: criterion,
      order: direction,
    });
  };

  return (
    <TableCell align={cell.numeric ? "center" : "left"}>
      <TableSortLabel
        active={isCriterionSelected}
        direction={isCriterionSelected ? queryParams.order : "asc"}
        onClick={() => handleClick()}
      >
        {cell.label}
      </TableSortLabel>
    </TableCell>
  );
};

const CourseRow = ({ course }) => {
  const { selectedCourse, handleSelect } = useCourseContext();
  return (
    <TableRow
      sx={{ cursor: "pointer" }}
      selected={selectedCourse?.id === course.id}
      onClick={() => handleSelect(course)}
      hover
    >
      <TableCell>{course.code}</TableCell>
      <TableCell sx={{ wordBreak: "break-word" }}>{course.title}</TableCell>
      <TableCell align="center">{course.semester}</TableCell>
    </TableRow>
  );
};

export default CourseTable;
