import { useContext } from "react";
import { Box } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { Header } from "../components/common/Header";
import { LoginForm } from "../components/common/LoginForm";

export function LicensePage() {

    const { auth } = useContext(AuthContext);

    return (
        <>
            {auth ?
                <>
                    <Header />
                    <Box sx={{ padding: 2 }}>
                        
                    </Box>
                </> :
                <LoginForm />
            }
        </>
    );
}