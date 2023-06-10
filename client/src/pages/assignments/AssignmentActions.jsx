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
import { useAssignmentContext } from "./AssignmentContext";

const AssignmentActions = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Controls/>
      <Selections/>
    </Box>
  );
};

const Controls = () => {
  const { handleCreate, queryParams, setQueryParams } = useAssignmentContext();
  return (
    <Box sx={{ display: "flex", gap: { xs: 1, sm: 2, md: 3 }, alignItems: "center" }}>
      <NewButton onClick={handleCreate}/>
      <SearchBar
        setSearch={value => setQueryParams({ ...queryParams, title: value })}
      />
      <FilterByTypeButton
        criterion={queryParams.type}
        setCriterion={value => setQueryParams({ ...queryParams, type: value })}
      />
      <FilterByCourseButton
        criterion={queryParams.course}
        setCriterion={value => setQueryParams({ ...queryParams, course: value })}
      />
      <SortButton
        order={queryParams.order}
        setOrder={value => setQueryParams({ ...queryParams, order: value })}
        orderBy={queryParams.orderBy}
        setOrderBy={value => setQueryParams({ ...queryParams, orderBy: value })}
      />
    </Box>
  );
};

const Selections = () => {
  const { queryParams } = useAssignmentContext();

  const sortingApplied = !!queryParams.orderBy;
  const filteringApplied = !!(queryParams.type || queryParams.course);

  // Selection chips are only displayed when necessary.
  if (!filteringApplied && !sortingApplied) {
    return null;
  }

  return (
    <Box sx={{
      display: "flex",
      justifyContent: "end",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 1,
      mt: 2,
    }}>
      {filteringApplied && <FilteringSelections/>}
      {sortingApplied && <SortingSelections/>}
    </Box>
  );
};

const FilteringSelections = () => {
  const { queryParams, setQueryParams } = useAssignmentContext();
  const clearType = () => setQueryParams({ ...queryParams, type: null });
  const clearCourse = () => setQueryParams({ ...queryParams, course: null });

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

const sortingOptions = [
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

const SortingSelections = () => {
  const { queryParams, setQueryParams } = useAssignmentContext();
  const clearOrderBy = () => setQueryParams({ ...queryParams, orderBy: null });

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Typography variant="body2">Sorted by</Typography>
      <SortChip order={queryParams.order} orderBy={queryParams.orderBy} onDelete={clearOrderBy}/>
    </Box>
  );
};

const SortChip = ({ order, orderBy, ...rest }) => {
  return <Chip
    size="small"
    icon={order === "asc" ? <ArrowUpwardOutlinedIcon/> : <ArrowDownwardOutlinedIcon/>}
    label={sortingOptions.find(it => it.value === orderBy).label}
    {...rest}
  />;
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
      {sortingOptions.map(({ label, value, Icon }) => (
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
