import { createContext, useState, ReactNode } from "react";

interface AuthData {
    access_token: string;
    refresh_token: string;
    me: {
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
}

export const AuthContext = createContext<AuthContextType>({
    auth: null,
    setAuth: () => { }
});

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {

    const [auth, setAuth] = useState<AuthData | null>(
        localStorage.getItem("auth")
            ? JSON.parse(localStorage.getItem("auth")!)
            : null
    );

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
}
