import { useState } from "react";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { Form, Formik } from "formik";
import FormikTextField from "../../components/forms/FormikTextField";
import FormikLiveTextField from "../../components/forms/FormikLiveTextField";

import { useCourseDeletion, useCourseUpdate } from "../../mutations/course";
import { removeNewlines, removeNonDigits } from "../../common/string";
import courseSchema from "../../schemas/course";

const DeletionDialog = ({ open, setOpen, course, closeDetails }) => {
  const deletion = useCourseDeletion();

  const closeSelf = () => {
    setOpen(false);
  };

  const onCancel = () => {
    closeSelf();
  };

  const onDelete = () => {
    closeSelf();
    closeDetails();
    deletion.mutate(course.id);
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
  const update = useCourseUpdate();

  const [deletionDialogOpen, setDeletionDialogOpen] = useState(false);

  const initialValues = {
    code: course.code || "",
    title: course.title || "",
    semester: course.semester || "",
    description: course.description || "",
  };

  const handleSubmit = async (values, formik) => {
    try {
      const request = courseSchema.cast(values);
      await update.mutateAsync({ id: course.id, ...request });
    } catch (error) {
      if (error.response?.status === 409) {
        formik.setFieldError("code", "A course with this code already exists.");
      }
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={courseSchema} enableReinitialize>
      {(formik) => (
        <Form style={{ height: "100%" }}>
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, overflow: "auto", flexGrow: 1 }}>
              <FormikLiveTextField
                variant="filled"
                component={FormikTextField}
                name="code"
                label="Code"
                type="text"
              />

              <FormikLiveTextField
                variant="filled"
                component={FormikTextField}
                name="title"
                label="Title"
                type="text"
                multiline
                onChange={e => formik.setFieldValue("title", removeNewlines(e.target.value))}
              />

              <FormikLiveTextField
                variant="filled"
                component={FormikTextField}
                name="semester"
                label="Semester"
                type="text"
                onChange={e => formik.setFieldValue("semester", removeNonDigits(e.target.value))}
              />

              <FormikLiveTextField
                variant="filled"
                component={FormikTextField}
                name="description"
                label="Description"
                type="text"
                multiline
                rows={8}
                submitOnEnter={false}
              />
            </Box>

            <Divider/>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
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
