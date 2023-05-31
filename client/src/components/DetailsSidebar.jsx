import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Drawer from "@mui/material/Drawer";

const DetailsSidebar = ({ children, ...rest }) => {
  const { breakpoints, width } = useTheme();
  const isTemporary = useMediaQuery(breakpoints.down("md"));

  return (
    <Drawer
      anchor="right"
      variant={isTemporary ? "temporary" : "persistent"}
      PaperProps={{
        elevation: 1,
        sx: {
          width: width.detailsDrawer,
          boxSizing: "border-box",
          p: 3,
        },
      }}
      {...rest}
    >
      {children}
    </Drawer>
  );
};

export default DetailsSidebar;
