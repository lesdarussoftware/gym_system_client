import { useState } from 'react';
import Typography from '@mui/material/Typography';

import { Accordion, AccordionDetails, AccordionSummary } from '../common/MUIAccordion';
import { ClientsABM } from './ClientsABM';

import { MAIN_COLOR } from '../../config/colors';

export function AllClientsAccordion() {

    const [expanded, setExpanded] = useState<string | false>('panel1');

    const handleChange =
        (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
        };

    return (
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" sx={{ backgroundColor: MAIN_COLOR }}>
                <Typography color="#fff">Lista de clientes</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <ClientsABM />
            </AccordionDetails>
        </Accordion>
    );
}