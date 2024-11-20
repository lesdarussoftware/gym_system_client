import { useContext, useEffect, useMemo, useState } from "react";
import { Autocomplete, Box, Button, FormControl, InputLabel, TextField, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useClients } from "../hooks/useClients";
import { useNotifications, Notification } from "../hooks/useNotifications";

import { Header } from "../components/common/Header";
import { LoginForm } from "../components/common/LoginForm";
import { format } from "date-fns";
import { DataGridBackend } from "../components/DataGrid/DataGridBackend";
import { ModalComponent } from "../components/common/ModalComponent";
import { DELETE, NEW } from "../config/openTypes";
import { useForm } from "../hooks/useForm";

export function NotificationsPage() {

    const { auth } = useContext(AuthContext);
    const { state } = useContext(DataContext);

    const { getClients } = useClients();
    const {
        getNotifications,
        notifications,
        open,
        setOpen,
        filter,
        setFilter,
        handleClose,
        count,
        handleSubmit,
        handleDelete
    } = useNotifications();
    const { formData, setFormData, handleChange, validate, errors, disabled, setDisabled, reset } = useForm({
        defaultData: { id: '', message: '', client_id: '' },
        rules: { message: { required: true, maxLength: 520 }, client_id: { required: true } }
    });

    const [clientId, setClientId] = useState(0);

    useEffect(() => {
        getClients();
    }, []);

    useEffect(() => {
        if (clientId > 0) {
            const { page, offset } = filter
            getNotifications(clientId, `?page=${page}&offset=${offset}`);
        }
    }, [filter, clientId]);

    const headCells = useMemo(() => [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: '#',
            accessor: 'id'
        },
        {
            id: 'message',
            numeric: false,
            disablePadding: false,
            label: 'Mensaje',
            accessor: 'message'
        },
        {
            id: 'is_read',
            numeric: true,
            disablePadding: false,
            label: 'Leído',
            accessor: (row: Notification) => row.is_read ? 'Sí' : 'No'
        },
        {
            id: 'created_at',
            numeric: false,
            disablePadding: false,
            label: 'Fecha creación',
            accessor: (row: Notification) => format(new Date(row.created_at), 'dd/MM/yy')
        }
    ], []);

    return (
        <>
            {auth ?
                <>
                    <Header />
                    <Box sx={{ padding: 2 }}>
                        <DataGridBackend
                            headCells={headCells}
                            rows={notifications}
                            setOpen={setOpen}
                            setFormData={setFormData}
                            filter={filter}
                            setFilter={setFilter}
                            count={count}
                            showDeleteAction
                            filterComponent={
                                <FormControl sx={{ width: '30%' }}>
                                    <Autocomplete
                                        disablePortal
                                        id="client-autocomplete"
                                        options={state.clients.rows.sort()
                                            .map(c => ({ label: `${c.first_name} ${c.last_name}`, id: c?.id }))}
                                        renderInput={(params) => <TextField {...params} label="Seleccione cliente..." />}
                                        noOptionsText="No hay clientes disponibles."
                                        onChange={(_, value) => setClientId(value && value.id.toString().length > 0 ? value.id : 0)}
                                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                    />
                                </FormControl>
                            }
                        >
                            <ModalComponent
                                open={open === NEW}
                                onClose={() => handleClose(reset)}
                                reduceWidth={800}
                            >
                                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                                    {open === NEW && 'Nuevo aviso'}
                                </Typography>
                                <form onSubmit={(e) => handleSubmit(e, validate, formData, setDisabled, reset)}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <FormControl>
                                            <Autocomplete
                                                disablePortal
                                                id="client-autocomplete"
                                                options={state.clients.rows.sort()
                                                    .map(c => ({ label: `${c.first_name} ${c.last_name}`, id: c?.id }))}
                                                renderInput={(params) => <TextField {...params} label="Seleccione cliente..." />}
                                                noOptionsText="No hay clientes disponibles."
                                                onChange={(_, value) => handleChange({
                                                    target: {
                                                        name: 'client_id',
                                                        value: value && value.id.toString().length > 0 ? value.id : ''
                                                    }
                                                })}
                                                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                            />
                                            {errors.client_id?.type === 'required' &&
                                                <Typography variant="caption" color="red" marginTop={1}>
                                                    * El cliente es requerido.
                                                </Typography>
                                            }
                                        </FormControl>
                                        <FormControl>
                                            <InputLabel htmlFor="name">Mensaje</InputLabel>
                                            <textarea
                                                id="name"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                style={{
                                                    width: '100%',
                                                    height: '100px',
                                                    resize: 'none',
                                                    padding: '7px',
                                                    borderRadius: '3px'
                                                }}
                                            />
                                            {errors.message?.type === 'required' &&
                                                <Typography variant="caption" color="red" marginTop={1}>
                                                    * El mensaje es requerido.
                                                </Typography>
                                            }
                                            {errors.message?.type === 'maxLength' &&
                                                <Typography variant="caption" color="red" marginTop={1}>
                                                    * El mensaje es demasiado largo.
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
                                                    marginTop: 1,
                                                    color: '#fff'
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
                                    {`¿Desea borrar el registro del aviso #${formData.id}?`}
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
                                            marginTop: 1,
                                            color: '#fff'
                                        }}
                                        disabled={disabled}
                                        onClick={() => handleDelete(formData, reset, setDisabled)}
                                    >
                                        Confirmar
                                    </Button>
                                </Box>
                            </ModalComponent>
                        </DataGridBackend>
                    </Box>
                </> :
                <Box sx={{ padding: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '90vh',
                        flexDirection: 'column',
                        gap: 3
                    }}>
                        <Typography variant="h2" sx={{ color: '#000' }}>
                            Iniciar sesión
                        </Typography>
                        <LoginForm />
                    </Box>
                </Box>
            }
        </>
    );
}