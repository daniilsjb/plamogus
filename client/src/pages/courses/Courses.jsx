import { useState } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Field, Form, Formik } from 'formik';
import InputBase from '@mui/material/InputBase';
import { LiveField, TextField } from '../../components/form-bindings';

import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import SchoolIcon from '@mui/icons-material/School';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createCourse, deleteCourse, findAllCourses, updateCourse } from '../../services/course';
import CourseSchema from '../../schemas/course';
import { Icon } from '@mui/material';

import { removeNewlines, removeNonDigits, removeWhitespace } from '../../common/string';

const CourseCreate = ({ close }) => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: createCourse,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const initialValues = {
    code: '',
    title: '',
    semester: '',
    description: '',
  };

  const onSubmit = async (values, formik) => {
    try {
      await mutateAsync(values);
    } catch (error) {
      // TODO: The error handling has to be more specific here.
      if (error?.response.status === 500) {
        formik.setFieldError('code', 'A course with this code already exists.');
      }
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={CourseSchema}>
      {(formik) => (
        <Form style={{ height: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1, overflow: 'scroll' }}>
              <Field
                component={TextField}
                name="code"
                label="Code"
                type="text"
                placeholder="e.g., CS101"
                required
                onChange={e => formik.setFieldValue('code', removeWhitespace(e.target.value))}
              />

              <Field
                component={TextField}
                name="title"
                label="Title"
                type="text"
                placeholder="e.g., Introduction to Computer Science"
                required
                multiline
                onChange={e => formik.setFieldValue('title', removeNewlines(e.target.value))}
              />

              <Field
                component={TextField}
                name="semester"
                label="Semester"
                type="text"
                onChange={e => formik.setFieldValue('semester', removeNonDigits(e.target.value))}
              />

              <Field
                component={TextField}
                name="description"
                label="Description"
                type="text"
                multiline
                rows={8}
              />
            </Box>

            <Divider/>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button variant="contained" type="submit" disabled={!(formik.dirty && formik.isValid)}>Save</Button>
              <Button variant="outlined" sx={{ ml: 1 }} onClick={close} color="error">Cancel</Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

const DeletionDialog = ({ open, setOpen, course, closeDetails }) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: ['courses'] }),
      queryClient.invalidateQueries({ queryKey: ['assignments'] }),
    ]),
  });

  const closeSelf = () => {
    setOpen(false);
  };

  const onCancel = () => {
    closeSelf();
  };

  const onDelete = () => {
    closeSelf();
    closeDetails();
    mutate(course.id);
  };

  return (
    <Dialog maxWidth="xs" open={open} onClose={closeSelf}>
      <DialogTitle>Delete this course?</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          All assignments that are part of this course will be deleted as well. This action cannot be undone.
        </DialogContentText>
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={onDelete} variant="outlined" color="error">Delete</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

const CourseUpdate = ({ close, course }) => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: updateCourse,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const [deletionDialogOpen, setDeletionDialogOpen] = useState(false);

  const initialValues = {
    code: course.code || '',
    title: course.title || '',
    semester: course.semester || '',
    description: course.description || '',
  };

  const onSubmit = async (values, formik) => {
    try {
      await mutateAsync({ id: course.id, ...values });
    } catch (error) {
      // TODO: The error handling has to be more specific here.
      if (error?.response.status === 500) {
        formik.setFieldError('code', 'A course with this code already exists.');
      }
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={CourseSchema} enableReinitialize>
      {(formik) => (
        <Form style={{ height: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, overflow: 'scroll', flexGrow: 1 }}>
              <LiveField
                component={TextField}
                name="code"
                label="Code"
                type="text"
                onChange={e => formik.setFieldValue('code', removeWhitespace(e.target.value))}
              />

              <LiveField
                component={TextField}
                name="title"
                label="Title"
                type="text"
                multiline
                onChange={e => formik.setFieldValue('title', removeNewlines(e.target.value))}
              />

              <LiveField
                component={TextField}
                name="semester"
                label="Semester"
                type="text"
                onChange={e => formik.setFieldValue('semester', removeNonDigits(e.target.value))}
              />

              <LiveField
                component={TextField}
                name="description"
                label="Description"
                type="text"
                multiline
                rows={8}
                submitOnEnter={false}
              />
            </Box>

            <Divider/>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Tooltip title="Hide Sidebar">
                <IconButton onClick={close}>
                  <KeyboardDoubleArrowRightIcon/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={() => setDeletionDialogOpen(true)}>
                  <DeleteOutlineOutlinedIcon/>
                </IconButton>
              </Tooltip>
              <DeletionDialog
                open={deletionDialogOpen}
                setOpen={setDeletionDialogOpen}
                closeDetails={close}
                course={course}
                keepMounted
              />
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

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
