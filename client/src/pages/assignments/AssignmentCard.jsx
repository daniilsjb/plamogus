import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import SchoolIcon from "@mui/icons-material/School";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";

import dayjs from "dayjs";

import { utcToLocalDate } from "../../common/date";
import { ASSIGNMENT_TYPES } from "../../common/constants";
import { useAssignmentCompletion } from "../../mutations/assignment";

const AssignmentCard = ({ assignment, selected, onClick }) => {
  return (
    <Card sx={{ overflow: "visible", mx: 2 }} raised={selected}>
      <CardActionArea component="a" onClick={onClick}>
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AssignmentCompletion assignment={assignment}/>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <AssignmentTitle assignment={assignment}/>
            <AssignmentAttributes assignment={assignment}/>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const AssignmentCompletion = ({ assignment }) => {
  const completionToggle = useAssignmentCompletion();

  // We need to clear event propagations to ensure that the card action area
  // does not consume the events that we're interested in.
  const handleMouseDown = async (event) => {
    event.stopPropagation();
  };
  const handleClick = async (event) => {
    event.stopPropagation();
    completionToggle.mutate(assignment);
  };

  return (
    <IconButton onMouseDown={handleMouseDown} onClick={handleClick} sx={{ color: "primary.main" }}>
      {assignment.completed ? <CheckCircleIcon/> : <RadioButtonUncheckedOutlinedIcon/>}
    </IconButton>
  );
};

const AssignmentTitle = ({ assignment: { title, completed } }) => {
  return (
    <Typography sx={{
      color: completed && "text.secondary",
      wordBreak: "break-word",
    }}>
      {title}
    </Typography>
  );
};

const AssignmentAttributes = ({ assignment }) => {
  // Avoid creating redundant wrappers if there aren't any chips to display.
  // Otherwise, the vertical centering of the card's title gets shifted.
  return (assignment.type || assignment.deadlineTime || assignment.course) && (
    <Box sx={{ display: "flex", gap: 1 }}>
      {assignment.type && <TypeChip assignment={assignment}/>}
      {assignment.course && <CourseChip assignment={assignment}/>}
      {assignment.deadlineTime && <DeadlineChip assignment={assignment}/>}
    </Box>
  );
};

const TypeChip = ({ assignment: { type, completed } }) => {
  return <Chip
    size="small"
    icon={<HistoryEduIcon/>}
    label={ASSIGNMENT_TYPES.find(it => it.value === type).label}
    sx={{ color: completed && "text.secondary" }}
  />;
};

const CourseChip = ({ assignment: { course, completed } }) => {
  return <Chip
    size="small"
    icon={<SchoolIcon/>}
    label={course.code}
    sx={{ color: completed && "text.secondary" }}
  />;
};

const DeadlineChip = ({ assignment: { deadlineTime, completed } }) => {
  const today = dayjs().startOf("date");
  const overdue = deadlineTime && dayjs(deadlineTime).isBefore(today);

  const calendarIcon = (overdue && !completed)
    ? <EventBusyIcon sx={{ "&&": { color: "error.main" } }}/>
    : <CalendarMonthIcon/>;

  return <Chip
    size="small"
    icon={calendarIcon}
    label={utcToLocalDate(deadlineTime)}
    sx={{ color: (completed && "text.secondary") || (overdue && "error.main") || "text.primary" }}
  />;
};

export default AssignmentCard;
