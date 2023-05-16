import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import Dashboard from './pages/dashboard/Dashboard';
import Assignments from './pages/assignments/Assignments';
import Courses from './pages/courses/Courses';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { ColorModeContext, useColorMode } from './theme';
import { QueryClient, QueryClientProvider } from 'react-query';

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

  useEffect(() => {
    if (isSidebarTemporary) {
      setSidebarOpen(false);
    }
  }, [isSidebarTemporary]);

  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}/>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Header setSidebarOpen={setSidebarOpen}/>
            <Main sx={{ display: 'flex', flex: 1, minHeight: 0, p: 3 }} sidebarOpen={sidebarOpen}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard/>}></Route>
                <Route path="/assignments" element={<Assignments/>}></Route>
                <Route path="/courses" element={<Courses/>}></Route>
              </Routes>
            </Main>
          </Box>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
