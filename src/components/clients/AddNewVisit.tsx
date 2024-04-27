/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale/es';

import { useForm } from "../../hooks/useForm";

type AddNewVisitProps = {
    visits: any;
    classes: any;
}

export function AddNewVisit({
    visits,
    classes
}: AddNewVisitProps) {

    const { formData, reset, handleChange, setDisabled, disabled } = useForm({
        defaultData: { date: new Date(Date.now()), membership_class_id: '' },
        rules: { date: { required: true } }
    });

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
                                        // setOpen(DELETE);
                                        // setFormData(rows.find((row: { id: number; }) => row.id === selected[0]));
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
                                    width: 80,
                                    height: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 1,
                                    gap: 1
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
                <Button variant="contained">
                    Confirmar
                </Button>
                <Button variant="outlined">
                    Cancelar
                </Button>
            </Box>
        </>
    );
}