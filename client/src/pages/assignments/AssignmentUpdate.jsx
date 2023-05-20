import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';

import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import { Field, Form, Formik } from 'formik';
import { LiveDatePicker, LiveField, LiveSelect, TextField } from '../../components/form-bindings';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker/DatePicker';

import dayjs from 'dayjs';

import AssignmentSchema from '../../schemas/assignment';
import ASSIGNMENT_TYPES from '../../schemas/assignment-types';
import { deleteAssignment, updateAssignment } from '../../services/assignment';
import { findAllCourses } from '../../services/course';
import { removeNewlines } from '../../common/string';

const DeletionDialog = ({ open, setOpen, assignment, closeDetails }) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteAssignment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
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
    mutate(assignment.id);
  };

  return (
    <Dialog maxWidth="xs" open={open} onClose={closeSelf}>
      <DialogTitle>Delete this assignment?</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          All steps that are part of this assignment will be deleted as well. This action cannot be undone.
        </DialogContentText>
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={onDelete} variant="outlined" color="error">Delete</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

const AssignmentUpdate = ({ close, assignment }) => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: updateAssignment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });

  const { status, data } = useQuery({
    queryKey: ['courses'], queryFn: findAllCourses,
  });

  const [deletionDialogOpen, setDeletionDialogOpen] = useState(false);

  const initialValues = {
    title: assignment.title || '',
    type: assignment.type || '',
    courseId: assignment.course?.id || '',
    deadlineTime: assignment.deadlineTime ? dayjs(assignment.deadlineTime) : null,
    description: assignment.description || '',
  };

  const onSubmit = async (values) => {
    const transformed = {
      ...values,
      type: values.type !== '' ? values.type : null,
      courseId: values.courseId !== '' ? values.courseId : null,
      deadlineTime: values.deadlineTime?.toISOString(),
    };

    await mutateAsync({ id: assignment.id, ...transformed });
  };

  if (status === 'loading') {
    return null;
  }

  if (status === 'error') {
    // TODO: Redirect to an error page.
    return <Typography>Oops! An error occurred.</Typography>;
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={AssignmentSchema} enableReinitialize>
      {(formik) => (
        <Form style={{ height: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, overflow: 'scroll', flexGrow: 1 }}>
              <LiveField
                component={TextField}
                name="title"
                label="Title"
                type="text"
                multiline
                onChange={e => formik.setFieldValue('title', removeNewlines(e.target.value))}
              />

              <FormControl variant="filled">
                <InputLabel>Type</InputLabel>
                <Field
                  name="type" component={LiveSelect}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {ASSIGNMENT_TYPES.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>{label}</MenuItem>
                  ))}
                </Field>
              </FormControl>

              <FormControl variant="filled">
                <InputLabel>Course</InputLabel>
                <Field name="courseId" component={LiveSelect}>
                  <MenuItem value=""><em>None</em></MenuItem>
                  {data.map(({ id, code }) => (
                    <MenuItem key={id} value={id}>{code}</MenuItem>
                  ))}
                </Field>
              </FormControl>

              <MuiDatePicker
                label="Creation Date"
                disabled
                value={dayjs(assignment.creationTime)}
              />

              <Field
                component={LiveDatePicker}
                name="deadlineTime"
                label="Deadline Date"
                slotProps={{
                  textField: {
                    readOnly: true,
                  },
                }}
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
                assignment={assignment}
                keepMounted
              />
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AssignmentUpdate;
