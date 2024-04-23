import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { LoginForm } from "../components/common/LoginForm";
import { useContext, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";

export function LoginPage() {

    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        if (auth) navigate('/clientes');
    }, [auth])

    return (
        <Box>
            <LoginForm submitAction={() => navigate('/clientes')} />
        </Box>
    );
}