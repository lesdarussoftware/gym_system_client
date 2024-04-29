import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SecuritySharpIcon from '@mui/icons-material/SecuritySharp';
import MonetizationOnSharpIcon from '@mui/icons-material/MonetizationOnSharp';
import MarkEmailReadSharpIcon from '@mui/icons-material/MarkEmailReadSharp';
import SupportAgentSharpIcon from '@mui/icons-material/SupportAgentSharp';

import { Footer } from "../components/common/Footer";

export function HomePage() {

    const navigate = useNavigate();

    const featureContainerStyles = {
        width: 200,
        height: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 1
    };

    const featureContainerTextStyles = {
        textAlign: 'center'
    };

    const iconStyles = {
        flex: 1,
        transform: 'scale(3)',
        // color: '#FFD700'
    };

    return (
        <Box sx={{ padding: 5, height: '100vh' }}>
            <Box sx={{ marginBottom: 3 }}>
                <Typography variant="h1">
                    Lesda Gym
                </Typography>
                <Typography variant="h2">
                    La mejor experiencia para tu gimnasio
                </Typography>
            </Box>
            <Button
                type="button"
                variant="contained"
                sx={{ display: 'block', margin: '0 auto', marginTop: 7, marginBottom: 1 }}
                onClick={() => navigate('/login')}
            >
                Iniciar sesión
            </Button>
            <Box sx={{
                height: 250,
                padding: 1,
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: '80%',
                margin: '0 auto'
            }}>
                <Box sx={featureContainerStyles}>
                    <SecuritySharpIcon sx={iconStyles} />
                    <Typography variant="h6" sx={featureContainerTextStyles}>
                        Seguridad y confidencialidad
                    </Typography>
                </Box>
                <Box sx={featureContainerStyles}>
                    <MonetizationOnSharpIcon sx={iconStyles} />
                    <Typography variant="h6" sx={featureContainerTextStyles}>
                        Uso por licencia o propiedad
                    </Typography>
                </Box>
                <Box sx={featureContainerStyles}>
                    <MarkEmailReadSharpIcon sx={iconStyles} />
                    <Typography variant="h6" sx={featureContainerTextStyles}>
                        Notificaciones por email
                    </Typography>
                </Box>
                <Box sx={featureContainerStyles}>
                    <SupportAgentSharpIcon sx={iconStyles} />
                    <Typography variant="h6" sx={featureContainerTextStyles}>
                        Soporte permanente 24/7
                    </Typography>
                </Box>
            </Box>
            <Footer />
        </Box>
    );
}