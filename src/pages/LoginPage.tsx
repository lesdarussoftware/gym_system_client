import { Box, Button, Typography } from "@mui/material";
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
        <Box sx={{ padding: 2 }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '90vh',
                flexDirection: 'column',
                gap: 3
            }}>
                <Typography variant="h2">
                    Lesda Gym
                </Typography>
                <LoginForm submitAction={() => navigate('/clientes')} />
                <Button
                    type="button"
                    variant="outlined"
                    sx={{ display: 'block', margin: '0 auto', marginTop: 3 }}
                    onClick={() => navigate('/')}
                >
                    Volver al inicio
                </Button>
            </Box>
        </Box>
    );
}