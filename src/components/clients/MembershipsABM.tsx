/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale/es';
import { format } from "date-fns";

import { Client, DataContext } from "../../providers/DataProvider";
import { useClients } from "../../hooks/useClients";
import { useForm } from "../../hooks/useForm";

import { DataGrid } from "../DataGrid/DataGrid";
import { ModalComponent } from "../common/ModalComponent";
import { MembershipDetails } from "./MembershipDetails";

import { DELETE, EDIT, NEW, VIEW_MEMBERSHIP_DETAILS } from "../../config/openTypes";
import { getNumberInputAbsValue } from "../../helpers/math";
import { membershipIsActive } from "../../helpers/membership";

type MembershipsAMBPRops = {
    client: Client;
}

export function MemebershipsABM({ client }: MembershipsAMBPRops) {

    const { state } = useContext(DataContext);
    const { open, setOpen, handleClose, handleSubmitMembership, handleDeleteMembership } = useClients();
    const { formData, setFormData, reset, handleChange, validate, setDisabled, errors, disabled } = useForm({
        defaultData: {
            id: '',
            client_id: client.id,
            start: new Date(Date.now()),
            duration: 30,
            price: 0,
            limit: 12,
            gym_hash: ''
        },
        rules: {
            start: { required: true },
            duration: { required: true },
            limit: { required: true },
            price: { required: true }
        }
    });

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N° registro',
            accessor: 'id'
        },
        {
            id: 'price',
            numeric: false,
            disablePadding: true,
            label: 'Precio',
            accessor: (row: { price: number; }) => `$${row.price.toFixed(2)}`
        },
        {
            id: 'start',
            numeric: false,
            disablePadding: true,
            label: 'Fecha inicio',
            accessor: (row: { start: any; }) => format(new Date(row.start), 'dd-MM-yy')
        },
        {
            id: 'duration',
            numeric: false,
            disablePadding: true,
            label: 'Fecha vencimiento',
            accessor: 'duration'
        },
        {
            id: 'limit',
            numeric: false,
            disablePadding: true,
            label: 'Límite de visitas',
            accessor: 'limit'
        }
    ]

    return (
        <DataGrid
            headCells={headCells}
            rows={state.clients.find(c => c.id === client.id)!.memberships.filter(m => !membershipIsActive(m))}
            setFormData={setFormData}
            setOpen={setOpen}
            showMembershipDetails
        >
            <ModalComponent
                open={open === NEW || open === EDIT}
                onClose={() => handleClose(reset)}
            >
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    {open === NEW && 'Registrar nueva membresía'}
                    {open === EDIT && `Editar membresía #${formData.id}`}
                </Typography>
                <form onChange={handleChange} onSubmit={(e) => handleSubmitMembership(
                    e,
                    validate,
                    formData,
                    setDisabled,
                    reset
                )}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <FormControl>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DatePicker
                                    label="Fecha de inicio"
                                    value={new Date(formData.start)}
                                    onChange={value => handleChange({
                                        target: {
                                            name: 'date',
                                            value: new Date(value!.toISOString())
                                        }
                                    })}
                                />
                            </LocalizationProvider>
                            {errors.date?.type === 'required' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * La fecha es requerida.
                                </Typography>
                            }
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="price">Precio</InputLabel>
                            <Input
                                id="price"
                                type="number"
                                name="price"
                                value={getNumberInputAbsValue(+formData.price, 0, 99999999999)}
                            />
                            {errors.price?.type === 'required' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El precio es requerido.
                                </Typography>
                            }
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="duration">Duración (días)</InputLabel>
                            <Input
                                id="duration"
                                type="number"
                                name="duration"
                                value={getNumberInputAbsValue(+formData.duration, 1, 99999999999)}
                            />
                            {errors.duration?.type === 'required' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * La duración es requerida.
                                </Typography>
                            }
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="duration">Límite de visitas</InputLabel>
                            <Input
                                id="limit"
                                type="number"
                                name="limit"
                                value={getNumberInputAbsValue(+formData.limit, 1, 99999999999)}
                            />
                            {errors.limit?.type === 'required' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El límite de visitas es requerido.
                                </Typography>
                            }
                        </FormControl>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                type="button"
                                variant="outlined"
                                sx={{
                                    width: '50%',
                                    margin: '0 auto',
                                    marginTop: 1
                                }}
                                onClick={() => handleClose(reset)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    width: '50%',
                                    margin: '0 auto',
                                    marginTop: 1
                                }}
                                disabled={disabled}
                            >
                                Guardar
                            </Button>
                        </Box>
                    </Box>
                </form>
            </ModalComponent>
            <ModalComponent
                open={open === DELETE}
                onClose={() => handleClose(reset)}
            >
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                    {`¿Desea borrar el registro de la membresía #${formData.id}?`}
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
                        onClick={() => handleClose(reset)}
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
                        disabled={disabled}
                        onClick={() => handleDeleteMembership(formData, reset, setDisabled)}
                    >
                        Confirmar
                    </Button>
                </Box>
            </ModalComponent>
            <ModalComponent
                open={open === VIEW_MEMBERSHIP_DETAILS}
                onClose={() => handleClose(reset)}
            >
                <MembershipDetails
                    membership={state.clients.find(c => c.id === client.id)!.memberships
                        .find(m => m.id === formData.id)!
                    }
                />
                <Box sx={{ marginTop: 1, display: 'flex', justifyContent: 'end' }}>
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={() => handleClose(reset)}
                    >
                        Cerrar
                    </Button>
                </Box>
            </ModalComponent>
        </DataGrid>
    );
}