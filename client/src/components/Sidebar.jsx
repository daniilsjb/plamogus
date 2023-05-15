import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import { useMediaQuery, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';

const NavigationEntry = ({ icon, title, route, ...props }) => {
  const { pathname } = useLocation();
  return (
    <ListItemButton key={route} component={Link} to={route} selected={pathname === route} {...props}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={title}/>
    </ListItemButton>
  );
};

const Sidebar = ({ open, setOpen }) => {
  const theme = useTheme();
  const isSidebarTemporary = useMediaQuery(theme.breakpoints.down('md'));

  const onNavigationClick = () => {
    if (isSidebarTemporary) {
      setOpen(false);
    }
  };

  return (
    <Drawer
      variant={isSidebarTemporary ? 'temporary' : 'persistent'}
      onClose={() => setOpen(false)}
      open={open}
      PaperProps={{
        sx: {
          width: theme.width.navigationDrawer,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar/>
      <Box sx={{ overflow: 'scroll' }}>
        <List>
          <NavigationEntry
            icon={<SpaceDashboardOutlinedIcon/>}
            title={'Dashboard'}
            route={'/dashboard'}
            onClick={onNavigationClick}
          />
          <NavigationEntry
            icon={<AssignmentOutlinedIcon/>}
            title={'Assignments'}
            route={'/assignments'}
            onClick={onNavigationClick}
          />
          <NavigationEntry
            icon={<SchoolOutlinedIcon/>}
            title={'Courses'}
            route={'/courses'}
            onClick={onNavigationClick}
          />
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
