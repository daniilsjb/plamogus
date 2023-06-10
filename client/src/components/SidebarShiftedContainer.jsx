import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useResponsiveQuery } from "../theme";

const marginAnchors = {
  "top": "marginTop",
  "left": "marginLeft",
  "right": "marginRight",
  "bottom": "marginBottom",
};

const SidebarShiftedContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "sidebarOpen" &&
    prop !== "sidebarAnchor" &&
    prop !== "sidebarSize",
})(
  ({ theme, sidebarOpen, sidebarAnchor, sidebarSize }) => {
    if (useResponsiveQuery().isSidebarTemporary) {
      return {};
    }

    return {
      [marginAnchors[sidebarAnchor]]: sidebarOpen ? `${sidebarSize}px` : 0,
      ...(sidebarOpen ? {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      } : {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }),
    };
  },
);

export default SidebarShiftedContainer;
