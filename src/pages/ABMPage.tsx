import { useContext, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

import { AuthContext } from '../providers/AuthProvider';

import { Accordion, AccordionDetails, AccordionSummary } from '../components/common/MUIAccordion';
import { Header } from "../components/common/Header";
import { ClassesABM } from "../components/ABM/ClassesABM";
import { TeachersABM } from '../components/ABM/TeachersABM';
import { UsersABM } from '../components/ABM/UsersABM';
import { LoginForm } from '../components/common/LoginForm';

export function ABMPage() {

    const { auth } = useContext(AuthContext);
    const [expanded, setExpanded] = useState<string | false>('panel1');

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
        };

    return (
        <>
            {auth ?
                <>
                    <Header />
                    <Box sx={{ padding: 2 }}>
                        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                <Typography sx={{ color: '#000' }}>Clases</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ClassesABM />
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                            <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                                <Typography sx={{ color: '#000' }}>Profesores</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <TeachersABM />
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                            <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                                <Typography sx={{ color: '#000' }}>Usuarios</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <UsersABM />
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </> :
                <LoginForm />
            }
        </>
    );
}