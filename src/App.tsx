import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import { Theme, createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";

import { AuthProvider } from "./providers/AuthProvider";
import { DataProvider } from "./providers/DataProvider";
import { MessageProvider } from "./providers/MessageProvider";
import { HandleClientProvider } from "./providers/HandleClientProvider";
import { useThemes } from "./hooks/useThemes";

import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ClientsPage } from "./pages/ClientsPage";
import { SchedulesPage } from "./pages/SchedulesPage";
import { ABMPage } from "./pages/ABMPage";
import { ErrorPage } from "./pages/ErrorPage";

import { DARK, LIGHT } from "./config/themes";

export const ThemeContext = createContext({
  theme: {
    palette: {
      primary: {
        main: '#FFD700',
      }
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTheme: (theme: Theme) => { },
});

function App() {

  const { themes } = useThemes();

  const [theme, setTheme] = useState<Theme>(createTheme({
    palette: {
      primary: {
        main: '#FFD700',
      }
    }
  }));

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const defaultTheme = darkModeMediaQuery.matches ? DARK : LIGHT;
    if (defaultTheme === DARK) {
      const newTheme = createTheme(themes[defaultTheme]);
      setTheme(newTheme);
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <DataProvider>
            <MessageProvider>
              <HandleClientProvider>
                <CssBaseline />
                <BrowserRouter basename="/gym-system">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/clientes" element={<ClientsPage />} />
                    <Route path="/horarios" element={<SchedulesPage />} />
                    <Route path="/abm" element={<ABMPage />} />
                    <Route path="*" element={<ErrorPage />} />
                  </Routes>
                </BrowserRouter>
              </HandleClientProvider>
            </MessageProvider>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
