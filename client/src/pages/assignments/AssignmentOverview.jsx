import { useState } from 'react';
import { useQuery } from 'react-query';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import SortIcon from '@mui/icons-material/Sort';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import TitleOutlinedIcon from '@mui/icons-material/TitleOutlined';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

import Assignment from './Assignment';

import { findAllCourses } from '../../services/course';
import { findAllAssignments } from '../../services/assignment';
import { partition } from '../../common/functional';
import ASSIGNMENT_TYPES from '../../schemas/assignment-types';

const ResponsiveIconButtonStyled = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'breakpoint',
})(({ theme, breakpoint }) => ({
  fontSize: theme.typography.pxToRem(14),
  minWidth: 'auto',

  [theme.breakpoints.down(breakpoint)]: {
    minWidth: 32,
    paddingLeft: 8,
    paddingRight: 8,
    '& .MuiButton-startIcon': {
      margin: 0,
    },
    '& .buttonText': {
      display: 'none',
    },
  },
}));

const Main = styled(Box, { shouldForwardProp: (prop) => prop !== 'detailsOpen' })(
  ({ theme, detailsOpen }) => {
    const isSidebarTemporary = useMediaQuery(theme.breakpoints.down('md'));
    return {
      marginRight: (isSidebarTemporary || !detailsOpen) ? 0 : `${theme.width.detailsDrawer}px`,
      ...(!isSidebarTemporary && {
        ...(detailsOpen ? {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        } : {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }),
      }),
    };
  },
);

const NewButton = ({ onClick }) => {
  return (
    <Tooltip title="Create Assignment">
      <Button variant="contained" onClick={onClick}>New</Button>
    </Tooltip>
  );
};

const SearchBar = () => {
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', flex: 1, alignItems: 'center' }}
    >
      <IconButton sx={{ p: '10px' }}>
        <SearchIcon/>
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search"
      />
    </Paper>
  );
};

const SortButton = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortingCriterion, setSortingCriterion] = useState(null);
  const [sortingDirection, setSortingDirection] = useState('asc');

  const open = !!anchorEl;

  const handleCriterionClicked = (criterion) => {
    setSortingCriterion(criterion);
    setAnchorEl(null);
  };

  const handleDirectionClicked = () => {
    setSortingDirection(sortingDirection === 'asc' ? 'desc' : 'asc');
    setAnchorEl(null);
  };

  const options = [
    {
      label: 'Title',
      value: 'title',
      Icon: TitleOutlinedIcon,
    },
    {
      label: 'Type',
      value: 'type',
      Icon: HistoryEduOutlinedIcon,
    },
    {
      label: 'Deadline Date',
      value: 'deadlineDate',
      Icon: CalendarMonthOutlinedIcon,
    },
    {
      label: 'Creation Date',
      value: 'creationDate',
      Icon: TodayOutlinedIcon,
    },
  ];

  return (
    <div>
      <Tooltip title="Change Ordering">
        <ResponsiveIconButtonStyled
          startIcon={<SortIcon/>} onClick={ev => setAnchorEl(ev.currentTarget)} breakpoint="sm"
        >
          <span className="buttonText">Sort</span>
        </ResponsiveIconButtonStyled>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={open} onClose={handleCriterionClicked}>
        {/* SORTING CRITERIA */}
        {options.map(({ label, value, Icon }) => (
          <MenuItem key={label} selected={value === sortingCriterion} onClick={() => handleCriterionClicked(value)}>
            <ListItemIcon>
              <Icon fontSize="small"/>
            </ListItemIcon>
            <ListItemText>{label}</ListItemText>
          </MenuItem>
        ))}

        <Divider/>

        {/* SORTING DIRECTION */}
        <MenuItem onClick={handleDirectionClicked}>
          {sortingDirection === 'asc' ? (<>
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
    </div>
  );
};

const FilterByTypeButton = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [criterion, setCriterion] = useState(null);

  const open = !!anchorEl;

  const handleCriterionClicked = (criterion) => {
    setCriterion(criterion);
    setAnchorEl(null);
  };

  return (
    <div>
      <Tooltip title="Filter by Type">
        <ResponsiveIconButtonStyled
          startIcon={<HistoryEduIcon/>} onClick={ev => setAnchorEl(ev.currentTarget)} breakpoint="sm"
        >
          <span className="buttonText">Type</span>
        </ResponsiveIconButtonStyled>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={open} onClose={handleCriterionClicked}>
        {/* FILTERING CRITERIA */}
        {ASSIGNMENT_TYPES.map(({ label, value }) => (
          <MenuItem key={label} selected={value === criterion} onClick={() => handleCriterionClicked(value)}>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

const FilterByCourseButton = () => {
  const { status, data } = useQuery({
    queryKey: ['courses'], queryFn: findAllCourses,
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [criterion, setCriterion] = useState(null);

  const open = !!anchorEl;

  const handleCriterionClicked = (criterion) => {
    setCriterion(criterion);
    setAnchorEl(null);
  };

  if (status === 'loading') {
    return null;
  }

  if (status === 'error') {
    // TODO: Redirect to an error page.
    return <Typography>Oops! An error occurred.</Typography>;
  }

  const options = data.map(course => ({
    label: course.code, value: course.id,
  }));

  return (
    <div>
      <Tooltip title="Filter by Course">
        <ResponsiveIconButtonStyled
          startIcon={<SchoolIcon/>} onClick={ev => setAnchorEl(ev.currentTarget)} breakpoint="sm"
        >
          <span className="buttonText">Course</span>
        </ResponsiveIconButtonStyled>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={open} onClose={handleCriterionClicked}>
        {/* FILTERING CRITERIA */}
        {options.map(({ label, value }) => (
          <MenuItem key={label} selected={value === criterion} onClick={() => handleCriterionClicked(value)}>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

const ActionBar = ({ handleCreate }) => {
  return (
    // TODO: Shrink spacing between items on smaller screens.
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      <NewButton onClick={handleCreate}/>
      <SearchBar/>
      <SortButton/>
      <FilterByTypeButton/>
      <FilterByCourseButton/>
    </Box>
  );
};

const AssignmentGroup = ({ title, assignments, selected, handleSelect }) => {
  return <>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography>{title}</Typography>
      <Typography
        variant="body2"
        sx={{ ml: 1, color: theme => theme.palette.grey[500] }}
      >
        {assignments.length}
      </Typography>
    </Box>

    {assignments.map((assignment, idx) => (
      <Assignment
        key={idx}
        assignment={assignment}
        selected={selected}
        handleSelect={handleSelect}
      />
    ))}
  </>;
};

const AssignmentEmpty = ({ handleCreate }) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    }}>
      <Icon component={AssignmentIcon} sx={{ fontSize: '160px', color: 'primary.main' }}></Icon>
      <Typography variant="h6">You don&apos;t have any assignments.</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>Would you like to create one now?</Typography>
      <Button variant="outlined" sx={{ mt: 2 }} onClick={handleCreate}>New</Button>
    </Box>
  );
};

const AssignmentContent = ({ data, selected, handleCreate, handleSelect }) => {
  const [completed, pending] = partition(data, it => it.completed);

  return <>
    <ActionBar handleCreate={handleCreate}/>

    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 2, overflow: 'auto' }}>
      {(pending.length !== 0) && <AssignmentGroup
        title="Pending"
        assignments={pending}
        selected={selected}
        handleSelect={handleSelect}
      />}

      {(completed.length !== 0) && <AssignmentGroup
        title="Completed"
        assignments={completed}
        selected={selected}
        handleSelect={handleSelect}
      />}
    </Box>
  </>;
};

const AssignmentOverview = ({ selectedAction, setSelectedAction, selectedAssignment, setSelectedAssignment }) => {
  const { status, data } = useQuery({
    queryKey: ['assignments'], queryFn: findAllAssignments,
  });

  if (status === 'loading') {
    return null;
  }

  if (status === 'error') {
    // TODO: Redirect to an error page.
    return <Typography>Oops! An error occurred.</Typography>;
  }

  const handleCreate = () => {
    setSelectedAction('create');
    setSelectedAssignment(null);
  };

  const handleSelect = (assignment) => {
    setSelectedAction('update');
    setSelectedAssignment(assignment);
  };

  const detailsOpen = !!selectedAction;
  return (
    <Main detailsOpen={detailsOpen} sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 3 }}>
      {(data.length === 0) ? (
        <AssignmentEmpty
          handleCreate={handleCreate}
        />
      ) : (
        <AssignmentContent
          data={data}
          handleCreate={handleCreate}
          handleSelect={handleSelect}
          selected={selectedAssignment}
        />
      )}
    </Main>
  );
};

export default AssignmentOverview;
