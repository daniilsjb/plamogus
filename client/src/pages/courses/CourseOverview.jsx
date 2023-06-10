import { useTheme } from "@mui/material";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import SchoolIcon from "@mui/icons-material/School";
import SearchOffIcon from "@mui/icons-material/SearchOff";

import CourseActions from "./CourseActions";
import CourseTable from "./CourseTable";
import { useCourseContext } from "./CourseContext";
import SidebarShiftedContainer from "../../components/SidebarShiftedContainer";

const CourseOverview = ({ data }) => {
  const { selectedAction } = useCourseContext();
  return (
    <Container sidebarOpen={!!selectedAction}>
      <Content data={data}/>
    </Container>
  );
};

const Container = ({ sidebarOpen, children }) => {
  const { width } = useTheme();
  return (
    <SidebarShiftedContainer
      sx={{ display: "flex", flexDirection: "column", flex: 1, gap: { xs: 2, sm: 3 } }}
      sidebarSize={width.detailsDrawer}
      sidebarOpen={sidebarOpen}
      sidebarAnchor="right"
    >
      {children}
    </SidebarShiftedContainer>
  );
};

const Content = ({ data }) => {
  const { queryParams } = useCourseContext();

  const filteringApplied = !!queryParams.search;
  if (data.length === 0 && !filteringApplied) {
    return <Empty/>;
  }

  return <>
    <CourseActions/>
    <Results data={data}/>
  </>;
};

const Empty = () => {
  const { handleCreate } = useCourseContext();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Icon component={SchoolIcon} sx={{ fontSize: "160px", color: "primary.main" }}></Icon>
      <Typography variant="h6">You don&apos;t have any courses.</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>Would you like to create one now?</Typography>
      <Button variant="outlined" sx={{ mt: 2 }} onClick={handleCreate}>New</Button>
    </Box>
  );
};

const Results = ({ data }) => {
  if (data.length > 0) {
    return <CourseTable data={data}/>;
  } else {
    return <EmptyFiltered/>;
  }
};

const EmptyFiltered = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Icon component={SearchOffIcon} sx={{ fontSize: "160px", color: "primary.main" }}></Icon>
      <Typography variant="h6">No courses match these criteria.</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>Try searching for something else instead.</Typography>
    </Box>
  );
};

export default CourseOverview;
