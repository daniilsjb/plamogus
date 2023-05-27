import { useMutation, useQuery, useQueryClient } from 'react-query';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';

import { Field, Form, Formik } from 'formik';

import AssignmentSchema from '../../schemas/assignment';
import ASSIGNMENT_TYPES from '../../schemas/assignment-types';
import { createAssignment } from '../../api/assignment';
import { findAllCourses } from '../../api/course';
import { removeNewlines } from '../../common/string';
import FormikTextField from '../../components/forms/FormikTextField';
import FormikDatePicker from '../../components/forms/FormikDatePicker';
import FormikSelect from '../../components/forms/FormikSelect';

const AssignmentCreate = ({ close }) => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: createAssignment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });

  const { status, data } = useQuery({
    queryKey: ['courses'], queryFn: () => findAllCourses({}),
  });

  const initialValues = {
    title: '',
    type: '',
    courseId: '',
    deadlineTime: null,
    description: '',
  };

  const handleSubmit = async (values, formik) => {
    const transformed = {
      ...values,
      type: values.type !== '' ? values.type : null,
      courseId: values.courseId !== '' ? values.courseId : null,
      deadlineTime: values.deadlineTime?.toISOString(),
    };

    await mutateAsync(transformed);
    formik.resetForm();
  };

  if (status === 'loading') {
    return null;
  }

  if (status === 'error') {
    // TODO: Redirect to an error page.
    return <Typography>Oops! An error occurred.</Typography>;
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={AssignmentSchema}>
      {(formik) => (
        <Form style={{ height: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1, overflow: 'scroll' }}>
              <Field
                component={FormikTextField}
                name="title"
                label="Title"
                type="text"
                required
                multiline
                onChange={e => formik.setFieldValue('title', removeNewlines(e.target.value))}
              />

              <FormControl variant="filled">
                <InputLabel>Type</InputLabel>
                <Field name="type" component={FormikSelect}>
                  <MenuItem value=""><em>None</em></MenuItem>
                  {ASSIGNMENT_TYPES.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>{label}</MenuItem>
                  ))}
                </Field>
              </FormControl>

              <FormControl variant="filled">
                <InputLabel>Course</InputLabel>
                <Field name="courseId" component={FormikSelect}>
                  <MenuItem value=""><em>None</em></MenuItem>
                  {data.map(({ id, code }) => (
                    <MenuItem key={id} value={id}>{code}</MenuItem>
                  ))}
                </Field>
              </FormControl>

              <Field
                component={FormikDatePicker}
                name="deadlineTime"
                label="Deadline Date"
                slotProps={{
                  textField: {
                    readOnly: true,
                  },
                  actionBar: {
                    actions: ['clear'],
                  },
                }}
              />

              <Field
                component={FormikTextField}
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

export default AssignmentCreate;
