import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

import { Field, Form, Formik, useFormikContext } from "formik";
import { HttpStatusCode } from "axios";

import courseSchema from "../../schemas/course";
import { useCourseCreation } from "../../mutations/course";
import { useCourseContext } from "./CourseContext";

import { useResponsiveQuery } from "../../theme";
import { removeNewlines, removeNonDigits } from "../../common/string";
import FormikTextField from "../../components/forms/FormikTextField";

const CourseCreate = () => {
  const creation = useCourseCreation();
  const { handleClear } = useCourseContext();
  const { isSidebarTemporary } = useResponsiveQuery();

  const handleSubmit = async (values, form) => {
    const request = courseSchema.cast(values);
    try {
      await creation.mutateAsync(request);
      onSubmissionSuccess(form);
    } catch (error) {
      onSubmissionFailure(form, error);
    }
  };

  const onSubmissionSuccess = (form) => {
    form.resetForm();
    if (isSidebarTemporary) {
      handleClear();
    }
  };

  const onSubmissionFailure = (formik, error) => {
    // The web API could be improved by returning a more descriptive response containing
    // information about which field exactly is causing the issue, but within the current
    // scope it can be simply assumed that any conflict is caused by codes.
    if (error.response?.status === HttpStatusCode.Conflict) {
      formik.setFieldError("code", "A course with this code already exists.");
    }
  };

  const initialValues = {
    code: "",
    title: "",
    semester: "",
    description: "",
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={courseSchema}>
      <Form style={{ height: "100%" }}>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Fields/>
          <Divider/>
          <Footer/>
        </Box>
      </Form>
    </Formik>
  );
};

const Fields = () => {
  const { setFieldValue } = useFormikContext();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
      <Field
        component={FormikTextField}
        variant="filled"
        name="code"
        label="Code"
        placeholder="CS101"
        autoComplete="off"
        required
      />

      <Field
        component={FormikTextField}
        variant="filled"
        name="title"
        label="Title"
        placeholder="Introduction to Computer Science"
        required
        multiline
        onChange={e => setFieldValue("title", removeNewlines(e.target.value))}
      />

      <Field
        component={FormikTextField}
        variant="filled"
        name="semester"
        label="Semester"
        placeholder="1"
        autoComplete="off"
        onChange={e => setFieldValue("semester", removeNonDigits(e.target.value))}
      />

      <Field
        component={FormikTextField}
        variant="filled"
        name="description"
        label="Description"
        multiline
        rows={8}
      />
    </Box>
  );
};

const Footer = () => {
  const { handleClear } = useCourseContext();
  const { dirty, isValid } = useFormikContext();
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
      <Button variant="outlined" onClick={handleClear} size="small">Cancel</Button>
      <Button variant="contained" type="submit" disabled={!dirty || !isValid} size="small">Save</Button>
    </Box>
  );
};

export default CourseCreate;
