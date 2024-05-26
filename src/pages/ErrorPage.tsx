import { useContext } from "react";
import { Box, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { Header } from "../components/common/Header";
import { LoginForm } from "../components/common/LoginForm";

export function ErrorPage() {

    const { auth } = useContext(AuthContext);

    return (
        <>
            {auth ?
                <>
                    <Header />
                    <Typography variant="h5" sx={{ padding: 2 }} align="center">
                        Error 404 - Página no encontrada.
                    </Typography>
                </> :
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
                            Iniciar sesión
                        </Typography>
                        <LoginForm />
                    </Box>
                </Box>
            }
        </>
    );
}