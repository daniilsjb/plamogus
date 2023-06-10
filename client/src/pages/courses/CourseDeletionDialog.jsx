import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import { useCourseDeletion } from "../../mutations/course";
import { useCourseContext } from "./CourseContext";

const CourseDeletionDialog = ({ open, onClose }) => {
  const deletion = useCourseDeletion();
  const { handleClear, selectedCourse } = useCourseContext();

  const handleDelete = () => {
    deletion.mutate(selectedCourse.id);
    handleClear();
    onClose();
  };

  return (
    <Dialog maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle>Delete this course?</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          All assignments that are part of this course will be deleted as well. This action cannot be undone.
        </DialogContentText>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleDelete} variant="outlined" color="error">Delete</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDeletionDialog;
