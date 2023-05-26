import { useContext, useState } from 'react';
import { Tooltip, useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { ColorModeContext } from '../theme';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useMutation } from 'react-query';
import { logout } from '../services/auth';
import { useNavigate } from 'react-router-dom';

const Header = ({ setSidebarOpen }) => {
  const navigate = useNavigate();
  const { mutateAsync } = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      navigate('/');
    },
  })

  const theme = useTheme();
  const { toggleColorMode } = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = !!anchorEl;

  const handleSignOut = async () => {
    setAnchorEl(null);
    await mutateAsync(null);
  };

  return (
    // The appbar is part of the normal flow, but displayed on top of the sidebar.
    <AppBar position="relative" sx={{ zIndex: theme => theme.zIndex.drawer + 100 }}>
      <Toolbar>
        {/* SIDEBAR COLLAPSE */}
        <IconButton onClick={() => setSidebarOpen(prevState => !prevState)} color="inherit" sx={{ mr: 2 }}>
          <MenuOutlinedIcon/>
        </IconButton>

        {/* BRANDING */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          University Assignment Planner
        </Typography>

        {/* ICONS */}
        <Tooltip title="Toggle Theme">
          <IconButton onClick={toggleColorMode} color="inherit">
            {theme.palette.mode === 'light' ? <DarkModeOutlinedIcon/> : <LightModeOutlinedIcon/>}
          </IconButton>
        </Tooltip>

        <Tooltip title="User Profile">
          <IconButton onClick={ev => setAnchorEl(ev.currentTarget)} color="inherit">
            <AccountCircleOutlinedIcon/>
          </IconButton>
        </Tooltip>

        <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={handleSignOut}>
            <ListItemText>Sign out</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
