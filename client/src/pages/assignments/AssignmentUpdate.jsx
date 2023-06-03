import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "react-query";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import { FilledInput, InputAdornment } from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
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
import { removeNewlines } from "../../common/string";
import { findAllSteps } from "../../api/step";
import { useAssignmentCompletion, useAssignmentDeletion, useAssignmentUpdate } from "../../mutations/assignment";
import { useStepCompletion, useStepCreation, useStepDeletion, useStepUpdate } from "../../mutations/step";
import { ASSIGNMENT_TYPES } from "../../common/constants";
import assignmentSchema from "../../schemas/assignment";
import stepSchema from "../../schemas/step";

const AssignmentUpdate = ({ close, assignment }) => {
  const update = useAssignmentUpdate();

  const { status, data } = useQuery({
    queryKey: ["courses"],
    queryFn: () => findAllCourses({}),
  });

  const [deletionDialogOpen, setDeletionDialogOpen] = useState(false);

  const initialValues = {
    title: assignment.title || "",
    type: assignment.type || "",
    courseId: assignment.course?.id || "",
    deadlineTime: assignment.deadlineTime ? dayjs(assignment.deadlineTime) : null,
    description: assignment.description || "",
  };

  const handleSubmit = async (values) => {
    const request = assignmentSchema.cast(values);
    await update.mutateAsync({ id: assignment.id, ...request });
  };

  if (status === "loading") {
    return null;
  } else if (status === "error") {
    return <Navigate to="/error"/>;
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={assignmentSchema}
      enableReinitialize
    >
      <Form style={{ height: "100%" }}>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flexGrow: 1 }}>
            <FormikLiveTextField
              variant="filled"
              component={FormikTextField}
              name="title"
              label="Title"
              type="text"
              autoComplete="off"
              InputProps={{
                startAdornment:
                  <InputAdornment position="start">
                    <CompletionIcon edge="start" assignment={assignment}/>
                  </InputAdornment>,
              }}
            />

            <AssignmentSteps assignment={assignment}/>
            <StepForm assignment={assignment}/>
            <Divider sx={{ my: 1 }}/>

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
              disabled
              value={dayjs(assignment.creationTime)}
              slotProps={{
                textField: {
                  variant: "filled",
                },
              }}
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
              assignment={assignment}
              keepMounted
            />
          </Box>
        </Box>
      </Form>
    </Formik>
  );
};

const AssignmentSteps = ({ assignment }) => {
  const { status, data } = useQuery({
    queryKey: ["steps", assignment.id],
    queryFn: () => findAllSteps(assignment.id),
  });

  if (status === "loading") {
    return null;
  } else if (status === "error") {
    return <Navigate to="/error"/>;
  }

  return data.map((step, idx) => (
    <AssignmentStep key={step.id} assignment={assignment} step={step} idx={idx}/>
  ));
};

const AssignmentStep = ({ assignment, step, idx }) => {
  const stepDeletion = useStepDeletion(assignment.id);
  const stepCompletion = useStepCompletion(assignment.id);
  const stepUpdate = useStepUpdate(assignment.id);

  const handleComplete = async () => {
    await stepCompletion.mutateAsync(step);
  };

  const handleDelete = async () => {
    await stepDeletion.mutateAsync(step.id);
  };

  const [value, setValue] = useState(step.title);
  const onSubmit = async () => {
    stepSchema.validate({ title: value })
      .then(request => stepUpdate.mutate({ id: step.id, request }))
      .catch(() => stepDeletion.mutate(step.id));
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      await onSubmit();
    }
  };

  const handleChange = (event) => {
    setValue(removeNewlines(event.target.value));
  };

  return (
    <FormControl variant="filled">
      <InputLabel>{`Step ${idx + 1}`}</InputLabel>
      <FilledInput
        label={`Step ${idx + 1}`}
        type="text"
        value={value}
        onBlur={onSubmit}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        inputProps={{ maxLength: 64 }}
        startAdornment={
          <InputAdornment position="start">
              <IconButton edge="start" sx={{ color: "primary.main" }} onClick={handleComplete}>
                {step.completed ? (
                  <CheckCircleIcon/>
                ) : (
                  <RadioButtonUncheckedOutlinedIcon/>
                )}
              </IconButton>
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <Tooltip title="Delete Step">
              <IconButton edge="end" onClick={handleDelete}>
                <DeleteOutlineOutlinedIcon/>
              </IconButton>
            </Tooltip>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

const DeletionDialog = ({ open, setOpen, assignment, closeDetails }) => {
  const deletion = useAssignmentDeletion();
  const handleDelete = () => {
    setOpen(false);
    closeDetails();
    deletion.mutate(assignment.id);
  };

  return (
    <Dialog maxWidth="xs" open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Delete this assignment?</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          All steps that are part of this assignment will be deleted as well. This action cannot be undone.
        </DialogContentText>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="outlined" color="error">Delete</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

const StepForm = ({ assignment }) => {
  const stepCreation = useStepCreation(assignment.id);

  const [value, setValue] = useState("");
  const handleSubmit = async () => {
    stepSchema.validate({ title: value })
      .then(request => stepCreation.mutate({ id: assignment.id, request }))
      .catch(() => {/* Ignore. */});

    setValue("");
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      await handleSubmit();
    }
  };

  return (
    <FormControl variant="filled">
      <InputLabel>Step</InputLabel>
      <FilledInput
        label="Step"
        type="text"
        value={value}
        onBlur={handleSubmit}
        onKeyDown={handleKeyDown}
        onChange={(event) => setValue(removeNewlines(event.target.value))}
        inputProps={{ maxLength: 64 }}
        placeholder="Add step"
        startAdornment={
          <InputAdornment position="start">
            <IconButton edge="start" sx={{ color: "primary.main" }}>
              <AddCircleIcon/>
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
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
