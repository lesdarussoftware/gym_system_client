import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider } from "./providers/AuthProvider";
import { DataProvider } from "./providers/DataProvider";
import { MessageProvider } from "./providers/MessageProvider";
import { HandleClientProvider } from "./providers/HandleClientProvider";

import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ClientsPage } from "./pages/ClientsPage";
import { SchedulesPage } from "./pages/SchedulesPage";
import { ABMPage } from "./pages/ABMPage";
import { ProfilePage } from "./pages/ProfilePage";
import { LicensePage } from "./pages/LicensePage";
import { ErrorPage } from "./pages/ErrorPage";

import { MAIN_COLOR } from "./config/colors";

function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: MAIN_COLOR
      },
    },
  });


  return (
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
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/license" element={<LicensePage />} />
                  <Route path="*" element={<ErrorPage />} />
                </Routes>
              </BrowserRouter>
            </HandleClientProvider>
          </MessageProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
