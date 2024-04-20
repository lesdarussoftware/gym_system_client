import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./providers/AuthProvider";

import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ErrorPage } from "./pages/ErrorPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/gym-system">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
