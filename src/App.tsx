import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider } from "./providers/AuthProvider";
import { DataProvider } from "./providers/DataProvider";
import { MessageProvider } from "./providers/MessageProvider";
import { HandleClientProvider } from "./providers/HandleClientProvider";

import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { IncomesPage } from "./pages/IncomesPage";
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
      <BrowserRouter basename="/gym-system">
        <AuthProvider>
          <DataProvider>
            <MessageProvider>
              <HandleClientProvider>
                <CssBaseline />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/ingresos" element={<IncomesPage />} />
                  <Route path="/clientes" element={<ClientsPage />} />
                  <Route path="/horarios" element={<SchedulesPage />} />
                  <Route path="/abm" element={<ABMPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/license" element={<LicensePage />} />
                  <Route path="*" element={<ErrorPage />} />
                </Routes>
              </HandleClientProvider>
            </MessageProvider>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;