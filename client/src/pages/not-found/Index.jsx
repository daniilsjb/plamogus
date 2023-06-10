import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    }}>
      <Icon component={SearchOffIcon} sx={{ fontSize: "160px", color: "primary.main" }}></Icon>
      <Typography variant="h4" sx={{ mt: 3 }}>404</Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>This page does not exist.</Typography>
      <Button sx={{ mt: 2 }} onClick={() => navigate("/")}>Return Home</Button>
    </Box>
  );
};

export default NotFound;
