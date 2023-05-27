import { useMutation, useQueryClient } from 'react-query';
import { createCourse } from '../../api/course';
import { Field, Form, Formik } from 'formik';
import CourseSchema from '../../schemas/course';
import Box from '@mui/material/Box';
import { removeNewlines, removeNonDigits, removeWhitespace } from '../../common/string';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import FormikTextField from '../../components/forms/FormikTextField';

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

  const handleSubmit = async (values, formik) => {
    try {
      await mutateAsync(values);
      formik.resetForm();
    } catch (error) {
      formik.setFieldError('code', 'A course with this code already exists.');
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={CourseSchema}>
      {(formik) => (
        <Form style={{ height: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1, overflow: 'scroll' }}>
              <Field
                component={FormikTextField}
                name="code"
                label="Code"
                type="text"
                placeholder="e.g., CS101"
                required
                onChange={e => formik.setFieldValue('code', removeWhitespace(e.target.value))}
              />

              <Field
                component={FormikTextField}
                name="title"
                label="Title"
                type="text"
                placeholder="e.g., Introduction to Computer Science"
                required
                multiline
                onChange={e => formik.setFieldValue('title', removeNewlines(e.target.value))}
              />

              <Field
                component={FormikTextField}
                name="semester"
                label="Semester"
                type="text"
                onChange={e => formik.setFieldValue('semester', removeNonDigits(e.target.value))}
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

export default CourseCreate;