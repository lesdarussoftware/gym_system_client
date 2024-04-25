import { Box, Button, Typography } from "@mui/material";

import { Membership } from "../../providers/DataProvider";
import { format } from "date-fns";

type VisitRegisterProps = {
    membership: Membership;
}

export function VisitRegister({ membership }: VisitRegisterProps) {

    const classes = membership.classes.map(c => ({
        id: c.id,
        name: c.class.name
    }));
    const visits = membership.classes.flatMap(c => c.visits).map(v => {
        const currClass = classes.find(c => c.id === v.membership_class_id)!
        return {
            class: currClass.name,
            date: format(new Date(v.date), 'dd-MM-yy')
        }
    });

    return (
        <>
            <Typography variant="h5" marginBottom={2}>
                Registrar nueva visita
            </Typography>
            <Box sx={{ display: 'flex', gap: 5 }}>
                <Box sx={{ border: '1px solid black', width: '40%' }}>
                    <Typography variant="h6">
                        Historial {`${visits.length}/${membership.limit}`}
                    </Typography>
                    <ul>
                        {visits.map(v => {
                            return (
                                <li>
                                    <p>{v.class}</p>
                                    <p>{v.date}</p>
                                </li>
                            );
                        })}
                    </ul>
                </Box>
                <Box sx={{ border: '1px solid black', width: '40%' }}>
                    <Typography variant="h6">
                        Seleccione clase
                    </Typography>
                    {classes.map(c => {
                        return (
                            <Box>
                                {c.name}
                            </Box>
                        );
                    })}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, width: '20%' }}>
                    <Button variant="contained">
                        Confirmar
                    </Button>
                    <Button variant="outlined">
                        Cancelar
                    </Button>
                </Box>
            </Box>
        </>
    );
}