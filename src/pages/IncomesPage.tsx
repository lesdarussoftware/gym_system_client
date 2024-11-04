import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";
import { useContext, useEffect } from "react";

import { DataContext } from "../providers/DataProvider";
import { MessageContext } from "../providers/MessageProvider";
import { AuthContext } from "../providers/AuthProvider";
import { HandleClientContext } from "../providers/HandleClientProvider";
import { useForm } from "../hooks/useForm";
import { useClasses } from "../hooks/useClasses";
import { useClients } from "../hooks/useClients";

import { MemebershipsABM } from "../components/clients/MembershipsABM";
import { ShowCurrentMembership } from "../components/clients/ShowCurrentMembership";
import { Header } from "../components/common/Header";
import { LoginForm } from "../components/common/LoginForm";

import { ERROR } from "../config/messageProviderTypes";

export function IncomesPage() {

    const { auth } = useContext(AuthContext);
    const { state } = useContext(DataContext);
    const { setSeverity, setMessage, setOpenMessage } = useContext(MessageContext);
    const { client, setClient } = useContext(HandleClientContext);
    const { getClasses } = useClasses()
    const { getClients } = useClients()
    const { formData, errors, validate, handleChange, disabled, setDisabled, reset } = useForm({
        defaultData: { dni: '' },
        rules: { dni: { required: true } }
    });

    useEffect(() => {
        if (auth) {
            getClasses()
            getClients()
        }
    }, [])

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (validate()) {
            const exists = state.clients.rows.find(c => c.dni === +formData.dni);
            if (exists) {
                setClient(exists);
                reset();
            } else {
                setSeverity(ERROR);
                setMessage('El cliente no existe.');
                setOpenMessage(true);
            }
            setDisabled(false);
        }
    }

    return (
        <>
            {auth ?
                <>
                    <Header />
                    {client ?
                        <Box sx={{ p: 2 }}>
                            <Button
                                type="button"
                                variant="contained"
                                sx={{ marginBottom: 2, color: '#fff' }}
                                onClick={() => setClient(null)}
                            >
                                Buscar nuevo cliente
                            </Button>
                            <Box sx={{ marginBottom: 3, textAlign: 'center' }}>
                                <ShowCurrentMembership client={client} />
                            </Box>
                            <Typography variant="h6">
                                Membresías vencidas del cliente {`${client.first_name} ${client.last_name}`}
                            </Typography>
                            <MemebershipsABM client={client} />
                        </Box> :
                        <>
                            <Box textAlign="center">
                                <Typography variant="h5" marginBottom={2} sx={{ color: '#000' }}>
                                    Ingrese el DNI de un cliente
                                </Typography>
                                <form
                                    onChange={handleChange}
                                    onSubmit={handleSubmit}
                                    style={{ display: 'flex', alignItems: 'end', gap: '10px', justifyContent: 'center' }}
                                >
                                    <FormControl>
                                        <InputLabel htmlFor="dni" sx={{ color: '#000' }}>N°</InputLabel>
                                        <Input id="dni" type="tel" name="dni" value={formData.dni} sx={{ color: '#000' }} />
                                        {errors.dni?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * El dni es requerido.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={disabled}
                                        sx={{ color: '#fff' }}
                                    >
                                        Buscar
                                    </Button>
                                </form>
                            </Box>
                        </>
                    }
                </> :
                <Box sx={{ padding: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '90vh',
                        flexDirection: 'column',
                        gap: 3
                    }}>
                        <Typography variant="h2" sx={{ color: '#000' }}>
                            Iniciar sesión
                        </Typography>
                        <LoginForm />
                    </Box>
                </Box>
            }
        </>
    );
}