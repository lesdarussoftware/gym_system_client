import { useContext } from "react";

import { AuthContext } from "../providers/AuthProvider";
import { STATUS_CODES } from "../config/statusCodes";
import { STATUS_MESSAGES } from "../config/statusMessages";
import { REFRESH_URL } from "../config/urls";

type QueryProps = {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: string;
    token?: string;
}

export function useQuery() {

    const { auth, setAuth } = useContext(AuthContext);

    async function handleQuery({ url, method = 'GET', body, token }: QueryProps) {
        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token ?? auth?.access_token}`
            },
            body
        });
        const status = res.status;
        const data = await res.json();
        if (status === STATUS_CODES.OK) {
            return { status, data }
        }
        if (status === STATUS_CODES.UNAUTHORIZED && data.message === STATUS_MESSAGES.INVALID_TOKEN) {
            const refreshQuery = await fetch(REFRESH_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth?.refresh_token}`
                }
            });
            const refreshStatus = refreshQuery.status;
            const refreshData = await refreshQuery.json();
            if (refreshStatus === STATUS_CODES.OK) {
                setAuth({
                    access_token: refreshData.access_token,
                    refresh_token: auth!.refresh_token,
                    me: auth!.me
                });
                localStorage.setItem('auth', JSON.stringify({
                    access_token: refreshData.access_token,
                    refresh_token: auth!.refresh_token,
                    me: auth!.me
                }));
                return handleQuery({ url, method, body, token: refreshData.access_token });
            }
            if (refreshStatus === STATUS_CODES.UNAUTHORIZED &&
                (refreshData.message === STATUS_MESSAGES.INVALID_TOKEN ||
                    refreshData.message === STATUS_MESSAGES.TOKEN_REVOKED)) {
                setAuth(null);
                localStorage.removeItem('auth');
                console.log('ABRIR MODAL DE LOGIN');
                return { status: refreshStatus, data: refreshData };
            } else {
                console.log({ refreshStatus, refreshData })
                return { status: refreshStatus, data: refreshData };
            }
        } else {
            console.log({ status, data })
            return { status, data };
        }
    }

    return { handleQuery }
}