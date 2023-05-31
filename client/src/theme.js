import { createContext, useMemo, useState } from "react";
import { createTheme } from "@mui/material";

export const ColorModeContext = createContext({
  toggleColorMode: () => {
    // By default, this context shouldn't be able to do anything: its purpose is to
    // toggle the currently selected palette, which is declared as a local variable
    // in `useColorMode` and must therefore be placed in a closure. This empty function
    // merely ensures that the context will not crash the application if not provided
    // with a specific color mode.
  },
});

export const useColorMode = () => {
  const [mode, setMode] = useState("light");
  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode(prevState => (prevState === "dark") ? "light" : "dark");
    },
  }), []);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      ...(mode === "light" ? {
          primary: {
            main: "#245ec2",
          },
          background: {
            default: "#faf9f8",
          },
        } : {
          // Dark theme looks fine by default.
        }
      ),
    },

    width: {
      navigationDrawer: 290,
      detailsDrawer: 360,
    },
  }), [mode]);

  return [theme, colorMode];
};
