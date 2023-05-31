import { useState } from "react";
import { useQuery } from "react-query";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

import SchoolIcon from "@mui/icons-material/School";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import TitleOutlinedIcon from "@mui/icons-material/TitleOutlined";
import HistoryEduOutlinedIcon from "@mui/icons-material/HistoryEduOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import TodayOutlinedIcon from "@mui/icons-material/TodayOutlined";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import SortIcon from "@mui/icons-material/Sort";

import SearchBar from "../../components/SearchBar";
import ResponsiveIconButton from "../../components/ResponsiveIconButton";

import { findAllCourses } from "../../api/course";
import { ASSIGNMENT_TYPES } from "../../common/constants";

const AssignmentActions = ({ queryParams, setQueryParam, handleCreate }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Controls
        queryParams={queryParams}
        setQueryParam={setQueryParam}
        handleCreate={handleCreate}
      />

      <Selections
        queryParams={queryParams}
        setQueryParam={setQueryParam}
      />
    </Box>
  );
};

const Controls = ({ queryParams, setQueryParam, handleCreate }) => {
  return (
    <Box sx={{ display: "flex", gap: { xs: 1, sm: 2, md: 3 }, alignItems: "center" }}>
      <NewButton onClick={handleCreate}/>
      <SearchBar
        setSearch={(value) => setQueryParam("title", value)}
      />
      <FilterByTypeButton
        criterion={queryParams.type}
        setCriterion={(value) => setQueryParam("type", value)}
      />
      <FilterByCourseButton
        criterion={queryParams.course}
        setCriterion={(value) => setQueryParam("course", value)}
      />
      <SortButton
        order={queryParams.order}
        setOrder={(value) => setQueryParam("order", value)}
        orderBy={queryParams.orderBy}
        setOrderBy={(value) => setQueryParam("orderBy", value)}
      />
    </Box>
  );
};

const Selections = ({ queryParams, setQueryParam }) => {
  const isSortingApplied = !!queryParams.orderBy;
  const isFilteringApplied = !!queryParams.type || !!queryParams.course;

  return (isFilteringApplied || isSortingApplied) && (
    <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", flexWrap: "wrap", gap: 1, mt: 2 }}>
      {isFilteringApplied && <FilteringSelections
        queryParams={queryParams}
        setQueryParam={setQueryParam}
      />}
      {isSortingApplied && <SortingSelections
        queryParams={queryParams}
        setQueryParam={setQueryParam}
      />}
    </Box>
  );
};

const FilteringSelections = ({ queryParams, setQueryParam }) => {
  const clearType = () => setQueryParam("type", null);
  const clearCourse = () => setQueryParam("course", null);

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Typography variant="body2">Having</Typography>
      {queryParams.type && <TypeChip type={queryParams.type} onDelete={clearType}/>}
      {queryParams.course && <CourseChip code={queryParams.course} onDelete={clearCourse}/>}
    </Box>
  );
};

const TypeChip = ({ type, ...rest }) => {
  return <Chip
    size="small"
    icon={<HistoryEduIcon/>}
    label={ASSIGNMENT_TYPES.find(it => it.value === type).label}
    {...rest}
  />;
};

const CourseChip = ({ code, ...rest }) => {
  return <Chip
    size="small"
    icon={<SchoolIcon/>}
    label={code}
    {...rest}
  />;
};

const filteringOptions = [
  {
    label: "Title",
    value: "title",
    Icon: TitleOutlinedIcon,
  },
  {
    label: "Type",
    value: "type",
    Icon: HistoryEduOutlinedIcon,
  },
  {
    label: "Deadline Date",
    value: "deadlineTime",
    Icon: CalendarMonthOutlinedIcon,
  },
  {
    label: "Creation Date",
    value: "creationTime",
    Icon: TodayOutlinedIcon,
  },
];

const SortingSelections = ({ queryParams, setQueryParam }) => {
  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Typography variant="body2">Sorted by</Typography>
      <Chip
        size="small"
        icon={queryParams.order === "asc" ? <ArrowUpwardOutlinedIcon/> : <ArrowDownwardOutlinedIcon/>}
        label={filteringOptions.find(it => it.value === queryParams.orderBy).label}
        onDelete={() => setQueryParam("orderBy", null)}/>
    </Box>
  );
};

const NewButton = ({ onClick }) => {
  return (
    <Tooltip title="Create Assignment">
      <Button variant="contained" onClick={onClick}>New</Button>
    </Tooltip>
  );
};

const SortButton = ({ orderBy, setOrderBy, order, setOrder }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleCriterionClicked = (criterion) => {
    setOrderBy(criterion);
    setAnchorEl(null);
  };

  const handleDirectionClicked = () => {
    setOrder(order === "asc" ? "desc" : "asc");
    setAnchorEl(null);
  };

  return <>
    <Tooltip title="Change Ordering">
      <ResponsiveIconButton
        startIcon={<SortIcon/>}
        onClick={event => setAnchorEl(event.currentTarget)}
        breakpoint="sm"
      >
        <span className="buttonText">Sort</span>
      </ResponsiveIconButton>
    </Tooltip>

    <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
      {/* ORDER BY */}
      {filteringOptions.map(({ label, value, Icon }) => (
        <MenuItem key={label} selected={value === orderBy} onClick={() => handleCriterionClicked(value)}>
          <ListItemIcon>
            <Icon fontSize="small"/>
          </ListItemIcon>
          <ListItemText>{label}</ListItemText>
        </MenuItem>
      ))}

      <Divider/>

      {/* ORDER */}
      <MenuItem onClick={handleDirectionClicked}>
        {order === "asc" ? (<>
          <ListItemIcon>
            <ArrowUpwardOutlinedIcon fontSize="small"/>
          </ListItemIcon>
          <ListItemText>Ascending</ListItemText>
        </>) : (<>
          <ListItemIcon>
            <ArrowDownwardOutlinedIcon fontSize="small"/>
          </ListItemIcon>
          <ListItemText>Descending</ListItemText>
        </>)}
      </MenuItem>
    </Menu>
  </>;
};

const FilterByTypeButton = ({ criterion, setCriterion }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleCriterionClicked = (criterion) => {
    setCriterion(criterion);
    setAnchorEl(null);
  };

  return <>
    <Tooltip title="Filter by Type">
      <ResponsiveIconButton
        startIcon={<HistoryEduIcon/>}
        onClick={event => setAnchorEl(event.currentTarget)}
        breakpoint="sm"
      >
        <span className="buttonText">Type</span>
      </ResponsiveIconButton>
    </Tooltip>

    <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
      {/* FILTERING CRITERIA */}
      {ASSIGNMENT_TYPES.map(({ label, value }) => (
        <MenuItem key={label} selected={value === criterion} onClick={() => handleCriterionClicked(value)}>
          {label}
        </MenuItem>
      ))}
    </Menu>
  </>;
};

const FilterByCourseButton = ({ criterion, setCriterion }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const { data } = useQuery({
    queryKey: ["courses"],
    queryFn: () => findAllCourses({}),
    placeholderData: [],
  });

  const handleCriterionClicked = (criterion) => {
    setCriterion(criterion);
    setAnchorEl(null);
  };

  const options = data.map(course => ({
    label: course.code,
    value: course.code,
  }));

  return <>
    <Tooltip title="Filter by Course">
      <ResponsiveIconButton
        startIcon={<SchoolIcon/>}
        onClick={event => setAnchorEl(event.currentTarget)}
        breakpoint="sm"
      >
        <span className="buttonText">Course</span>
      </ResponsiveIconButton>
    </Tooltip>

    <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
      {/* FILTERING CRITERIA */}
      {options.map(({ label, value }) => (
        <MenuItem key={label} selected={value === criterion} onClick={() => handleCriterionClicked(value)}>
          {label}
        </MenuItem>
      ))}
    </Menu>
  </>;
};

export default AssignmentActions;
