import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

import { Field, Form, Formik } from "formik";
import FormikTextField from "../../components/forms/FormikTextField";

import { useCourseCreation } from "../../mutations/course";
import { removeNewlines, removeNonDigits } from "../../common/string";
import courseSchema from "../../schemas/course";

const CourseCreate = ({ close }) => {
  const creation = useCourseCreation();
  const initialValues = {
    code: "", title: "", semester: "", description: "",
  };

  const handleSubmit = async (values, formik) => {
    const request = courseSchema.cast(values);
    try {
      await creation.mutateAsync(request);
      formik.resetForm();
    } catch (error) {
      if (error.response?.status === 409) {
        formik.setFieldError("code", "A course with this code already exists.");
      }
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={courseSchema}>
      {(formik) => (
        <Form style={{ height: "100%" }}>
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flexGrow: 1, overflow: "auto" }}>
              <Field
                variant="filled"
                component={FormikTextField}
                name="code"
                label="Code"
                type="text"
                placeholder="e.g., CS101"
                required
              />

              <Field
                variant="filled"
                component={FormikTextField}
                name="title"
                label="Title"
                type="text"
                placeholder="e.g., Introduction to Computer Science"
                required
                multiline
                onChange={e => formik.setFieldValue("title", removeNewlines(e.target.value))}
              />

              <Field
                variant="filled"
                component={FormikTextField}
                name="semester"
                label="Semester"
                type="text"
                placeholder="e.g., 1"
                onChange={e => formik.setFieldValue("semester", removeNonDigits(e.target.value))}
              />

              <Field
                component={FormikTextField}
                variant="filled"
                name="description"
                label="Description"
                type="text"
                multiline
                rows={8}
                sx={{ flexGrow: 1 }}
              />
            </Box>

            <Divider/>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
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