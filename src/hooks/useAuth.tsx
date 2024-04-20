import { useContext } from "react";

import { AuthContext } from "../providers/AuthProvider";

import { LOGIN_URL, LOGOUT_URL } from "../config/urls";

export function useAuth() {

    const { auth } = useContext(AuthContext);

    async function login(credentials: { username: string; password: string; }) {
        const res = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });
        const data = await res.json();
        const status = res.status;
        return { status, data };
    }

    async function logout() {
        const res = await fetch(LOGOUT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.refresh_token}`
            }
        });
        const data = await res.json();
        const status = res.status;
        return { status, data };
    }

    return { login, logout }

}