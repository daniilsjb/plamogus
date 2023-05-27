import { useState } from 'react';
import { useQuery } from 'react-query';
import { findAllCourses } from '../../services/course';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { Icon } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableBody from '@mui/material/TableBody';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

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

const CourseTable = ({
  data,
  selectCourse, selectedCourse,
  sortingCriterion, setSortingCriterion,
  sortingDirection, setSortingDirection,
}) => {
  const handleSortRequest = (criterion) => {
    const direction = (sortingCriterion === criterion && sortingDirection === 'asc') ? 'desc' : 'asc';
    setSortingDirection(direction);
    setSortingCriterion(criterion);
  };

  const headCells = [
    { name: 'code', label: 'Code', numeric: false },
    { name: 'title', label: 'Title', numeric: false },
    { name: 'semester', label: 'Semester', numeric: true },
  ];

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {headCells.map(({ name, label, numeric }) => (
              <TableCell key={name} align={numeric ? 'center' : 'left'}>
                <TableSortLabel
                  active={sortingCriterion === name}
                  direction={sortingCriterion === name ? sortingDirection : 'asc'}
                  onClick={() => handleSortRequest(name)}
                >
                  {label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.map((course) => (
            <TableRow
              key={course.id}
              hover={true}
              sx={{ cursor: 'pointer' }}
              onClick={() => selectCourse(course)}
              selected={course.id === selectedCourse?.id}
            >
              <TableCell>{course.code}</TableCell>
              <TableCell>{course.title}</TableCell>
              <TableCell align="center">{course.semester}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const CourseEmpty = ({ handleCreate }) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    }}>
      <Icon component={SchoolIcon} sx={{ fontSize: '160px', color: 'primary.main' }}></Icon>
      <Typography variant="h6">You don&apos;t have any courses.</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>Would you like to create one now?</Typography>
      <Button variant="outlined" sx={{ mt: 2 }} onClick={handleCreate}>New</Button>
    </Box>
  );
};

const CourseFilterEmpty = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    }}>
      <Icon component={SearchOffIcon} sx={{ fontSize: '160px', color: 'primary.main' }}></Icon>
      <Typography variant="h6">No courses match these criteria.</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>Try searching for something else instead.</Typography>
    </Box>
  );
};

const CourseOverview = ({ selectedAction, setSelectedAction, selectedCourse, setSelectedCourse }) => {
  const [searchValue, setSearchValue] = useState(null);
  const [searchingCriterion, setSearchingCriterion] = useState(null);
  const [sortingCriterion, setSortingCriterion] = useState(null);
  const [sortingDirection, setSortingDirection] = useState('asc');

  const params = {
    order: sortingDirection,
    orderBy: sortingCriterion,
    search: searchingCriterion,
  };

  const { status, data } = useQuery({
    queryKey: ['courses', params],
    queryFn: () => findAllCourses(params),
    keepPreviousData : true,
  });

  const openCreatePane = () => {
    setSelectedAction('create');
    setSelectedCourse(null);
  };

  const openUpdatePane = (course) => {
    setSelectedAction('update');
    setSelectedCourse(course);
  };

  if (status === 'loading') {
    return null;
  }

  if (status === 'error') {
    return <Typography>Oops! An error occurred.</Typography>;
  }

  return (
    <Main
      detailsOpen={!!selectedAction}
      sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 3 }}
    >
      {(data.length === 0 && !searchingCriterion) ? (
        <CourseEmpty handleCreate={openCreatePane}/>
      ) : <>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <Tooltip title="Create Course">
            <Button variant="contained" onClick={openCreatePane}>New</Button>
          </Tooltip>
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', flex: 1, alignItems: 'center' }}
          >
            <IconButton sx={{ p: '10px' }} onClick={() => setSearchingCriterion(searchValue)}>
              <SearchIcon/>
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              onChange={(event) => setSearchValue(event.target.value)}
              onBlur={() => setSearchingCriterion(searchValue)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  setSearchingCriterion(searchValue);
                }
              }}
            />
          </Paper>
        </Box>

        {(data.length === 0 && !!searchingCriterion) ? (
          <CourseFilterEmpty/>
        ) : (
          <CourseTable
            data={data}
            selectCourse={openUpdatePane}
            selectedCourse={selectedCourse}
            sortingCriterion={sortingCriterion}
            setSortingCriterion={setSortingCriterion}
            sortingDirection={sortingDirection}
            setSortingDirection={setSortingDirection}
          />
        )}
      </>}
    </Main>
  );
};

export default CourseOverview;
