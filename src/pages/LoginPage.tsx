import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";

import { LoginForm } from "../components/common/LoginForm";

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
                <Typography variant="h2" sx={{ color: '#000' }}>
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