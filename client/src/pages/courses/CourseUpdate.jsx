import { useMutation, useQueryClient } from 'react-query';
import { deleteCourse, updateCourse } from '../../api/course';
import { useState } from 'react';
import { Form, Formik } from 'formik';
import CourseSchema from '../../schemas/course';
import Box from '@mui/material/Box';
import { LiveField, TextField } from '../../components/form-bindings';
import { removeNewlines, removeNonDigits, removeWhitespace } from '../../common/string';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

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
      formik.setFieldError('code', 'A course with this code already exists.');
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

export default CourseUpdate;
