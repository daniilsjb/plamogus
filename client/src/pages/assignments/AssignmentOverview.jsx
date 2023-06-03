import { useState } from "react";
import { useQuery } from "react-query";
import { Navigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CircularProgress from "@mui/material/CircularProgress";

import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SearchOffIcon from "@mui/icons-material/SearchOff";

import AssignmentCard from "./AssignmentCard";
import AssignmentActions from "./AssignmentActions";

import { findAllAssignments } from "../../api/assignment";
import { partition } from "../../common/functional";

const AssignmentOverview = ({
  detailsOpen,
  handleCreate,
  handleSelect,
  selectedAssignment,
}) => {
  const [queryParams, setQueryParams] = useState({ order: "asc" });
  const setQueryParam = (name, value) => {
    setQueryParams({
      ...queryParams,
      [name]: value,
    });
  };

  const { status, data } = useQuery({
    queryKey: ["assignments", queryParams],
    queryFn: () => findAllAssignments(queryParams),
    keepPreviousData: true,
  });

  if (status === "loading") {
    return <AssignmentsLoading/>;
  } else if (status === "error") {
    return <Navigate to="/error"/>;
  }

  const isFilterApplied = !!queryParams.type || !!queryParams.title || !!queryParams.course;
  return (
    <ContentContainer detailsOpen={detailsOpen} sx={{ display: "flex", flexDirection: "column", flex: 1, gap: 3 }}>
      {(data.length === 0 && !isFilterApplied) ? (
        <AssignmentsEmpty handleCreate={handleCreate}/>
      ) : (<>
        <AssignmentActions
          queryParams={queryParams}
          setQueryParam={setQueryParam}
          handleCreate={handleCreate}
        />

        {(data.length === 0 && isFilterApplied) ? (
          <FilteredAssignmentsEmpty/>
        ) : (
          <AssignmentContent
            data={data}
            selectAssignment={handleSelect}
            selectedAssignment={selectedAssignment}
          />
        )}
      </>)}
    </ContentContainer>

  );
};

const AssignmentsLoading = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1 }}>
      <CircularProgress/>
      <Typography sx={{ mt: 3 }} variant="h6">Hold up a moment!</Typography>
      <Typography sx={{ mt: 1 }}>We are just loading your assignments...</Typography>
    </Box>
  );
};

const AssignmentsEmpty = ({ handleCreate }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Icon component={AssignmentIcon} sx={{ fontSize: "160px", color: "primary.main" }}></Icon>
      <Typography variant="h6">You don&apos;t have any assignments.</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>Would you like to create one now?</Typography>
      <Button variant="outlined" sx={{ mt: 2 }} onClick={handleCreate}>New</Button>
    </Box>
  );
};

const FilteredAssignmentsEmpty = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Icon component={SearchOffIcon} sx={{ fontSize: "160px", color: "primary.main" }}></Icon>
      <Typography variant="h6">No assignments match these criteria.</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>Try searching for something else instead.</Typography>
    </Box>
  );
};

const AssignmentContent = ({ data, selectedAssignment, selectAssignment }) => {
  const [completed, pending] = partition(data, it => it.completed);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "auto" }}>
      {(pending.length !== 0) && <AssignmentGroup
        title="Pending"
        assignments={pending}
        selectedAssignment={selectedAssignment}
        selectAssignment={selectAssignment}
      />}

      {(completed.length !== 0) && <AssignmentGroup
        title="Completed"
        assignments={completed}
        selectedAssignment={selectedAssignment}
        selectAssignment={selectAssignment}
      />}
    </Box>
  );
};

const AssignmentGroup = ({ title, assignments, selectedAssignment, selectAssignment }) => {
  return <>
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Typography>{title}</Typography>
      <Typography variant="body2" sx={{ ml: 1, color: "text.secondary" }}>
        {assignments.length}
      </Typography>
    </Box>

    {assignments.map(it => (
      <AssignmentCard
        key={it.id}
        assignment={it}
        selected={selectedAssignment?.id === it.id}
        onClick={() => selectAssignment(it)}
      />
    ))}
  </>;
};

const ContentContainer = styled(Box, { shouldForwardProp: (prop) => prop !== "detailsOpen" })(
  ({ theme, detailsOpen }) => {
    const isSidebarTemporary = useMediaQuery(theme.breakpoints.down("md"));
    return {
      marginRight: (isSidebarTemporary || !detailsOpen) ? 0 : `${theme.width.detailsDrawer}px`,
      ...(!isSidebarTemporary && {
        ...(detailsOpen ? {
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        } : {
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }),
      }),
    };
  },
);

export default AssignmentOverview;
