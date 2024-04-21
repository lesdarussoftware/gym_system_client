import { BrowserRouter, Route, Routes } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider } from "./providers/AuthProvider";
import { DataProvider } from "./providers/DataProvider";
import { MessageProvider } from "./providers/MessageProvider";

import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ClientsPage } from "./pages/ClientsPage";
import { UsersPage } from "./pages/UsersPage";
import { TeachersPage } from "./pages/TeachersPage";
import { ClassesPage } from "./pages/ClassesPage";
import { ErrorPage } from "./pages/ErrorPage";

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MessageProvider>
          <CssBaseline />
          <BrowserRouter basename="/gym-system">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/clientes" element={<ClientsPage />} />
              <Route path="/usuarios" element={<UsersPage />} />
              <Route path="/profesores" element={<TeachersPage />} />
              <Route path="/clases" element={<ClassesPage />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </BrowserRouter>
        </MessageProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
