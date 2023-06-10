import { useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useTheme } from "@mui/material";

import Box from "@mui/material/Box";

import Sidebar from "./components/navigation/Sidebar";
import Header from "./components/navigation/Header";
import SidebarShiftedContainer from "./components/SidebarShiftedContainer";

import Dashboard from "./pages/dashboard/Index";
import Assignments from "./pages/assignments/Index";
import Courses from "./pages/courses/Index";
import NotFound from "./pages/not-found/Index";
import Error from "./pages/error/Index";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="*" element={<NotFound/>}/>
      <Route path="/error" element={<Error/>}/>
      <Route element={<Layout/>}>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/assignments" element={<Assignments/>}/>
        <Route path="/courses" element={<Courses/>}/>
      </Route>
    </Routes>
  );
};

const Home = () => {
  return <Navigate to="/assignments" replace/>;
};

const Layout = () => {
  const { width } = useTheme();
  const [navbarOpen, setNavbarOpen] = useState(true);
  return <>
    <Sidebar open={navbarOpen} setOpen={setNavbarOpen}/>
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Header toggleNavbar={() => setNavbarOpen(prev => !prev)}/>
      <SidebarShiftedContainer
        sx={{ flex: 1, p: { xs: 2, sm: 3, overflow: "auto" } }}
        sidebarSize={width.navigationDrawer}
        sidebarOpen={navbarOpen}
        sidebarAnchor="left"
      >
        <Outlet/>
      </SidebarShiftedContainer>
    </Box>
  </>;
};

export default App;
