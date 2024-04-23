import { BrowserRouter, Route, Routes } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';

import { AuthProvider } from "./providers/AuthProvider";
import { DataProvider } from "./providers/DataProvider";
import { MessageProvider } from "./providers/MessageProvider";

import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ClientsPage } from "./pages/ClientsPage";
import { ABMPage } from "./pages/ABMPage";
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
              <Route path="/clientes" element={<ClientsPage />} />
              <Route path="/abm" element={<ABMPage />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </BrowserRouter>
        </MessageProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
