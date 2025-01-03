import { useContext, useEffect } from "react";
import { Box, Button, FormControl, Input, InputLabel, TextField, Typography } from "@mui/material";

import { Client, DataContext } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { useClients } from "../../hooks/useClients";

import { ModalComponent } from '../common/ModalComponent'
import { DataGridBackend } from "../DataGrid/DataGridBackend";

import { NEW, EDIT, DELETE } from '../../config/openTypes'
import { CLIENT } from "../../config/roles";

export function ClientsABM() {

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
    const {
        formData: formDataUser,
        handleChange: handleChangeUser,
        validate: validateUser,
        errors: errorsUser,
        disabled: disabledUser,
        setDisabled: setDisabledUser,
        reset: resetUser
    } = useForm({
        defaultData: { username: '', password: '', role: CLIENT, client_id: '' },
        rules: {
            username: { required: true, maxLength: 55 },
            password: { required: true, minLength: 8, maxLength: 255 }
        }
    })
    const {
        handleSubmit,
        handleClose,
        handleDelete,
        open,
        setOpen,
        getClients,
        filter,
        setFilter,
        generateAppUser
    } = useClients();

    useEffect(() => {
        const { page, offset, first_name, last_name, dni, email } = filter
        getClients(`?page=${page}&offset=${offset}&first_name=${first_name}&last_name=${last_name}&dni=${dni}&email=${email}`)
    }, [filter])

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N° registro',
            accessor: (row: Client) => row.id
        },
        {
            id: 'first_name',
            numeric: false,
            disablePadding: true,
            label: 'Nombre',
            accessor: (row: Client) => row.first_name
        },
        {
            id: 'last_name',
            numeric: false,
            disablePadding: true,
            label: 'Apellido',
            accessor: (row: Client) => row.last_name
        },
        {
            id: 'dni',
            numeric: false,
            disablePadding: true,
            label: 'DNI',
            accessor: (row: Client) => row.dni
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: true,
            label: 'Email',
            accessor: (row: Client) => row.email
        },
        {
            id: 'phone',
            numeric: false,
            disablePadding: true,
            label: 'Teléfono',
            accessor: (row: Client) => row.phone
        }
    ]

    return (
        <DataGridBackend
            headCells={headCells}
            rows={state.clients.rows}
            setOpen={setOpen}
            setFormData={setFormData}
            filter={filter}
            setFilter={setFilter}
            count={state.clients.count}
            showCreateAppUser
            showEditAction
            showDeleteAction
            filterComponent={
                <Box sx={{
                    width: { xs: '100%', md: '70%' },
                    display: 'flex',
                    gap: 1,
                    flexWrap: 'wrap',
                    justifyContent: 'space-between'
                }}>
                    <FormControl sx={{ width: { xs: '100%', md: '24%' } }}>
                        <TextField
                            label="Nombre"
                            name="first_name"
                            value={filter.first_name}
                            onChange={e => setFilter({ ...filter, first_name: e.target.value })}
                        />
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', md: '24%' } }}>
                        <TextField
                            label="Apellido"
                            name="last_name"
                            value={filter.last_name}
                            onChange={e => setFilter({ ...filter, last_name: e.target.value })}
                        />
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', md: '24%' } }}>
                        <TextField
                            label="DNI"
                            type="number"
                            name="dni"
                            value={filter.dni}
                            onChange={e => setFilter({ ...filter, dni: e.target.value })}
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', md: '24%' } }}>
                        <TextField
                            label="Email"
                            name="email"
                            value={filter.email}
                            onChange={e => setFilter({ ...filter, email: e.target.value })}
                        />
                    </FormControl>
                </Box>
            }
        >
            <ModalComponent
                open={open === NEW || open === EDIT}
                onClose={() => handleClose(reset)}
            >
                <Typography variant="h6" sx={{ marginBottom: 2, fontSize: { xs: 18, sm: 18, md: 20 } }}>
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
                    <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '50%' }}>
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
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '50%' }}>
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
                        </Box>
                    </Box>
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
                </form>
            </ModalComponent>
            <ModalComponent open={open === 'GENERATE_APP_USER'} onClose={() => handleClose(resetUser)}>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                    Nuevo usuario para aplicación Android
                </Typography>
                <form onChange={handleChangeUser} onSubmit={(e) => generateAppUser(e, validateUser,
                    {
                        ...formDataUser,
                        first_name: formData.first_name,
                        last_name: formData.last_name,
                        email: formData.email,
                        client_id: formData.id
                    },
                    setDisabledUser, resetUser)}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <FormControl>
                            <InputLabel >Nombre</InputLabel>
                            <Input value={formData.first_name} disabled />
                        </FormControl>
                        <FormControl>
                            <InputLabel>Apellido</InputLabel>
                            <Input value={formData.last_name} disabled />
                        </FormControl>
                        <FormControl>
                            <InputLabel>Email</InputLabel>
                            <Input value={formData.email} disabled />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="username">Nombre de usuario</InputLabel>
                            <Input id="username" type="text" name="username" value={formDataUser.username} />
                            {errorsUser.username?.type === 'required' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El nombre de usuario es requerido.
                                </Typography>
                            }
                            {errorsUser.username?.type === 'maxLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El nombre de usuario es demasiado largo.
                                </Typography>
                            }
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="password">Contraseña</InputLabel>
                            <Input id="password" type="password" name="password" value={formDataUser.password} />
                            {errorsUser.password?.type === 'required' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * La contraseña es requerida.
                                </Typography>
                            }
                            {errorsUser.password?.type === 'minLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * La contraseña es demasiado corta.
                                </Typography>
                            }
                            {errorsUser.password?.type === 'maxLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * La contraseña es demasiado larga.
                                </Typography>
                            }
                        </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                        <Button
                            type="button"
                            variant="outlined"
                            sx={{
                                width: '50%',
                                margin: '0 auto',
                                marginTop: 1
                            }}
                            onClick={() => handleClose(resetUser)}
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
                            disabled={disabledUser}
                        >
                            Guardar
                        </Button>
                    </Box>
                </form>
            </ModalComponent>
            <ModalComponent open={open === DELETE} onClose={() => handleClose(reset)}>
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
    );
}