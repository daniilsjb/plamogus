import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import Typography from '@mui/material/Typography';

const NotFound = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    }}>
      <Icon component={SearchOffIcon} sx={{ fontSize: '160px', color: 'primary.main' }}></Icon>
      <Typography variant="h4" sx={{ mt: 3 }}>404</Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>This page does not exist.</Typography>
    </Box>
  )
};

export default NotFound;