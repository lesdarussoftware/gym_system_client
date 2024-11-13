import { useContext, useEffect, useMemo } from "react";
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";

import { DataContext } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { useCategories } from "../../hooks/useCategories";

import { ModalComponent } from '../common/ModalComponent'
import { DataGridBackend } from "../DataGrid/DataGridBackend";

import { NEW, EDIT, DELETE } from '../../config/openTypes';

export function CategoriesABM() {

    const { state } = useContext(DataContext);

    const { formData, setFormData, handleChange, validate, errors, disabled, setDisabled, reset } = useForm({
        defaultData: { id: '', name: '', contact_info: '', address: '', gym_hash: '' },
        rules: {
            name: { required: true, maxLength: 55 },
            description: { maxLength: 191 }
        }
    })
    const { handleSubmit, handleClose, handleDelete, open, setOpen, getCategories, filter, setFilter } = useCategories();

    useEffect(() => {
        const { page, offset } = filter
        getCategories(`?page=${page}&offset=${offset}`);
    }, [filter])

    const headCells = useMemo(() => [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N° registro',
            accessor: 'id'
        },
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Nombre',
            accessor: 'name'
        },
        {
            id: 'description',
            numeric: false,
            disablePadding: true,
            label: 'Descripcion',
            accessor: 'description'
        }
    ], []);

    return (
        <DataGridBackend
            headCells={headCells}
            rows={state.categories.rows}
            setOpen={setOpen}
            setFormData={setFormData}
            filter={filter}
            setFilter={setFilter}
            count={state.categories.count}
            showEditAction
            showDeleteAction
        >
            <ModalComponent
                open={open === NEW || open === EDIT}
                onClose={() => handleClose(reset)}
            >
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                    {open === NEW && 'Registrar nueva categoría'}
                    {open === EDIT && `Editar categoría #${formData.id}`}
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
                            <InputLabel htmlFor="description">Descripción</InputLabel>
                            <Input id="description" type="text" name="description" value={formData.description} />
                            {errors.description?.type === 'maxLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * La descripción es demasiado larga.
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
                    {`¿Desea borrar el registro de la categoría ${formData.name} (#${formData.id})?`}
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