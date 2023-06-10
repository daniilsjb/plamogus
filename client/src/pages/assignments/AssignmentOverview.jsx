import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SearchOffIcon from "@mui/icons-material/SearchOff";

import AssignmentCard from "./AssignmentCard";
import AssignmentActions from "./AssignmentActions";
import { partition } from "../../common/functional";
import SidebarShiftedContainer from "../../components/SidebarShiftedContainer";
import { useTheme } from "@mui/material";
import { useAssignmentContext } from "./AssignmentContext";

const AssignmentOverview = ({ data }) => {
  const { selectedAction } = useAssignmentContext();
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
  const { queryParams } = useAssignmentContext();

  const filteringApplied = !!(queryParams.type || queryParams.title || queryParams.course);
  if (data.length === 0 && !filteringApplied) {
    return <Empty/>;
  }

  return <>
    <AssignmentActions/>
    <Results data={data}/>
  </>;
};

const Empty = () => {
  const { handleCreate } = useAssignmentContext();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Icon component={AssignmentIcon} sx={{ fontSize: "160px", color: "primary.main" }}></Icon>
      <Typography variant="h6">You don&apos;t have any assignments.</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>Would you like to create one now?</Typography>
      <Button variant="outlined" sx={{ mt: 2 }} onClick={handleCreate}>New</Button>
    </Box>
  );
};

const Results = ({ data }) => {
  if (data.length > 0) {
    return <Groups data={data}/>;
  } else {
    return <EmptyFiltered/>;
  }
};

const EmptyFiltered = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Icon component={SearchOffIcon} sx={{ fontSize: "160px", color: "primary.main" }}></Icon>
      <Typography variant="h6">No assignments match these criteria.</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>Try searching for something else instead.</Typography>
    </Box>
  );
};

const Groups = ({ data }) => {
  const [completed, pending] = partition(data, it => it.completed);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "auto" }}>
      {(pending.length !== 0) &&
        <Group title="Pending" data={pending}/>
      }
      {(completed.length !== 0) &&
        <Group title="Completed" data={completed}/>
      }
    </Box>
  );
};

const Group = ({ title, data }) => {
  const { handleSelect, selectedAssignment } = useAssignmentContext();
  return <>
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Typography>{title}</Typography>
      <Typography variant="body2" sx={{ ml: 1, color: "text.secondary" }}>
        {data.length}
      </Typography>
    </Box>

    {data.map(it => (
      <AssignmentCard
        key={it.id}
        assignment={it}
        selected={selectedAssignment?.id === it.id}
        onClick={() => handleSelect(it)}
      />
    ))}
  </>;
};

export default AssignmentOverview;
