import { useContext, useEffect, useMemo } from "react";
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";

import { DataContext } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { useSuppliers } from "../../hooks/useSuppliers";

import { ModalComponent } from '../common/ModalComponent'
import { DataGridBackend } from "../DataGrid/DataGridBackend";

import { NEW, EDIT, DELETE } from '../../config/openTypes';

export function SuppliersABM() {

    const { state } = useContext(DataContext);

    const { formData, setFormData, handleChange, validate, errors, disabled, setDisabled, reset } = useForm({
        defaultData: { id: '', name: '', contact_info: '', address: '', gym_hash: '' },
        rules: {
            name: { required: true, maxLength: 55 },
            contact_info: { maxLength: 100 },
            address: { maxLength: 100 }
        }
    })
    const { handleSubmit, handleClose, handleDelete, open, setOpen, getSuppliers, filter, setFilter } = useSuppliers();

    useEffect(() => {
        const { page, offset } = filter
        getSuppliers(`?page=${page}&offset=${offset}`);
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
            id: 'contact_info',
            numeric: false,
            disablePadding: true,
            label: 'Contacto',
            accessor: 'contact_info'
        },
        {
            id: 'address',
            numeric: false,
            disablePadding: true,
            label: 'Dirección',
            accessor: 'address'
        }
    ], []);

    return (
        <DataGridBackend
            headCells={headCells}
            rows={state.suppliers.rows}
            setOpen={setOpen}
            setFormData={setFormData}
            filter={filter}
            setFilter={setFilter}
            count={state.suppliers.count}
            showEditAction
            showDeleteAction
        >
            <ModalComponent
                open={open === NEW || open === EDIT}
                onClose={() => handleClose(reset)}
            >
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                    {open === NEW && 'Registrar nuevo proveedor'}
                    {open === EDIT && `Editar proveedor #${formData.id}`}
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
                            <InputLabel htmlFor="contact_info">Contacto</InputLabel>
                            <Input id="contact_info" type="text" name="contact_info" value={formData.contact_info} />
                            {errors.contact_info?.type === 'maxLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * La información de contacto es demasiado larga.
                                </Typography>
                            }
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="address">Dirección</InputLabel>
                            <Input id="address" type="address" name="address" value={formData.address} />
                            {errors.address?.type === 'maxLength' &&
                                <Typography variant="caption" color="red" marginTop={1}>
                                    * La dirección es demasiado larga.
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
                    {`¿Desea borrar el registro del proveedor ${formData.name} (#${formData.id})?`}
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