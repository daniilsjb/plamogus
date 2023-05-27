import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';
import { ThemeProvider, useMediaQuery } from '@mui/material';
import { ColorModeContext, useColorMode } from './theme';

import { QueryClient, QueryClientProvider } from 'react-query';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';

import Box from '@mui/material/Box';

import Assignments from './pages/assignments/Index';
import Courses from './pages/courses/Index';
import Dashboard from './pages/dashboard/Index';
import NotFound from './pages/not-found/Index';
import Error from './pages/error/Index';

import Sidebar from './components/Sidebar';
import Header from './components/Header';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'sidebarOpen' })(
  ({ theme, sidebarOpen }) => {
    const isSidebarTemporary = useMediaQuery(theme.breakpoints.down('md'));
    return {
      marginLeft: (isSidebarTemporary || !sidebarOpen) ? 0 : `${theme.width.navigationDrawer}px`,
      ...(!isSidebarTemporary && {
        ...(sidebarOpen ? {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        } : {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }),
      }),
    };
  },
);

const queryClient = new QueryClient();

const App = () => {
  const [theme, colorMode] = useColorMode();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isSidebarTemporary = useMediaQuery(theme.breakpoints.down('md'));

  // Automatically collapse sidebar when it becomes temporary.
  useEffect(() => {
    if (isSidebarTemporary) {
      setSidebarOpen(false);
    }
  }, [isSidebarTemporary]);

  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CssBaseline/>
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}/>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Header setSidebarOpen={setSidebarOpen}/>
              <Main sx={{
                display: 'flex',
                flex: 1,
                minHeight: 0,
                p: { xs: 1, sm: 2, md: 3 },
                justifyContent: 'center',
                overflow: 'auto',
              }} sidebarOpen={sidebarOpen}>
                <Routes>
                  <Route path="/" element={<Navigate to="/assignments" replace/>}/>
                  <Route path="/*" element={<NotFound/>}/>
                  <Route path="/error" element={<Error/>}/>
                  <Route path="/dashboard" element={<Dashboard/>}/>
                  <Route path="/assignments" element={<Assignments/>}/>
                  <Route path="/courses" element={<Courses/>}/>
                </Routes>
              </Main>
            </Box>
          </LocalizationProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
