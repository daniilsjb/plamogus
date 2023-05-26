import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Icon } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    }}>
      <Icon component={SearchOffIcon} sx={{ fontSize: '160px', color: 'primary.main' }}></Icon>
      <Typography variant="h6">This page does not exist.</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>Would you like to return home?</Typography>
      <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/')}>Yes</Button>
    </Box>
  )
};

export default NotFoundPage;