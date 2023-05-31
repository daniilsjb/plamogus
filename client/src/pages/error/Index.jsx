import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

const Error = () => {
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    }}>
      <Icon component={SentimentVeryDissatisfiedIcon} sx={{ fontSize: "160px", color: "primary.main" }}></Icon>
      <Typography variant="h6" sx={{ mt: 3 }}>Oops! Something went wrong.</Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>Please, try again later.</Typography>
    </Box>
  );
};

export default Error;