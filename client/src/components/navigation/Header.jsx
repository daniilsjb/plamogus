import { useContext } from "react";
import { useTheme } from "@mui/material";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

import { ColorModeContext } from "../../theme";

const Header = ({ setNavigationOpen }) => {
  const theme = useTheme();
  const { toggleColorMode } = useContext(ColorModeContext);

  return (
    // The appbar is part of the normal flow, but displayed on top of the sidebar.
    <AppBar position="relative" sx={{ zIndex: theme => theme.zIndex.drawer + 100 }}>
      <Toolbar>
        {/* NAVIGATION COLLAPSE */}
        <Tooltip title="Collapse Navigation">
          <IconButton onClick={() => setNavigationOpen(prevState => !prevState)} color="inherit" sx={{ mr: 2 }}>
            <MenuOutlinedIcon/>
          </IconButton>
        </Tooltip>

        {/* BRANDING */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          University Assignment Planner
        </Typography>

        {/* ICONS */}
        <Tooltip title="Toggle Theme">
          <IconButton onClick={toggleColorMode} color="inherit">
            {theme.palette.mode === "light" ? <DarkModeOutlinedIcon/> : <LightModeOutlinedIcon/>}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Header;