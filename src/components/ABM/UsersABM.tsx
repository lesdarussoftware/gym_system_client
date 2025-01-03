import { useContext, useEffect } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";

import { AuthContext } from "../../providers/AuthProvider";
import { DataContext, User } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { useUsers } from "../../hooks/useUsers";

import { ModalComponent } from '../common/ModalComponent'
import { DataGridBackend } from "../DataGrid/DataGridBackend";

import { ADMIN, SUPERUSER, USER } from "../../config/roles";
import { NEW, EDIT, DELETE } from '../../config/openTypes';

export function UsersABM() {

    const { auth } = useContext(AuthContext);
    const { state } = useContext(DataContext);
    const { formData, setFormData, handleChange, validate, errors, disabled, setDisabled, reset } = useForm({
        defaultData: {
            id: '',
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            password: '',
            role: '',
            gym_hash: ''
        },
        rules: {
            first_name: {
                required: true,
                maxLength: 55
            },
            last_name: {
                required: true,
                maxLength: 55
            },
            username: {
                required: true,
                maxLength: 55
            },
            email: {
                maxLength: 55
            },
            password: {
                required: true,
                minLength: 8,
                maxLength: 255
            },
            role: {
                required: true
            }
        }
    })
    const { handleSubmit, handleClose, handleDelete, open, setOpen, getUsers, filter, setFilter } = useUsers();

    useEffect(() => {
        const { page, offset } = filter
        getUsers(`?page=${page}&offset=${offset}`)
    }, [filter])

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N° registro',
            accessor: (row: User) => row.id
        },
        {
            id: 'first_name',
            numeric: false,
            disablePadding: true,
            label: 'Nombre',
            accessor: (row: User) => row.first_name
        },
        {
            id: 'last_name',
            numeric: false,
            disablePadding: true,
            label: 'Apellido',
            accessor: (row: User) => row.last_name
        },
        {
            id: 'username',
            numeric: false,
            disablePadding: true,
            label: 'Nombre de usuario',
            accessor: (row: User) => row.username
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: true,
            label: 'Email',
            accessor: (row: User) => row.email
        },
        {
            id: 'role',
            numeric: false,
            disablePadding: true,
            label: 'Rol',
            accessor: (row: User) => row.role
        }
    ]

    return (
        <DataGridBackend
            headCells={headCells}
            rows={state.users.rows}
            setOpen={setOpen}
            setFormData={setFormData}
            filter={filter}
            setFilter={setFilter}
            count={state.users.count}
            showDeleteAction
        >
            <ModalComponent
                open={open === NEW || open === EDIT}
                onClose={() => handleClose(reset)}
            >
                <Typography variant="h6" sx={{ marginBottom: 1, fontSize: { xs: 18, sm: 18, md: 20 } }}>
                    {open === NEW && 'Registrar nuevo usuario'}
                    {open === EDIT && `Editar usuario #${formData.id}`}
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
                                <InputLabel htmlFor="username">Nombre de usuario</InputLabel>
                                <Input id="username" type="text" name="username" value={formData.username} />
                                {errors.username?.type === 'required' &&
                                    <Typography variant="caption" color="red" marginTop={1}>
                                        * El nombre de usuario es requerido.
                                    </Typography>
                                }
                                {errors.username?.type === 'maxLength' &&
                                    <Typography variant="caption" color="red" marginTop={1}>
                                        * El nombre de usuario es demasiado largo.
                                    </Typography>
                                }
                            </FormControl>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '50%' }}>
                            <FormControl>
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <Input id="email" type="email" name="email" value={formData.email} />
                                {errors.email?.type === 'maxLength' &&
                                    <Typography variant="caption" color="red" marginTop={1}>
                                        * El email es demasiado largo.
                                    </Typography>
                                }
                            </FormControl>
                            {open === NEW && auth!.me.role === SUPERUSER &&
                                <FormControl>
                                    <InputLabel htmlFor="password">Contraseña</InputLabel>
                                    <Input id="password" type="password" name="password" value={formData.password} />
                                    {errors.password?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La contraseña es requerida.
                                        </Typography>
                                    }
                                    {errors.password?.type === 'minLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La contraseña es demasiado corta.
                                        </Typography>
                                    }
                                    {errors.password?.type === 'maxLength' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La contraseña es demasiado larga.
                                        </Typography>
                                    }
                                </FormControl>
                            }
                            <FormControl>
                                <InputLabel id="role-select">Rol</InputLabel>
                                <Select
                                    labelId="role-select"
                                    id="role"
                                    value={formData.role}
                                    label="Rol"
                                    name="role"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={ADMIN}>{ADMIN}</MenuItem>
                                    <MenuItem value={USER}>{USER}</MenuItem>
                                </Select>
                                {errors.role?.type === 'required' &&
                                    <Typography variant="caption" color="red" marginTop={1}>
                                        * El rol es requerido.
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
            <ModalComponent
                open={open === DELETE}
                onClose={() => handleClose(reset)}
            >
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                    {`¿Desea borrar el registro del usuario ${formData.username} (#${formData.id})?`}
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