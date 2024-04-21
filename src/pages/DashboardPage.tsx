import { useContext } from "react";
import { Box } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";

import { LoginForm } from "../components/LoginForm";
import { ActionAreaCard } from "../components/ActionAreaCard";
import { Header } from "../components/Header";

export function DashboardPage() {

    const { auth } = useContext(AuthContext);

    return (
        <>
            {auth ?
                <>
                    <Header />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, alignItems: 'center' }}>
                            <ActionAreaCard
                                title="Clientes"
                                text="Administre los clientes de su gimnasio."
                                onClick="clientes"
                                />
                            <ActionAreaCard
                                title="Usuarios"
                                text="Administre el personal administrativo."
                                onClick="usuarios"
                                />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, alignItems: 'center' }}>
                            <ActionAreaCard
                                title="Profesores"
                                text="Registre el personal docente."
                                onClick="profesores"
                                />
                            <ActionAreaCard
                                title="Clases"
                                text="Administre los servicios que brinda."
                                onClick="clases"
                            />
                        </Box>
                    </Box>
                </> :
                <LoginForm />
            }
        </>
    );
}