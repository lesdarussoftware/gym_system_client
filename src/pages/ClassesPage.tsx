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

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (validate()) {
            const { status, data } = await handleQuery({
                url: CLASS_URL,
                method: 'POST',
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
                handleClose()
                setMessage('Clase registrada correctamente.');
                setSeverity(SUCCESS);
            } else {
                setMessage('Hubo un problema al procesar la solicitud.');
                setSeverity(ERROR);
                setDisabled(false);
            }
            setOpenMessage(true);
        }
    }

    const handleClose = () => {
        setOpen(null);
        reset();
    }

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
                        <Typography variant="h6">
                            {open === 'NEW' && 'Registrar nueva clase'}
                            {open === 'EDIT' && `Editar clase ${formData.name}`}
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
                </DataGrid>
            </Box>
        </>
    );
}