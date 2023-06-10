import Drawer from "@mui/material/Drawer";
import { useTheme } from "@mui/material/styles";
import { useResponsiveQuery } from "../theme";

const DetailsSidebar = ({ children, ...rest }) => {
  const { width } = useTheme();
  const { isSidebarTemporary } = useResponsiveQuery();

  return (
    <Drawer
      anchor="right"
      variant={isSidebarTemporary ? "temporary" : "persistent"}
      PaperProps={{
        elevation: 1,
        sx: {
          width: width.detailsDrawer,
          p: { xs: 2, sm: 3 },
        },
      }}
      {...rest}
    >
      {children}
    </Drawer>
  );
};

export default DetailsSidebar;
