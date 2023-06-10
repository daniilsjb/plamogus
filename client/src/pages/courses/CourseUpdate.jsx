import { useState } from "react";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { Form, Formik, useFormikContext } from "formik";
import FormikTextField from "../../components/forms/FormikTextField";
import FormikLiveTextField from "../../components/forms/FormikLiveTextField";

import { HttpStatusCode } from "axios";

import courseSchema from "../../schemas/course";
import { useCourseUpdate } from "../../mutations/course";
import { removeNewlines, removeNonDigits } from "../../common/string";
import { useCourseContext } from "./CourseContext";
import CourseDeletionDialog from "./CourseDeletionDialog";

const CourseUpdate = () => {
  const update = useCourseUpdate();
  const { selectedCourse } = useCourseContext();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async (values, form) => {
    const request = courseSchema.cast(values);
    try {
      await update.mutateAsync({ id: selectedCourse.id, ...request });
    } catch (error) {
      onSubmissionFailure(form, error);
    }
  };

  const onSubmissionFailure = (form, error) => {
    // The web API could be improved by returning a more descriptive response containing
    // information about which field exactly is causing the issue, but within the current
    // scope it can be simply assumed that any conflict is caused by codes.
    if (error.response?.status === HttpStatusCode.Conflict) {
      form.setFieldError("code", "A course with this code already exists.");
    }
  };

  const initialValues = {
    code: selectedCourse.code || "",
    title: selectedCourse.title || "",
    semester: selectedCourse.semester || "",
    description: selectedCourse.description || "",
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={courseSchema} enableReinitialize>
      <Form style={{ height: "100%" }}>
        <CourseDeletionDialog open={dialogOpen} onClose={() => setDialogOpen(false)} keepMounted/>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Fields/>
          <Divider/>
          <Footer onDelete={() => setDialogOpen(true)}/>
        </Box>
      </Form>
    </Formik>
  );
};

const Fields = () => {
  const { setFieldValue } = useFormikContext();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
      <FormikLiveTextField
        component={FormikTextField}
        variant="filled"
        name="code"
        label="Code"
        autoComplete="off"
      />

      <FormikLiveTextField
        component={FormikTextField}
        variant="filled"
        name="title"
        label="Title"
        multiline
        onChange={e => setFieldValue("title", removeNewlines(e.target.value))}
      />

      <FormikLiveTextField
        component={FormikTextField}
        variant="filled"
        name="semester"
        label="Semester"
        autoComplete="off"
        onChange={e => setFieldValue("semester", removeNonDigits(e.target.value))}
      />

      <FormikLiveTextField
        component={FormikTextField}
        variant="filled"
        name="description"
        label="Description"
        multiline
        rows={8}
        submitOnEnter={false}
      />
    </Box>
  );
};

const Footer = ({ onDelete }) => {
  const { handleClear } = useCourseContext();
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
      <Tooltip title="Hide Sidebar">
        <IconButton onClick={handleClear} size="small">
          <KeyboardDoubleArrowRightIcon/>
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton onClick={onDelete} size="small">
          <DeleteOutlineOutlinedIcon/>
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default CourseUpdate;
