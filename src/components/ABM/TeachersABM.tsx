import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";

import { Teacher } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { useTeachers } from "../../hooks/useTeachers";

import { ModalComponent } from '../common/ModalComponent'
import { DataGridBackend } from "../DataGrid/DataGridBackend";

import { NEW, EDIT, DELETE } from '../../config/openTypes';

export function TeachersABM() {

    const { formData, setFormData, handleChange, validate, errors, disabled, setDisabled, reset } = useForm({
        defaultData: { id: '', first_name: '', last_name: '', email: '', phone: '', gym_hash: '' },
        rules: {
            first_name: { required: true, maxLength: 55 },
            last_name: { required: true, maxLength: 55 },
            email: { maxLength: 55 },
            phone: { maxLength: 55 }
        }
    })
    const { handleSubmit, handleClose, handleDelete, open, setOpen, getTeachers } = useTeachers();

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N° registro',
            accessor: (row: Teacher) => row.id
        },
        {
            id: 'first_name',
            numeric: false,
            disablePadding: true,
            label: 'Nombre',
            accessor: (row: Teacher) => row.first_name
        },
        {
            id: 'last_name',
            numeric: false,
            disablePadding: true,
            label: 'Apellido',
            accessor: (row: Teacher) => row.last_name
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: true,
            label: 'Email',
            accessor: (row: Teacher) => row.email
        },
        {
            id: 'phone',
            numeric: false,
            disablePadding: true,
            label: 'Teléfono',
            accessor: (row: Teacher) => row.phone
        }
    ]

    return (
        <DataGridBackend
            headCells={headCells}
            getter={getTeachers}
            entityKey="teachers"
            setOpen={setOpen}
            setFormData={setFormData}
        >
            <ModalComponent
                open={open === NEW || open === EDIT}
                onClose={() => handleClose(reset)}
            >
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                    {open === NEW && 'Registrar nuevo profesor'}
                    {open === EDIT && `Editar profesor #${formData.id}`}
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
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <Input id="email" type="email" name="email" value={formData.email} />
                            {errors.email?.type === 'maxLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El email es demasiado largo.
                                </Typography>
                            }
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="phone">Teléfono</InputLabel>
                            <Input id="phone" type="text" name="phone" value={formData.phone} />
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
                    {`¿Desea borrar el registro del profesor ${formData.first_name + ' ' + formData.last_name} (#${formData.id})?`}
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