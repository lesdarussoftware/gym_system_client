import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";

import { Pack } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { usePacks } from "../../hooks/usePacks";

import { ModalComponent } from '../common/ModalComponent'
import { DataGridBackend } from "../DataGrid/DataGridBackend";

import { NEW, EDIT, DELETE } from '../../config/openTypes';

export function PacksABM() {

    const { formData, setFormData, handleChange, validate, errors, disabled, setDisabled, reset } = useForm({
        defaultData: { id: '', name: '', price: '', gym_hash: '' },
        rules: { name: { required: true, maxLength: 55 }, price: { required: true } }
    })
    const { handleSubmit, handleClose, handleDelete, open, setOpen, getPacks } = usePacks();

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N° registro',
            accessor: (row: Pack) => row.id
        },
        {
            id: 'name',
            numeric: true,
            disablePadding: false,
            label: 'Nombre',
            accessor: (row: Pack) => row.name
        },
        {
            id: 'price',
            numeric: true,
            disablePadding: false,
            label: 'Precio',
            accessor: (row: Pack) => row.price
        }
    ]

    return (
        <DataGridBackend
            headCells={headCells}
            getter={getPacks}
            entityKey="packs"
            setOpen={setOpen}
            setFormData={setFormData}
        >
            <ModalComponent
                open={open === NEW || open === EDIT}
                onClose={() => handleClose(reset)}
                reduceWidth={800}
            >
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                    {open === NEW && 'Registrar nuevo paquete'}
                    {open === EDIT && `Editar paquete #${formData.id}`}
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
                            <InputLabel htmlFor="price">Precio</InputLabel>
                            <Input
                                id="price"
                                type="number"
                                name="price"
                                value={formData.price}
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
                    {`¿Desea borrar el registro del paquete ${formData.name} (#${formData.id})?`}
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
            {/* <ModalComponent
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
            </ModalComponent> */}
        </DataGridBackend>
    );
}