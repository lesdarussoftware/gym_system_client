import { useContext } from "react";
import { Box } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { useClasses } from "../hooks/useClasses";

import { Header } from "../components/common/Header";
import { LoginForm } from "../components/common/LoginForm";
import { AllClientsAccordion } from "../components/clients/AllClientsAccordion";
import { VisitDashboard } from "../components/clients/VisitDashboard";


export function ClientsPage() {

    const { auth } = useContext(AuthContext);
    useClasses();

    return (
        <>
            {auth ?
                <>
                    <Header />
                    <Box sx={{ padding: 2 }}>
                        <Box sx={{ marginBottom: 2 }}>
                            <VisitDashboard />
                        </Box>
                        <AllClientsAccordion />
                    </Box>
                </> :
                <LoginForm />
            }
        </>
    );
}