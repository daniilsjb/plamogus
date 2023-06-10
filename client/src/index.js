import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";

import { ThemeProvider } from "@mui/material";
import { ColorModeContext, useColorMode } from "./theme";
import CssBaseline from "@mui/material/CssBaseline";

import App from "./App";
import "./index.css";

const client = new QueryClient();

const Providers = ({ children }) => {
  return (
    <QueryClientProvider client={client}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <ThemingProviders>
          {children}
        </ThemingProviders>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};

const ThemingProviders = ({ children }) => {
  const [theme, mode] = useColorMode();
  return (
    <ColorModeContext.Provider value={mode}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Providers>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </Providers>
  </React.StrictMode>,
);
