/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useRef } from "react";
import { Autocomplete, Box, Button, FormControl, Input, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import CancelSharpIcon from '@mui/icons-material/CancelSharp';

import { DataContext, Pack, PackClass } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { usePacks } from "../../hooks/usePacks";
import { useClasses } from "../../hooks/useClasses";

import { ModalComponent } from '../common/ModalComponent'
import { DataGridBackend } from "../DataGrid/DataGridBackend";

import { NEW, EDIT, DELETE } from '../../config/openTypes';

export function PacksABM() {

    const { state } = useContext(DataContext);
    const { formData, setFormData, handleChange, validate, errors, disabled, setDisabled, reset } = useForm({
        defaultData: { id: '', name: '', price: '', gym_hash: '' },
        rules: { name: { required: true, maxLength: 55 } }
    });
    const { getClasses } = useClasses();
    const {
        handleSubmit,
        handleClose,
        handleDelete,
        open,
        setOpen,
        getPacks,
        missing,
        setMissing,
        idsToDelete,
        setIdsToDelete,
        packClasses,
        setPackClasses
    } = usePacks();

    const inputRefs = useRef<{ [key: number]: HTMLInputElement | null; }>({});

    useEffect(() => {
        getClasses();
    }, [])

    useEffect(() => {
        setFormData({
            ...formData,
            price: packClasses.reduce((prev, curr) => {
                const currentClass = state.classes.rows.find(c => c.id === curr.class_id)
                const price = currentClass?.price ?? 0
                return prev + (curr.amount * price)
            }, 0)
        })
    }, [packClasses, state.classes.rows])

    const handleAdd = (data: Partial<PackClass>) => {
        if (data.class_id && data.class_id.toString().length > 0) {
            setMissing(false);
            const validPackClass: PackClass | undefined = data as PackClass;
            if (validPackClass) {
                setPackClasses(prevClasses => [
                    ...prevClasses.filter(pc => pc.class_id !== validPackClass.class_id),
                    validPackClass
                ]);
                setTimeout(() => {
                    const inputRef = inputRefs.current[validPackClass.class_id];
                    if (inputRef) {
                        inputRef.focus();
                    }
                }, 100);
            }
        }
    };

    const handleChangeAmount = (data: Partial<PackClass>) => {
        if (data.class_id && data.class_id.toString().length > 0) {
            const validPackClass: PackClass | undefined = data as PackClass;
            if (validPackClass) {
                const amount = data.amount && data.amount.toString().length > 0 ? data.amount : 0
                setPackClasses([
                    ...packClasses.filter(pc => pc.class_id !== data.class_id),
                    {
                        ...packClasses.find(pc => pc.class_id === data.class_id),
                        ...validPackClass,
                        amount
                    }
                ].sort((a, b) => a.class_id - b.class_id));
            }
        }
    }

    const handleDeleteClass = (pcId: number, cId: number) => {
        setMissing(false);
        setPackClasses([
            ...packClasses.filter(pc => pc.class_id !== cId),
        ]);
        if (open === 'EDIT') {
            setIdsToDelete([...idsToDelete, pcId]);
        }
    }

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
                    {open === NEW && 'Registrar nuevo pack'}
                    {open === EDIT && `Editar pack #${formData.id}`}
                </Typography>
                <form onSubmit={(e) => handleSubmit(
                    e,
                    validate,
                    formData,
                    setDisabled,
                    reset
                )}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <FormControl>
                            <InputLabel htmlFor="name">Nombre</InputLabel>
                            <Input id="name" type="text" name="name" value={formData.name} onChange={handleChange} />
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
                            <Autocomplete
                                disablePortal
                                id="class-autocomplete"
                                options={state.classes.rows.sort()
                                    .map(c => ({ label: c.name, id: c?.id }))}
                                renderInput={(params) => <TextField {...params} label="Buscar clase..." />}
                                noOptionsText="No hay clases disponibles."
                                onChange={(_, value) => handleAdd({ class_id: value?.id as number, amount: 0 })}
                                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                            />
                        </FormControl>
                        {missing &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * Las clases son requeridas y las cantidades deben ser mayores a 0.
                            </Typography>
                        }
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Clase</TableCell>
                                        <TableCell align="center">Cantidad</TableCell>
                                        <TableCell align="center">Precio</TableCell>
                                        <TableCell align="center">Total</TableCell>
                                        <TableCell align="center"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {packClasses.length === 0 ?
                                        <TableRow>
                                            <TableCell align="center" colSpan={5}>
                                                No hay registros que mostrar.
                                            </TableCell>
                                        </TableRow> :
                                        packClasses.map(pc => {
                                            const c = state.classes.rows.find(c => c.id === pc.class_id)
                                            return (
                                                <TableRow key={pc.class_id}>
                                                    <TableCell align="center">{c?.name}</TableCell>
                                                    <TableCell align="center">
                                                        <Input
                                                            id={`input_${pc.class_id}`}
                                                            type="number"
                                                            value={pc.amount}
                                                            onChange={e => handleChangeAmount({
                                                                class_id: c?.id,
                                                                amount: e.target.value as unknown as number
                                                            })}
                                                            inputRef={el => inputRefs.current[pc.class_id] = el}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">{c?.price}</TableCell>
                                                    <TableCell align="center">{c!.price * pc.amount}</TableCell>
                                                    <TableCell align="center">
                                                        <Button type="button" onClick={() => {
                                                            if (c?.id) handleDeleteClass(pc.id, c.id)
                                                        }}>
                                                            <CancelSharpIcon />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <FormControl>
                            <InputLabel htmlFor="price">Precio</InputLabel>
                            <Input
                                id="price"
                                type="number"
                                name="price"
                                onChange={handleChange}
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
                    {`¿Desea borrar el registro del pack ${formData.name} (#${formData.id})?`}
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