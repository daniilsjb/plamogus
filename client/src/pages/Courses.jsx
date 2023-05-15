import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Formik } from 'formik';
import CourseSchema from '../schemas/course';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableSortLabel,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createCourse, deleteCourse, findAllCourses, updateCourse } from '../services/course';
import Typography from '@mui/material/Typography';

const FormField = ({ formik, name, label, type, ...props }) => {
  const { getFieldProps, touched, errors } = formik;
  return <TextField
    label={label}
    name={name}
    type={type}
    {...getFieldProps(name)}
    error={!!touched[name] && !!errors[name]}
    helperText={touched[name] && errors[name]}
    InputLabelProps={{ shrink: true }}
    variant="filled"
    {...props}
  />;
};

const CourseCreation = ({ close }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const initialValues = {
    code: '',
    title: '',
    semester: '',
    description: '',
  };

  const onSubmit = (values) => {
    mutation.mutate(values);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={CourseSchema}>
      {(formik) => (
        <Box component="form" sx={{ height: '100%' }} onReset={formik.handleReset} onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 3 }}>
            {/* COURSE FORM */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1, overflow: 'scroll' }}>
              <FormField formik={formik} name="code" label="Code" type="text"/>
              <FormField
                formik={formik} name="title" label="Title" type="text" multiline
                onChange={event => {
                  const { value } = event.target;
                  const newValue = value.replace(/\n/g, '');
                  formik.setFieldValue('title', newValue);
                }}
              />
              <FormField
                formik={formik} name="semester" label="Semester" type="text"
                onChange={event => {
                  const { value } = event.target;
                  const newValue = value.replace(/\D/g, '');
                  formik.setFieldValue('semester', newValue);
                }}
              />
              <FormField formik={formik} name="description" label="Description" type="text" multiline rows={8}/>
            </Box>

            {/* ACTIONS */}
            <Divider/>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Tooltip title="Hide Sidebar">
                <IconButton onClick={close}>
                  <KeyboardDoubleArrowRightIcon/>
                </IconButton>
              </Tooltip>
              <Box>
                <Button variant="contained" type="submit" disabled={!(formik.dirty && formik.isValid)}>Save</Button>
                <Button variant="outlined" sx={{ ml: 1 }}>Cancel</Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Formik>
  );
};

const DeletionDialog = ({ open, setOpen, course, closeDetails }) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const onCancel = () => {
    setOpen(false);
  };

  const onConfirm = () => {
    setOpen(false);
    closeDetails();
    mutation.mutate(course.id);
  };

  return (
    <Dialog maxWidth="xs" open={open}>
      <DialogTitle>Delete this course?</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          All assignments that are part of this course will be deleted as well. This action cannot be undone.
        </DialogContentText>
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm}>Delete</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

const CourseEdit = ({ close, course }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const onDelete = () => {
    setDialogOpen(true);
  };

  const initialValues = {
    code: course.code || '',
    title: course.title || '',
    semester: course.semester || '',
    description: course.description || '',
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const onSubmit = (values) => {
    mutation.mutate({ id: course.id, ...values });
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={CourseSchema} enableReinitialize>
      {(formik) => (
        <Box component="form" sx={{ height: '100%' }} onReset={formik.handleReset} onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 3 }}>
            {/* COURSE FORM */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, overflow: 'scroll', flexGrow: 1 }}>
              <FormField
                formik={formik} name="code" label="Code" type="text"
                onBlur={event => {
                  formik.handleBlur(event);
                  formik.submitForm();
                }}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    formik.submitForm();
                  }
                }}
              />
              <FormField
                formik={formik} name="title" label="Title" type="text" multiline
                onChange={event => {
                  const { value } = event.target;
                  const newValue = value.replace(/\n/g, '');
                  formik.setFieldValue('title', newValue);
                }}
                onBlur={event => {
                  formik.handleBlur(event);
                  formik.submitForm();
                }}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    formik.submitForm();
                  }
                }}
              />
              <FormField
                formik={formik} name="semester" label="Semester" type="text"
                onChange={event => {
                  const { value } = event.target;
                  const newValue = value.replace(/\D/g, '');
                  formik.setFieldValue('semester', newValue);
                }}
                onBlur={event => {
                  formik.handleBlur(event);
                  formik.submitForm();
                }}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    formik.submitForm();
                  }
                }}
              />
              <FormField
                formik={formik} name="description" label="Description" type="text" multiline rows={8}
                onBlur={event => {
                  formik.handleBlur(event);
                  formik.submitForm();
                }}
              />
            </Box>

            {/* ACTIONS */}
            <Divider/>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Tooltip title="Hide Sidebar">
                <IconButton onClick={close}>
                  <KeyboardDoubleArrowRightIcon/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={onDelete}>
                  <DeleteOutlineOutlinedIcon/>
                </IconButton>
              </Tooltip>
              <DeletionDialog
                keepMounted open={dialogOpen} setOpen={setDialogOpen} course={course}
                closeDetails={close}
              />
            </Box>
          </Box>
        </Box>
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

const Courses = () => {
  const { status, data } = useQuery({
    queryKey: ['courses'], queryFn: findAllCourses
  });

  const theme = useTheme();
  const [detailsMode, setDetailsMode] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const isSidebarTemporary = useMediaQuery(theme.breakpoints.down('md'));

  const [sortingCriterion, setSortingCriterion] = useState('');
  const [sortingDirection, setSortingDirection] = useState('asc');

  const handleSortRequest = (id) => {
    const asc = id === sortingCriterion && sortingDirection === 'asc';
    const direction = asc ? 'desc' : 'asc';
    setSortingDirection(direction);
    setSortingCriterion(id);
  };

  const openCreationPane = () => {
    setDetailsMode('create');
    setSelectedCourse(null);
  };

  const openEditPane = (course) => {
    setDetailsMode('edit');
    setSelectedCourse(course);
  };

  const closeDetails = () => {
    setDetailsMode(null);
    setSelectedCourse(null);
  };

  // TODO: Handle this properly.
  if (status === 'loading') {
    return <Typography>Data is being loaded...</Typography>;
  }

  // TODO: Handle this properly.
  if (status === 'error') {
    return <Typography>Oops! An error occurred.</Typography>;
  }

  return <>
    <Main detailsOpen={!!detailsMode} sx={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 3 }}>
      {/* ACTIONS AND SEARCH BAR */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Button variant="contained" onClick={() => openCreationPane()}>New</Button>
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
      </Box>

      {/* COURSE TABLE */}
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortingCriterion === 'code'}
                  direction={sortingCriterion === 'code' ? sortingDirection : 'asc'}
                  onClick={() => handleSortRequest('code')}
                >
                  Code
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortingCriterion === 'title'}
                  direction={sortingCriterion === 'title' ? sortingDirection : 'asc'}
                  onClick={() => handleSortRequest('title')}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={sortingCriterion === 'semester'}
                  direction={sortingCriterion === 'semester' ? sortingDirection : 'asc'}
                  onClick={() => handleSortRequest('semester')}
                >
                  Semester
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((course) => (
              <TableRow
                key={course.id} hover={true} sx={{ cursor: 'pointer' }} onClick={() => openEditPane(course)}
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
    </Main>

    {/* DETAILS PANE */}
    <Drawer
      anchor="right"
      variant={isSidebarTemporary ? 'temporary' : 'persistent'}
      PaperProps={{ sx: { width: theme.width.detailsDrawer, boxSizing: 'border-box', p: 3 } }}
      open={!!detailsMode}
      onClose={closeDetails}
    >
      <Toolbar/>
      {detailsMode === 'create' && <CourseCreation close={closeDetails}/>}
      {detailsMode === 'edit' && <CourseEdit close={closeDetails} course={selectedCourse}/>}
    </Drawer>
  </>;
};

export default Courses;
