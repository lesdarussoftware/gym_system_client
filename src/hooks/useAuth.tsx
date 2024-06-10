import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../providers/AuthProvider";
import { useQuery } from "./useQuery";

import { LOGIN_URL, LOGOUT_URL } from "../config/urls";

export function useAuth() {

    const { auth, setAuth } = useContext(AuthContext);
    const { handleQuery } = useQuery();
    const navigate = useNavigate();

    async function login(credentials: { username: string; password: string; }) {
        const { status, data } = await handleQuery({
            url: LOGIN_URL,
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        return { status, data };
    }

    const handleLogout = () => {
        handleQuery({
            url: LOGOUT_URL,
            method: 'POST',
            token: auth?.refresh_token
        });
        localStorage.removeItem('auth_lesdagym');
        setAuth(null);
        navigate('/');
    }

    return { login, handleLogout }
}