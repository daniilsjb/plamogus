import { useQuery } from "react-query";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import { Field, Form, Formik } from "formik";
import FormikTextField from "../../components/forms/FormikTextField";
import FormikDatePicker from "../../components/forms/FormikDatePicker";
import FormikSelect from "../../components/forms/FormikSelect";

import { findAllCourses } from "../../api/course";
import { useAssignmentCreation } from "../../mutations/assignment";
import { ASSIGNMENT_TYPES } from "../../common/constants";
import assignmentSchema from "../../schemas/assignment";

const AssignmentCreate = ({ close }) => {
  const { data } = useQuery({
    queryKey: ["courses"],
    queryFn: () => findAllCourses({}),
    placeholderData: [],
  });

  const create = useAssignmentCreation();

  const initialValues = {
    title: "",
    description: "",
    deadlineTime: null,
    courseId: "",
    type: "",
  };

  const handleSubmit = async (values, formik) => {
    const request = {
      ...values,
      type: values.type || null,
      courseId: values.courseId || null,
      deadlineTime: values.deadlineTime?.toISOString(),
    };

    await create.mutateAsync(request);
    formik.resetForm();
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={assignmentSchema}>
      {(formik) => (
        <Form style={{ height: "100%" }}>
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%", gap: 1 }}>
            <Field
              variant="filled"
              component={FormikTextField}
              name="title"
              label="Title"
              type="text"
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
              type="text"
              multiline
              rows={8}
              sx={{ flexGrow: 1 }}
            />

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

export default AssignmentCreate;
