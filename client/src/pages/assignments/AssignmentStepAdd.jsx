import { useState } from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { FilledInput, InputAdornment } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import stepSchema from "../../schemas/step";
import { useStepCreation } from "../../mutations/step";
import { removeNewlines } from "../../common/string";

const AssignmentStepAdd = ({ assignment }) => {
  const creation = useStepCreation(assignment.id);

  const [value, setValue] = useState("");
  const handleSubmit = async () => {
    stepSchema.validate({ title: value })
      .then(request => creation.mutate({ id: assignment.id, request }))
      .catch(() => {/* Ignore errors, there isn't much we can do beside clearing the field. */});

    setValue("");
  };

  const handleChange = (event) => {
    setValue(removeNewlines(event.target.value))
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
        value={value}
        onBlur={handleSubmit}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        inputProps={{ maxLength: 64 }}
        placeholder="Add step"
        startAdornment={
          <InputAdornment position="start">
            <AddButton/>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

const AddButton = () => {
  // This button doesn't technically need an "onClick" handler since pressing it implies
  // losing focus on the text field, which automatically triggers submission anyway.
  return (
    <IconButton edge="start" sx={{ color: "primary.main" }}>
      <AddCircleIcon/>
    </IconButton>
  );
};

export default AssignmentStepAdd;
