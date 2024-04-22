import { useContext } from "react";
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";

import { DataContext } from "../providers/DataProvider";
import { useForm } from "../hooks/useForm";
import { useClients } from "../hooks/useClients";

import { DataGrid } from "../components/DataGrid/DataGrid";
import { ModalComponent } from '../components/common/ModalComponent'
import { Header } from "../components/common/Header";

import {NEW, EDIT, DELETE} from '../config/openTypes'

export function ClientsPage() {

    const { state } = useContext(DataContext);
    const { formData, setFormData, handleChange, validate, errors, disabled, setDisabled, reset } = useForm({
        defaultData: { id: '', first_name: '', last_name: '', dni: '', email: '', phone: '', gym_hash: '' },
        rules: {
            first_name: { required: true, maxLength: 55 },
            last_name: { required: true, maxLength: 55 },
            dni: { required: true, },
            email: { required: true, maxLength: 55 },
            phone: { required: true, maxLength: 55 }
        }
    })
    const { handleSubmit, handleClose, handleDelete, open, setOpen } = useClients();

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N° registro',
            accessor: 'id'
        },
        {
            id: 'first_name',
            numeric: false,
            disablePadding: true,
            label: 'Nombre',
            accessor: 'first_name'
        },
        {
            id: 'last_name',
            numeric: false,
            disablePadding: true,
            label: 'Apellido',
            accessor: 'last_name'
        },
        {
            id: 'dni',
            numeric: false,
            disablePadding: true,
            label: 'DNI',
            accessor: 'dni'
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: true,
            label: 'Email',
            accessor: 'email'
        },
        {
            id: 'phone',
            numeric: false,
            disablePadding: true,
            label: 'Teléfono',
            accessor: 'phone'
        }
    ]

    return (
        <>
            <Header showOptions />
            <Box sx={{ padding: 2 }}>
                <DataGrid
                    headCells={headCells}
                    rows={state.clients}
                    setOpen={setOpen}
                    setFormData={setFormData}
                >
                    <ModalComponent
                        open={open === NEW || open === EDIT}
                        onClose={() => handleClose(reset)}
                    >
                        <Typography variant="h6" sx={{ marginBottom: 1 }}>
                            {open === NEW && 'Registrar nuevo cliente'}
                            {open === EDIT && `Editar cliente #${formData.id}`}
                        </Typography>
                        <form onChange={handleChange} onSubmit={(e) => handleSubmit(
                            e,
                            validate,
                            formData,
                            setDisabled,
                            reset
                        )}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <FormControl>
                                    <InputLabel htmlFor="first_name">Nombre</InputLabel>
                                    <Input id="first_name" type="text" name="first_name" value={formData.first_name} />
                                    {errors.first_name?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El nombre es requerido.
                                        </Typography>
                                    }
                                    {errors.first_name?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El nombre es demasiado largo.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor="last_name">Apellido</InputLabel>
                                    <Input id="last_name" type="text" name="last_name" value={formData.last_name} />
                                    {errors.last_name?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El apellido es requerido.
                                        </Typography>
                                    }
                                    {errors.last_name?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El apellido es demasiado largo.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor="dni">DNI</InputLabel>
                                    <Input id="dni" type="text" name="dni" value={formData.dni} />
                                    {errors.dni?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El dni es requerido.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor="email">Email</InputLabel>
                                    <Input id="email" type="email" name="email" value={formData.email} />
                                    {errors.email?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El email es requerido.
                                        </Typography>
                                    }
                                    {errors.email?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El email es demasiado largo.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl>
                                    <InputLabel htmlFor="phone">Teléfono</InputLabel>
                                    <Input id="phone" type="number" name="phone" value={formData.phone} />
                                    {errors.phone?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El teléfono es requerido.
                                        </Typography>
                                    }
                                    {errors.phone?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El teléfono es demasiado largo.
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
                            {`¿Desea borrar el registro del cliente ${formData.first_name + ' ' + formData.last_name} (#${formData.id})?`}
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
                                onClick={() => handleDelete(formData, reset, setDisabled)}
                            >
                                Confirmar
                            </Button>
                        </Box>
                    </ModalComponent>
                </DataGrid>
            </Box>
        </>
    );
}