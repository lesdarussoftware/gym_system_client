import { useState } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale/es';

import { Membership } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { useMemberships } from "../../hooks/useMemberships";
import { STATUS_CODES } from "../../config/statusCodes";
import { ModalComponent } from "../common/ModalComponent";
import { DELETE } from "../../config/openTypes";

type HandleVisitsProps = {
    visits: any;
    classes: any;
    membership: Membership;
}

export function HandleVisits({
    visits,
    classes,
    membership
}: HandleVisitsProps) {

    const { addVisit, removeVisit } = useMemberships();
    const { formData, setFormData, handleChange } = useForm({
        defaultData: { id: '', date: new Date(Date.now()), membership_class_id: '' },
        rules: { date: { required: true } }
    });
    const [open, setOpen] = useState<string | null>(null);

    const handleSubmit = async () => {
        const { status } = await addVisit({
            date: formData.date,
            membership_class_id: formData.membership_class_id,
            membership_id: membership.id,
            client_id: membership.client_id
        });
        if (status === STATUS_CODES.CREATED) {
            handleReset();
        }
    }

    const handleReset = () => {
        setFormData({ id: '', date: new Date(Date.now()), membership_class_id: '' })
        setOpen(null)
    }

    return (
        <>
            <Box sx={{ width: '20%', borderRadius: 1, boxShadow: '3px 3px 5px gray', padding: 1 }}>
                <Typography variant="h6">
                    Historial
                </Typography>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {visits.map((v: any, idx: number) => {
                        return (
                            <li key={idx} style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                <p>{idx + 1}</p>
                                <p>{v.class}</p>
                                <p>{v.date}</p>
                                <p>
                                    <Tooltip title="Eliminar" onClick={() => {
                                        setOpen(DELETE);
                                        setFormData({
                                            ...formData,
                                            id: v.id,
                                            membership_class_id: v.membership_class_id
                                        });
                                    }}>
                                        <IconButton>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </p>
                            </li>
                        );
                    })}
                </ul>
            </Box>
            <Box sx={{ width: '35%', borderRadius: 1, boxShadow: '3px 3px 5px gray', padding: 1 }}>
                <Typography variant="h6">
                    Registrar nueva visita
                </Typography>
                <Box sx={{ margin: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DatePicker
                            label="Fecha"
                            value={new Date(formData.date)}
                            onChange={value => handleChange({
                                target: {
                                    name: 'date',
                                    value: new Date(value!.toISOString())
                                }
                            })}
                        />
                    </LocalizationProvider>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {classes.map((c: any) => {
                        return (
                            <Box
                                key={c.id}
                                sx={{
                                    border: '1px solid black',
                                    backgroundColor: '#fff',
                                    width: 80,
                                    height: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 1,
                                    gap: 1,
                                    transition: '100ms all',
                                    transform: formData.membership_class_id === c.id ? 'scale(1.1)' : '',
                                    ':hover': {
                                        cursor: 'pointer'
                                    }
                                }}
                                onClick={() => handleChange({
                                    target: {
                                        name: 'membership_class_id',
                                        value: c.id
                                    }
                                })}
                            >
                                <Typography variant="body1">
                                    {c.name}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, width: '15%' }}>
                <Button
                    variant="contained"
                    disabled={formData.membership_class_id === ''}
                    onClick={handleSubmit}
                >
                    Confirmar
                </Button>
                <Button
                    variant="outlined"
                    disabled={formData.membership_class_id === ''}
                    onClick={handleReset}
                >
                    Cancelar
                </Button>
            </Box>
            <ModalComponent
                open={open === DELETE}
                onClose={() => handleReset()}
            >
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                    ¿Desea borrar esta visita?
                </Typography>
                <p style={{ textAlign: 'center' }}>Los datos no podrán ser recuperados.</p>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        type="button"
                        variant="outlined"
                        sx={{
                            width: '50%',
                            margin: '0 auto',
                            marginTop: 1
                        }}
                        onClick={() => handleReset()}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="contained"
                        sx={{
                            width: '50%',
                            margin: '0 auto',
                            marginTop: 1
                        }}
                        onClick={() => {
                            removeVisit({
                                id: formData.id,
                                membership_class_id: formData.membership_class_id,
                                membership_id: membership.id,
                                client_id: membership.client_id
                            });
                            handleReset();
                        }}
                    >
                        Confirmar
                    </Button>
                </Box>
            </ModalComponent>
        </>
    );
}