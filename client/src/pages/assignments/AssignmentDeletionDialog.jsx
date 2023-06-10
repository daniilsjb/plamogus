import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import { useAssignmentDeletion } from "../../mutations/assignment";
import { useAssignmentContext } from "./AssignmentContext";

const AssignmentDeletionDialog = ({ open, onClose }) => {
  const deletion = useAssignmentDeletion();
  const { handleClear, selectedAssignment } = useAssignmentContext();

  const handleDelete = () => {
    deletion.mutate(selectedAssignment.id);
    handleClear();
    onClose();
  };

  return (
    <Dialog maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle>Delete this assignment?</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          All steps that are part of this assignment will be deleted as well. This action cannot be undone.
        </DialogContentText>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleDelete} variant="outlined" color="error">Delete</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentDeletionDialog;
