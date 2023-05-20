import { useMutation, useQueryClient } from 'react-query';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import SchoolIcon from '@mui/icons-material/School';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';

import dayjs from 'dayjs';

import ASSIGNMENT_TYPES from '../../schemas/assignment-types';
import { completeAssignment, uncompleteAssignment } from '../../services/assignment';

const utcToLocalDate = (utc) => {
  return new Date(utc).toLocaleDateString(undefined, {
    year: 'numeric', month: 'numeric', day: 'numeric',
  });
};

const TypeChip = ({ assignment: { type, completed } }) => {
  return (
    <Chip
      size="small"
      icon={<HistoryEduIcon/>}
      label={ASSIGNMENT_TYPES.find(it => it.value === type).label}
      sx={{ color: theme => completed && theme.palette.grey[500] }}
    />
  );
};

const DeadlineChip = ({ assignment: { deadlineTime, completed } }) => {
  const today = dayjs().startOf('date');
  const overdue = !!deadlineTime && dayjs(deadlineTime).isBefore(today);

  const calendarIcon = (overdue && !completed)
    ? <EventBusyIcon sx={{ '&&': { color: theme => theme.palette.error.main } }}/>
    : <CalendarMonthIcon/>;

  return (
    <Chip
      size="small"
      icon={calendarIcon}
      label={utcToLocalDate(deadlineTime)}
      sx={{
        color: theme => (completed && theme.palette.grey[500]) || (overdue && theme.palette.error.main),
      }}
    />
  );
};

const CourseChip = ({ assignment: { course, completed } }) => {
  return (
    <Chip
      size="small"
      icon={<SchoolIcon/>}
      label={course.code}
      sx={{ color: theme => completed && theme.palette.grey[500] }}
    />
  );
};

const toggleCompletion = async (assignment) => {
  if (assignment.completed) {
    await uncompleteAssignment(assignment.id);
  } else {
    await completeAssignment(assignment.id);
  }
};

const CompletionIcon = ({ assignment }) => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: toggleCompletion,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });

  // We need to clear event propagation to ensure that the card action area
  // does not consume the mouse down and click events.
  const handleMouseDown = async (event) => {
    event.stopPropagation();
  };

  const handleCompletionClick = async (event) => {
    event.stopPropagation();
    await mutateAsync(assignment);
  };

  return (
    <IconButton onMouseDown={handleMouseDown} onClick={handleCompletionClick} sx={{ color: 'primary.main' }}>
      {assignment.completed ? <CheckCircleIcon/> : <RadioButtonUncheckedOutlinedIcon/>}
    </IconButton>
  );
};

const Assignment = ({ assignment, selected, handleSelect }) => {
  return (
    <Card sx={{ overflow: 'visible' }} raised={selected?.id === assignment.id}>
      <CardActionArea component="a" onClick={() => handleSelect(assignment)}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CompletionIcon assignment={assignment}/>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={{
              color: theme => assignment.completed && theme.palette.grey[500],
              textDecoration: assignment.completed && 'line-through',
              wordBreak: 'break-word',
            }}>
              {assignment.title}
            </Typography>

            {(assignment.type || assignment.deadlineTime || assignment.course) && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {assignment.type && <TypeChip assignment={assignment}/>}
                {assignment.deadlineTime && <DeadlineChip assignment={assignment}/>}
                {assignment.course && <CourseChip assignment={assignment}/>}
              </Box>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Assignment;
