import { useQuery } from "react-query";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import { Field, Form, Formik, useFormikContext } from "formik";
import FormikTextField from "../../components/forms/FormikTextField";
import FormikDatePicker from "../../components/forms/FormikDatePicker";
import FormikSelect from "../../components/forms/FormikSelect";

import assignmentSchema from "../../schemas/assignment";
import { ASSIGNMENT_TYPES } from "../../common/constants";
import { useAssignmentCreation } from "../../mutations/assignment";
import { useAssignmentContext } from "./AssignmentContext";
import { findAllCourses } from "../../api/course";
import { useResponsiveQuery } from "../../theme";

const AssignmentCreate = () => {
  const creation = useAssignmentCreation();
  const { handleClear } = useAssignmentContext();
  const { isSidebarTemporary } = useResponsiveQuery();

  const handleSubmit = async (values, form) => {
    const request = assignmentSchema.cast(values);
    await creation.mutateAsync(request);
    onSubmissionSuccess(form);
  };

  const onSubmissionSuccess = (form) => {
    form.resetForm();
    if (isSidebarTemporary) {
      handleClear();
    }
  };

  const initialValues = {
    title: "",
    description: "",
    deadlineTime: null,
    courseId: "",
    type: "",
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={assignmentSchema}>
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
  const { data } = useQuery({
    queryKey: ["courses"],
    queryFn: () => findAllCourses({}),
    placeholderData: [],
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
      <Field
        component={FormikTextField}
        variant="filled"
        name="title"
        label="Title"
        autoComplete="off"
        required
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
            variant: "filled",
          },
          actionBar: {
            actions: ["clear"],
          },
        }}
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
  const { handleClear } = useAssignmentContext();
  const { dirty, isValid } = useFormikContext();
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
      <Button variant="outlined" onClick={handleClear} size="small">Cancel</Button>
      <Button variant="contained" type="submit" disabled={!dirty || !isValid} size="small">Save</Button>
    </Box>
  );
};

export default AssignmentCreate;
