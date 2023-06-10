import { useState } from "react";
import { useQuery } from "react-query";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { InputAdornment } from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";

import { Field, Form, Formik } from "formik";
import FormikLiveDatePicker from "../../components/forms/FormikLiveDatePicker";
import FormikLiveTextField from "../../components/forms/FormikLiveTextField";
import FormikLiveSelect from "../../components/forms/FormikLiveSelect";
import FormikTextField from "../../components/forms/FormikTextField";

import dayjs from "dayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker/DatePicker";

import { findAllCourses } from "../../api/course";
import { findAllSteps } from "../../api/step";
import { useAssignmentCompletion, useAssignmentUpdate } from "../../mutations/assignment";
import { ASSIGNMENT_TYPES } from "../../common/constants";
import assignmentSchema from "../../schemas/assignment";
import AssignmentDeletionDialog from "./AssignmentDeletionDialog";
import { useAssignmentContext } from "./AssignmentContext";
import AssignmentStep from "./AssignmentStep";
import AssignmentStepAdd from "./AssignmentStepAdd";

const AssignmentUpdate = () => {
  const update = useAssignmentUpdate();
  const { selectedAssignment } = useAssignmentContext();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async (values) => {
    const request = assignmentSchema.cast(values);
    await update.mutateAsync({ id: selectedAssignment.id, ...request });
  };

  const initialValues = {
    title: selectedAssignment.title || "",
    type: selectedAssignment.type || "",
    courseId: selectedAssignment.course?.id || "",
    deadlineTime: selectedAssignment.deadlineTime ? dayjs(selectedAssignment.deadlineTime) : null,
    description: selectedAssignment.description || "",
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={assignmentSchema}
      enableReinitialize
    >
      <Form style={{ height: "100%" }}>
        <AssignmentDeletionDialog open={dialogOpen} onClose={() => setDialogOpen(false)} keepMounted/>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
            <Header/>
            <Steps/>
            <Divider/>
            <Fields/>
          </Box>
          <Divider/>
          <Footer onDelete={() => setDialogOpen(true)}/>
        </Box>
      </Form>
    </Formik>
  );
};

const Header = () => {
  const { selectedAssignment } = useAssignmentContext();
  const startAdornment = (
    <InputAdornment position="start">
      <CompletionIcon edge="start" assignment={selectedAssignment}/>
    </InputAdornment>
  );

  return (
    <FormikLiveTextField
      component={FormikTextField}
      variant="filled"
      name="title"
      label="Title"
      autoComplete="off"
      InputProps={{ startAdornment }}
    />
  );
};

const Steps = () => {
  const { selectedAssignment } = useAssignmentContext();
  return <>
    <AssignmentSteps assignment={selectedAssignment}/>
    <AssignmentStepAdd assignment={selectedAssignment}/>
  </>;
};

const Fields = () => {
  const { selectedAssignment } = useAssignmentContext();
  const { data } = useQuery({
    queryKey: ["courses"],
    queryFn: () => findAllCourses({}),
    placeholderData: [],
  });

  return <>
    <FormControl variant="filled">
      <InputLabel>Type</InputLabel>
      <Field name="type" component={FormikLiveSelect}>
        <MenuItem value=""><em>None</em></MenuItem>
        {ASSIGNMENT_TYPES.map(({ value, label }) => (
          <MenuItem key={value} value={value}>{label}</MenuItem>
        ))}
      </Field>
    </FormControl>

    <FormControl variant="filled">
      <InputLabel>Course</InputLabel>
      <Field name="courseId" component={FormikLiveSelect}>
        <MenuItem value=""><em>None</em></MenuItem>
        {data.map(({ id, code }) => (
          <MenuItem key={id} value={id}>{code}</MenuItem>
        ))}
      </Field>
    </FormControl>

    <MuiDatePicker
      label="Creation Date"
      value={dayjs(selectedAssignment.creationTime)}
      slotProps={{ textField: { variant: "filled" } }}
      disabled
    />

    <Field
      component={FormikLiveDatePicker}
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

    <FormikLiveTextField
      variant="filled"
      component={FormikTextField}
      name="description"
      label="Description"
      multiline
      rows={8}
      submitOnEnter={false}
    />
  </>;
};

const Footer = ({ onDelete }) => {
  const { handleClear } = useAssignmentContext();
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

const AssignmentSteps = ({ assignment }) => {
  const { data } = useQuery({
    queryKey: ["steps", assignment.id],
    queryFn: () => findAllSteps(assignment.id),
    placeholderData: [],
  });

  return data.map((step, index) => (
    <AssignmentStep key={step.id} assignment={assignment} step={step} index={index}/>
  ));
};

const CompletionIcon = ({ assignment, ...rest }) => {
  const complete = useAssignmentCompletion();

  const handleCompletion = async () => {
    await complete.mutateAsync(assignment);
    assignment.completed = !assignment.completed;
  };

  return (
    <IconButton onClick={handleCompletion} sx={{ color: "primary.main" }} {...rest}>
      {assignment.completed ? <CheckCircleIcon/> : <RadioButtonUncheckedOutlinedIcon/>}
    </IconButton>
  );
};

export default AssignmentUpdate;
