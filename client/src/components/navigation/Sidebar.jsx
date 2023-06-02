import { Link, useLocation } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";

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

const Sidebar = ({ open, setOpen }) => {
  const { breakpoints, width } = useTheme();
  const isTemporary = useMediaQuery(breakpoints.down("md"));

  const handleNavigationClick = () => {
    if (isTemporary) setOpen(false)();
  };

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      variant={isTemporary ? "temporary" : "persistent"}
      PaperProps={{
        elevation: 1,
        sx: {
          width: width.navigationDrawer,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar/>
      <Box sx={{ overflow: "auto" }}>
        <List>
          <NavigationEntry
            icon={<SpaceDashboardOutlinedIcon/>}
            title={"Dashboard"}
            route={"/dashboard"}
            onClick={handleNavigationClick}
          />
          <NavigationEntry
            icon={<AssignmentOutlinedIcon/>}
            title={"Assignments"}
            route={"/assignments"}
            onClick={handleNavigationClick}
          />
          <NavigationEntry
            icon={<SchoolOutlinedIcon/>}
            title={"Courses"}
            route={"/courses"}
            onClick={handleNavigationClick}
          />
        </List>
      </Box>
    </Drawer>
  );
};

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
