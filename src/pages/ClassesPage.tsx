import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useQuery } from "../hooks/useQuery";
import { useForm } from "../hooks/useForm";

import { Header } from "../components/Header";
import { DataGrid } from "../components/DataGrid/DataGrid";
import { ModalComponent } from '../components/ModalComponent'

import { CLASS_URL } from "../config/urls";
import { STATUS_CODES } from "../config/statusCodes";
import { SET_CLASSES } from "../config/dataReducerActionTypes";
import { getNumberInputAbsValue } from "../helpers/math";
import { ERROR, SUCCESS } from "../config/messageProviderTypes";

export function ClassesPage() {

    const { auth } = useContext(AuthContext);
    const { state, dispatch } = useContext(DataContext);
    const { setOpenMessage, setSeverity, setMessage } = useContext(MessageContext);
    const { handleQuery } = useQuery();
    const { formData, setFormData, handleChange, validate, errors, disabled, setDisabled, reset } = useForm({
        defaultData: { id: '', name: '', duration: '', gym_hash: '' },
        rules: { name: { required: true, maxLength: 55 } }
    })
    const [open, setOpen] = useState(null);

    useEffect(() => {
        (async () => {
            if (state.classes.length === 0) {
                const { status, data } = await handleQuery({ url: `${CLASS_URL}/${auth?.me.gym.hash}` })
                if (status === STATUS_CODES.OK) {
                    dispatch({ type: SET_CLASSES, payload: data })
                }
            }
        })()
    }, [])

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (validate()) {
            const methods = { 'NEW': 'POST', 'EDIT': 'PUT' };
            const urls = { 'NEW': CLASS_URL, 'EDIT': `${CLASS_URL}/${auth?.me.gym.hash}/${formData.id}` };
            const { status, data } = await handleQuery({
                url: urls[open!],
                method: methods[open!],
                body: JSON.stringify({
                    ...formData,
                    gym_hash: auth?.me.gym.hash
                })
            });
            if (status === STATUS_CODES.CREATED) {
                dispatch({
                    type: SET_CLASSES,
                    payload: [data, ...state.classes]
                });
                setMessage('Clase registrada correctamente.');
            } else if (status === STATUS_CODES.OK) {
                dispatch({
                    type: SET_CLASSES,
                    payload: [data, ...state.classes.filter(item => item.id !== data.id)]
                });
                setMessage('Clase editada correctamente.');
            } else {
                setMessage('Hubo un problema al procesar la solicitud.');
                setSeverity(ERROR);
                setDisabled(false);
            }
            if (status === STATUS_CODES.CREATED || status === STATUS_CODES.OK) {
                setSeverity(SUCCESS);
                handleClose();
            }
            setOpenMessage(true);
        }
    }

    const handleClose = () => {
        setOpen(null);
        reset();
    }

    const handleDelete = async () => {
        const { status, data } = await handleQuery({
            url: `${CLASS_URL}/${auth?.me.gym.hash}/${formData.id}`,
            method: 'DELETE'
        });
        if (status === STATUS_CODES.OK) {
            dispatch({
                type: SET_CLASSES,
                payload: [...state.classes.filter(item => item.id !== data.id)]
            });
            setSeverity(SUCCESS);
            setMessage('Clase eliminada correctamente.');
            handleClose();
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setMessage(data.message);
            setSeverity(ERROR);
            setDisabled(false);
        }
        setOpenMessage(true);
    }

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N°',
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
            id: 'duration',
            numeric: false,
            disablePadding: true,
            label: 'Duración (min.)',
            accessor: 'duration'
        }
    ]

    return (
        <>
            <Header showOptions />
            <Box>
                <DataGrid
                    headCells={headCells}
                    rows={state.classes}
                    setOpen={setOpen}
                    setFormData={setFormData}
                >
                    <ModalComponent
                        open={open === 'NEW' || open === 'EDIT'}
                        onClose={handleClose}
                    >
                        <Typography variant="h6" sx={{ marginBottom: 1 }}>
                            {open === 'NEW' && 'Registrar nueva clase'}
                            {open === 'EDIT' && `Editar clase #${formData.id}`}
                        </Typography>
                        <form onChange={handleChange} onSubmit={handleSubmit}>
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
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        sx={{
                                            width: '50%',
                                            margin: '0 auto',
                                            marginTop: 1
                                        }}
                                        onClick={handleClose}
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
                        open={open === 'DELETE'}
                        onClose={handleClose}
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
                                onClick={handleClose}
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
                                onClick={handleDelete}
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