import { createContext, useState, ReactNode } from "react";

import { ModalComponent } from "../components/common/ModalComponent";
import { LoginForm } from "../components/common/LoginForm";
import { Typography } from "@mui/material";

interface AuthData {
    access_token: string;
    refresh_token: string;
    me: {
        id: number;
        username: string;
        role: string;
        first_name: string;
        last_name: string;
        gym: {
            hash: string;
            name: string;
            next_deadline: Date;
        }
    }
}

interface AuthContextType {
    auth: AuthData | null;
    setAuth: (auth: AuthData | null) => void;
    openModal: boolean;
    setOpenModal: (openModal: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
    auth: null,
    setAuth: () => { },
    openModal: false,
    setOpenModal: () => { }
});

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {

    const [auth, setAuth] = useState<AuthData | null>(
        localStorage.getItem("auth_lesdagym")
            ? JSON.parse(localStorage.getItem("auth_lesdagym")!)
            : null
    );
    const [openModal, setOpenModal] = useState<boolean>(false);

    return (
        <AuthContext.Provider value={{ auth, setAuth, openModal, setOpenModal }}>
            <ModalComponent open={openModal} onClose={() => setOpenModal(false)}>
                <Typography variant="h6" sx={{ color: '#000' }} align="center">
                    Tu sesión expiró. Por favor ingresa de nuevo tu usuario y contraseña
                </Typography>
                <LoginForm />
            </ModalComponent>
            {children}
        </AuthContext.Provider>
    );
}
