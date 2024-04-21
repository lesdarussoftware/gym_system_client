import { useContext, useEffect, useState } from "react";
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useQuery } from "../hooks/useQuery";
import { useForm } from "../hooks/useForm";

import { Header } from "../components/Header";
import { DataGrid } from "../components/DataGrid/DataGrid";
import { ModalComponent } from '../components/ModalComponent'

import { CLASS_URL } from "../config/urls";
import { STATUS_CODES } from "../config/statusCodes";
import { SET_CLASSES } from "../config/dataReducerActionTypes";
import { getNumberInputAbsValue } from "../helpers/math";

export function ClassesPage() {

    const { auth } = useContext(AuthContext);
    const { state, dispatch } = useContext(DataContext);
    const { handleQuery } = useQuery();
    const [open, setOpen] = useState(null);
    const { formData, handleChange, validate, errors, disabled } = useForm({
        defaultData: { id: '', name: '', duration: '', gym_hash: '' },
        rules: { name: { required: true, maxLength: 55 } }
    })

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

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        validate();
    }

    return (
        <>
            <Header showOptions />
            <Box>
                <DataGrid
                    headCells={headCells}
                    rows={state.classes}
                    setOpen={setOpen}
                >
                    <ModalComponent
                        open={open === 'NEW'}
                        onClose={() => setOpen(null)}
                    >
                        <Typography variant="h6">
                            Registrar nueva clase
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
                                <FormControl>
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
                                        Ingresar
                                    </Button>
                                </FormControl>
                            </Box>
                        </form>
                    </ModalComponent>
                </DataGrid>
            </Box>
        </>
    );
}