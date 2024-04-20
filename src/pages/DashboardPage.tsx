import { useContext, useEffect } from "react";
import { Box } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { LoginForm } from "../components/LoginForm";
import { useQuery } from "../hooks/useQuery";

import { GYM_URL } from "../config/urls";

export function DashboardPage() {

    const { auth } = useContext(AuthContext);
    const { handleQuery } = useQuery();

    useEffect(() => {
        (async () => {
            const res = await handleQuery({ url: GYM_URL });
            console.log(res)
        })()
    }, [auth])

    return (
        <>
            {auth ?
                <Box>
                    dashboard
                </Box> :
                <LoginForm />
            }
        </>
    );
}