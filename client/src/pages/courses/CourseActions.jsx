import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

import { useCourseContext } from "./CourseContext";
import SearchBar from "../../components/SearchBar";

const CourseActions = () => {
  const { handleCreate, queryParams, setQueryParams } = useCourseContext();
  return (
    <Box sx={{ display: "flex", gap: { xs: 2, sm: 3 }, alignItems: "center" }}>
      <NewButton onClick={handleCreate}/>
      <SearchBar setSearch={value => setQueryParams({ ...queryParams, search: value })}
      />
    </Box>
  );
};

const NewButton = ({ onClick }) => {
  return (
    <Tooltip title="Create Course">
      <Button variant="contained" onClick={onClick}>New</Button>
    </Tooltip>
  );
};

export default CourseActions;
