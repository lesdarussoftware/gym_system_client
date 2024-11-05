import { useState } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale/es';

import { Membership } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { useMemberships } from "../../hooks/useMemberships";

import { ModalComponent } from "../common/ModalComponent";

import { STATUS_CODES } from "../../config/statusCodes";
import { DELETE } from "../../config/openTypes";
import { MAIN_COLOR } from "../../config/colors";

type HandleVisitsProps = {
    visits: any;
    classes: any;
    membership: Membership;
}

export function HandleVisits({ visits, classes, membership }: HandleVisitsProps) {

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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: { xs: 2, md: 0 } }}>
            <Box sx={{ width: { xs: '100%', md: '49%' }, borderRadius: 1, border: '1px solid #BDBDBD', p: 1, color: '#000' }}>
                <Typography variant="h6">
                    Historial
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableBody>
                            {visits.map((v: any, idx: number) => {
                                return (
                                    <TableRow key={idx}>
                                        <TableCell align="center" sx={{ p: 0 }}>#{idx + 1}</TableCell>
                                        <TableCell align="center" sx={{ p: 0 }}>{v.class}</TableCell>
                                        <TableCell align="center" sx={{ p: 0 }}>{v.date}</TableCell>
                                        <TableCell align="center" sx={{ p: 0 }}>
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
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box sx={{ width: { xs: '100%', md: '49%' }, borderRadius: 1, border: '1px solid #BDBDBD', p: 1 }}>
                <Typography variant="h6" sx={{ color: '#000' }}>
                    Registrar nuevo ingreso
                </Typography>
                <Box sx={{ m: 2, p: 1 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DatePicker
                            label="Fecha"
                            sx={{ backgroundColor: '#fff !important', borderRadius: 1 }}
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
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'start' }}>
                    {classes.map((c: any) => {
                        return (
                            <Button
                                type="button"
                                variant={formData.membership_class_id === c.id ? 'contained' : 'outlined'}
                                sx={{ color: formData.membership_class_id === c.id ? '#FFF' : MAIN_COLOR }}
                                onClick={() => handleChange({
                                    target: {
                                        name: 'membership_class_id',
                                        value: c.id
                                    }
                                })}
                            >
                                {c.name}
                            </Button>
                        );
                    })}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
                    <Button
                        variant="contained"
                        disabled={formData.membership_class_id === ''}
                        sx={{
                            color: '#fff',
                            ":disabled": {
                                color: '#A6A6A6',
                                backgroundColor: '#E0E0E0'
                            }
                        }}
                        onClick={handleSubmit}
                    >
                        Confirmar
                    </Button>
                    <Button
                        variant="outlined"
                        disabled={formData.membership_class_id === ''}
                        sx={{
                            ":disabled": {
                                color: "BDBDD0",
                                backgroundColor: "#fff",
                                border: "1px solid #E0E0E0"
                            }
                        }}
                        onClick={handleReset}
                    >
                        Cancelar
                    </Button>
                </Box>
            </Box>
            <ModalComponent
                open={open === DELETE}
                onClose={() => handleReset()}
            >
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                    ¿Desea borrar este ingreso?
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
                            marginTop: 1,
                            color: '#fff'
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
        </Box>
    );
}