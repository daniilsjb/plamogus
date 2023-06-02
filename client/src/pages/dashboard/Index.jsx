import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Badge from "@mui/material/Badge";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { DateCalendar, PickersDay } from "@mui/x-date-pickers";

import EventIcon from "@mui/icons-material/Event";
import EventBusyIcon from "@mui/icons-material/EventBusy";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import dayjs from "dayjs";

import { useQuery } from "react-query";
import { getDashboard } from "../../api/dashboard";
import { ASSIGNMENT_TYPES } from "../../common/constants";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { status, data } = useQuery({
    queryKey: ["dashboard", "assignments", "courses"],
    queryFn: getDashboard,
  });

  if (status === "loading") {
    return <DashboardLoading/>;
  } else if (status === "error") {
    return <Navigate to="/error"/>
  }

  return (
    <Grid container spacing={3}>
      {/* ROW 1 */}
      <Grid item container xs={12} sm={12} md={12} lg={4} spacing={3}>
        <Grid item xs={12} sm={6} lg={12}>
          <Paper sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            p: 1,
            gap: { xs: 1, sm: 2, md: 3 },
          }}>
            <PendingAssignments pending={data.pendingCount}/>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} lg={12}>
          <Paper sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            p: 1,
            gap: { xs: 1, sm: 2, md: 3 },
          }}>
            <OverdueAssignments overdue={data.overdueCount}/>
          </Paper>
        </Grid>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={8}>
        <Paper sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          gap: { xs: 1, sm: 2, md: 3 },
        }}>
          <Typography variant="h5">Semester Insights</Typography>
          <SemesterDistribution data={data.semesters}/>
        </Paper>
      </Grid>

      {/* ROW 2 */}
      <Grid item xs={12} sm={12} lg={5}>
        <Paper sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          gap: { xs: 1, sm: 2, md: 3 },
        }}>
          <Typography variant="h5">Deadline Overview</Typography>
          <AssignmentCalendar data={data.deadlines}/>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12} lg={7}>
        <Paper sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          gap: { xs: 1, sm: 2, md: 3 },
        }}>
          <Typography variant="h5">Assignment Distribution</Typography>
          <TypeDistribution data={data.types}/>
        </Paper>
      </Grid>
    </Grid>
  );
};

const DashboardLoading = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1 }}>
      <CircularProgress/>
      <Typography sx={{ mt: 3 }} variant="h6">Hold up a moment!</Typography>
      <Typography sx={{ mt: 1 }}>We are just loading your data...</Typography>
    </Box>
  );
};

const PendingAssignments = ({ pending }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, p: 3 }}>
      <Typography variant="h2" align="center">{pending}</Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="h5" align="center">Assignments are pending</Typography>
        <EventIcon sx={{ color: "primary.main" }}/>
      </Box>
      {pending === 0 ? (
        <Typography variant="body2" align="center">Wow! You&apos;re really doing well, amazing job!</Typography>
      ) : (
        <Typography variant="body2" align="center">You&apos;re almost there, keep up the good work!</Typography>
      )}
    </Box>
  );
};

const OverdueAssignments = ({ overdue }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, p: 3 }}>
      <Typography variant="h2" align="center">{overdue}</Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="h5" align="center">Assignments are overdue</Typography>
        <EventBusyIcon sx={{ color: "error.main" }}/>
      </Box>
      {overdue === 0 ? (
        <Typography variant="body2" align="center">Great work! Relax and enjoy your time.</Typography>
      ) : (
        <Typography variant="body2" align="center">Don&apos;t panic and keep going, you&apos;ve got this!</Typography>
      )}
    </Box>
  );
};

const TypeDistribution = ({ data }) => {
  const theme = useTheme();

  if (data.length < 2) {
    return <Typography>Not enough data. Add more assignments first!</Typography>;
  }

  data = data.map(({ type, count }) => ({
    label: ASSIGNMENT_TYPES.find(it => it.value === type).label,
    count: count,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis type="number"/>
        <YAxis type="category" dataKey="label" width={100}/>
        <Tooltip
          labelFormatter={(value) => `Type: ${value}`}
          formatter={(value) => [value, "Total Count"]}
          separator=": "
        />
        <Bar dataKey="count" fill={theme.palette.primary.main}/>
        <Legend formatter={() => "Assignments"}/>
      </BarChart>
    </ResponsiveContainer>
  );
};

const SemesterDistribution = ({ data }) => {
  const theme = useTheme();
  if (data.length < 2) {
    return <Typography>Not enough data. Add more assignments first!</Typography>;
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="semester"/>
        <YAxis/>
        <Tooltip
          labelFormatter={(value) => `Semester: ${value}`}
          formatter={(value) => [value, "Assignments"]}
          separator=": "
        />
        <Line type="monotone" dataKey="count" stroke={theme.palette.primary.main}/>
        <Legend formatter={() => "Assignments"}/>
      </LineChart>
    </ResponsiveContainer>
  );
};

const AssignmentDay = ({ data, day, outsideCurrentMonth, ...props }) => {
  const entry = !outsideCurrentMonth ? data.find(it => dayjs(it.deadlineTime)
    .startOf("date")
    .toISOString() === day.toISOString(),
  ) : null;

  const count = entry?.count ?? 0;
  const color = entry?.overdue ? "error" : "primary";

  return (
    <Badge key={day.toString()} overlap="circular" color={color} badgeContent={count}>
      <PickersDay day={day} outsideCurrentMonth={outsideCurrentMonth} {...props}/>
    </Badge>
  );
};

const AssignmentCalendar = ({ data }) => {
  return (
    <DateCalendar
      readOnly
      slots={{ day: AssignmentDay }}
      slotProps={{
        day: { data },
      }}
    />
  );
};

export default Dashboard;
