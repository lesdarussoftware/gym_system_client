import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";
import { useContext, useState } from "react";

import { DataContext } from "../../providers/DataProvider";
import { MessageContext } from "../../providers/MessageProvider";
import { HandleClientContext } from "../../providers/HandleClientProvider";
import { useForm } from "../../hooks/useForm";

import { MemebershipsABM } from "./MembershipsABM";
import { Accordion, AccordionDetails, AccordionSummary } from "../common/MUIAccordion";
import { ShowCurrentMembership } from "./ShowCurrentMembership";

import { ERROR } from "../../config/messageProviderTypes";

export function VisitDashboard() {

    const { state } = useContext(DataContext);
    const { setSeverity, setMessage, setOpenMessage } = useContext(MessageContext);
    const { client, setClient } = useContext(HandleClientContext);
    const { formData, errors, validate, handleChange, disabled, setDisabled, reset } = useForm({
        defaultData: { dni: '' },
        rules: { dni: { required: true } }
    });
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (validate()) {
            const exists = state.clients.find(c => c.dni === +formData.dni);
            if (exists) {
                setClient(exists);
                reset();
            } else {
                setSeverity(ERROR);
                setMessage('El cliente no existe.');
                setOpenMessage(true);
            }
            setDisabled(false);
        }
    }

    const handleChangeVisibility = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <>
            {client ?
                <>
                    <Button
                        type="button"
                        variant="contained"
                        sx={{ marginBottom: 2 }}
                        onClick={() => setClient(null)}
                    >
                        Buscar nuevo cliente
                    </Button>
                    <Box sx={{ marginBottom: 3, textAlign: 'center' }}>
                        <ShowCurrentMembership client={client} />
                    </Box>
                    <Accordion expanded={expanded === 'panel1'} onChange={handleChangeVisibility('panel1')}>
                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                            <Typography>
                                Membresías vencidas del cliente {`${client.first_name} ${client.last_name}`}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <MemebershipsABM client={client} />
                        </AccordionDetails>
                    </Accordion>
                </> :
                <>
                    <Box textAlign="center">
                        <Typography variant="h5" marginBottom={2}>
                            Ingrese el DNI de un cliente
                        </Typography>
                        <form onChange={handleChange} onSubmit={handleSubmit}>
                            <FormControl>
                                <InputLabel htmlFor="dni">N°</InputLabel>
                                <Input id="dni" type="tel" name="dni" value={formData.dni} />
                                {errors.dni?.type === 'required' &&
                                    <Typography variant="caption" color="red" marginTop={1}>
                                        * El dni es requerido.
                                    </Typography>
                                }
                            </FormControl>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={disabled}
                            >
                                Buscar
                            </Button>
                        </form>
                    </Box>
                </>
            }
        </>
    );
}