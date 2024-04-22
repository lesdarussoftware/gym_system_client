import { useContext } from "react";
import { Box } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";

import { LoginForm } from "../components/common/LoginForm";
import { ActionAreaCard } from "../components/common/ActionAreaCard";
import { Header } from "../components/common/Header";

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
                                text="Registre clientes y sus visitas al gimnasio."
                                onClick="clientes"
                                />
                            <ActionAreaCard
                                title="Horarios"
                                text="Consulte todas las actividades."
                                onClick="usuarios"
                                />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, alignItems: 'center' }}>
                            <ActionAreaCard
                                title="ABMs"
                                text="Altas, bajas y modificaciones."
                                onClick="abm"
                            />
                        </Box>
                    </Box>
                </> :
                <LoginForm />
            }
        </>
    );
}