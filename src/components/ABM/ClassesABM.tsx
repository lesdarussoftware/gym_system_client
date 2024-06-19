import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";

import { Class } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { useClasses } from "../../hooks/useClasses";

import { ModalComponent } from '../common/ModalComponent'
import { ClassSchedules } from "./ClassSchedules";
import { DataGridBackend } from "../DataGrid/DataGridBackend";

import { getNumberInputAbsValue } from "../../helpers/math";
import { NEW, EDIT, DELETE, VIEW_SCHEDULES } from '../../config/openTypes';

export function ClassesABM() {

    const { formData, setFormData, handleChange, validate, errors, disabled, setDisabled, reset } = useForm({
        defaultData: { id: '', name: '', duration: '', gym_hash: '', price: '' },
        rules: { name: { required: true, maxLength: 55 } }
    })
    const { handleSubmit, handleClose, handleDelete, open, setOpen, getClasses } = useClasses();

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N° registro',
            accessor: (row: Class) => row.id
        },
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Nombre',
            accessor: (row: Class) => row.name
        },
        {
            id: 'duration',
            numeric: true,
            disablePadding: false,
            label: 'Duración (min.)',
            accessor: (row: Class) => row.duration
        },
        {
            id: 'price',
            numeric: false,
            disablePadding: false,
            label: 'Precio',
            accessor: (row: Class) => `$${row.price.toFixed(2)}`
        }
    ]

    return (
        <DataGridBackend
            headCells={headCells}
            getter={getClasses}
            entityKey="classes"
            setOpen={setOpen}
            setFormData={setFormData}
            showClassesDetails
        >
            <ModalComponent
                open={open === NEW || open === EDIT}
                onClose={() => handleClose(reset)}
                reduceWidth={800}
            >
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                    {open === NEW && 'Registrar nueva clase'}
                    {open === EDIT && `Editar clase #${formData.id}`}
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
                            <InputLabel htmlFor="name">Nombre</InputLabel>
                            <Input id="name" type="text" name="name" value={formData.name} />
                            {errors.name?.type === 'required' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El nombre es requerido.
                                </Typography>
                            }
                            {errors.name?.type === 'maxLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * El nombre es demasiado largo.
                                </Typography>
                            }
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="duration">Duración (min)</InputLabel>
                            <Input
                                id="duration"
                                type="number"
                                name="duration"
                                value={getNumberInputAbsValue(+formData.duration, 1, 3600)}
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="price">Precio</InputLabel>
                            <Input
                                id="price"
                                type="number"
                                name="price"
                                value={getNumberInputAbsValue(+formData.price, 0, 1000000)}
                            />
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
                    {`¿Desea borrar el registro de la clase ${formData.name} (#${formData.id})?`}
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
            <ModalComponent
                open={open === VIEW_SCHEDULES}
                onClose={() => handleClose(reset)}
            >
                <ClassSchedules formData={formData} />
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
        </DataGridBackend>
    );
}