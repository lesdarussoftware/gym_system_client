import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./providers/AuthProvider";
import { DataProvider } from "./providers/DataProvider";
import { HandleClientProvider } from "./providers/HandleClientProvider";

import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { ErrorPage } from "./pages/ErrorPage";

function App() {
  return (
    <AuthProvider>
      <DataProvider>
          <HandleClientProvider>
            <BrowserRouter basename="/gym-system">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </BrowserRouter>
          </HandleClientProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
