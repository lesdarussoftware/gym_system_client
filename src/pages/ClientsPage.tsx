import { useContext } from "react";
import { Box, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { useClasses } from "../hooks/useClasses";

import { Header } from "../components/common/Header";
import { LoginForm } from "../components/common/LoginForm";
import { ClientsABM } from "../components/clients/ClientsABM";

export function ClientsPage() {

    const { auth } = useContext(AuthContext);
    useClasses();

    return (
        <>
            {auth ?
                <>
                    <Header />
                    <Box sx={{ p: 2 }}>
                        <ClientsABM />
                    </Box>
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