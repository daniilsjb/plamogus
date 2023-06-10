import { useState } from "react";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { FilledInput, InputAdornment } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import stepSchema from "../../schemas/step";
import { useStepCompletion, useStepDeletion, useStepUpdate } from "../../mutations/step";
import { removeNewlines } from "../../common/string";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const AssignmentStep = ({ assignment, step, index }) => {
  const update = useStepUpdate(assignment.id);
  const deletion = useStepDeletion(assignment.id);
  const [value, setValue] = useState(step.title);

  const handleSubmit = async () => {
    stepSchema.validate({ title: value })
      .then(request => update.mutate({ id: step.id, request }))
      .catch(() => deletion.mutate(step.id));
  };

  const handleChange = (event) => {
    setValue(removeNewlines(event.target.value));
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      await handleSubmit();
    }
  };

  return (
    <FormControl variant="filled">
      <InputLabel>{`Step ${index + 1}`}</InputLabel>
      <FilledInput
        label={`Step ${index + 1}`}
        value={value}
        onBlur={handleSubmit}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        inputProps={{ maxLength: 64 }}
        startAdornment={
          <InputAdornment position="start">
            <CompletionIcon assignment={assignment} step={step}/>
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <DeletionIcon assignment={assignment} step={step}/>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

const CompletionIcon = ({ assignment, step }) => {
  const completion = useStepCompletion(assignment.id);
  const handleComplete = async () => {
    await completion.mutateAsync(step);
  };

  return (
    <IconButton edge="start" sx={{ color: "primary.main" }} onClick={handleComplete}>
      {step.completed ? (
        <CheckCircleIcon/>
      ) : (
        <RadioButtonUncheckedOutlinedIcon/>
      )}
    </IconButton>
  );
};

const DeletionIcon = ({ assignment, step }) => {
  const deletion = useStepDeletion(assignment.id);
  const handleDelete = async () => {
    await deletion.mutateAsync(step.id);
  };

  return (
    <Tooltip title="Delete Step">
      <IconButton edge="end" onClick={handleDelete}>
        <DeleteOutlineOutlinedIcon/>
      </IconButton>
    </Tooltip>
  );
};

export default AssignmentStep;
