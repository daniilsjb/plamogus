import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";

import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";

import { useResponsiveQuery } from "../../theme";
import { useTheme } from "@mui/material";

const Sidebar = ({ open, setOpen }) => {
  const theme = useTheme();
  const { isSidebarTemporary } = useResponsiveQuery();

  // Automatically collapse sidebar when it becomes temporary.
  useEffect(() => {
    if (isSidebarTemporary) setOpen(false);
  }, [isSidebarTemporary, setOpen]);

  const handleClick = () => {
    if (isSidebarTemporary) setOpen(false);
  };

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      variant={isSidebarTemporary ? "temporary" : "persistent"}
      PaperProps={{
        elevation: 1,
        sx: {
          width: theme.width.navigationDrawer,
        },
      }}
    >
      <Toolbar/>
      <Box sx={{ overflow: "auto" }}>
        <List>
          {navigationEntries.map((entry, idx) => (
            <NavigationEntry key={idx} onClick={handleClick} {...entry}/>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

const navigationEntries = [
  {
    title: "Dashboard",
    route: "/dashboard",
    icon: <SpaceDashboardOutlinedIcon/>,
  },
  {
    title: "Assignments",
    route: "/assignments",
    icon: <AssignmentOutlinedIcon/>,
  },
  {
    title: "Courses",
    route: "/courses",
    icon: <SchoolOutlinedIcon/>,
  },
];

const NavigationEntry = ({ icon, title, route, ...rest }) => {
  const { pathname } = useLocation();
  return (
    <ListItemButton key={route} component={Link} to={route} selected={pathname === route} {...rest}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={title}/>
    </ListItemButton>
  );
};

export default Sidebar;
