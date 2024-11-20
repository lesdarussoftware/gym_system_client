import { useContext } from "react";
import { Box, Button, FormControl, Input, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { useUsers } from "../hooks/useUsers";
import { useForm } from "../hooks/useForm";

import { Header } from "../components/common/Header";
import { LoginForm } from "../components/common/LoginForm";
import { ModalComponent } from "../components/common/ModalComponent";

import { CHANGE_PWD } from "../config/openTypes";

export function ProfilePage() {

    const { auth } = useContext(AuthContext);
    const { open, setOpen, handleClose, handleChangePwd } = useUsers();
    const { formData, reset, handleChange, errors, validate, disabled, setDisabled } = useForm({
        defaultData: { new_password: '', repeat_new_password: '' },
        rules: {
            new_password: {
                required: true,
                minLength: 8,
                maxLength: 255
            }
        }
    });

    return (
        <>
            {auth ?
                <>
                    <Header />
                    <Box sx={{ padding: 2, pt: 0 }}>
                        <Typography variant="h4" marginBottom={1}>
                            Perfil
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                            Nombre
                                        </TableCell>
                                        <TableCell align="center">
                                            {auth?.me?.first_name}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                            Apellido
                                        </TableCell>
                                        <TableCell align="center">
                                            {auth?.me?.last_name}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                            Usuario
                                        </TableCell>
                                        <TableCell align="center">
                                            {auth?.me?.username}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                            Email
                                        </TableCell>
                                        <TableCell align="center">
                                            {auth?.me?.email}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                            Contraseña
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button type="button" variant="outlined" size="small" onClick={() => setOpen(CHANGE_PWD)}>
                                                Cambiar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <ModalComponent open={open === CHANGE_PWD} onClose={() => handleClose(reset)}>
                            <Typography variant="h6" align="center">
                                Cambiar contraseña
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', marginBottom: 1 }} align="center">
                                Deberás iniciar sesión nuevamente.
                            </Typography>
                            <form onChange={handleChange} onSubmit={(e) => handleChangePwd(e, validate, formData, setDisabled, reset)}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <FormControl>
                                        <InputLabel htmlFor="new_password">Contraseña nueva</InputLabel>
                                        <Input id="new_password" type="password" name="new_password" value={formData.new_password} />
                                        {errors.new_password?.type === 'required' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * La contraseña nueva es requerida.
                                            </Typography>
                                        }
                                        {errors.new_password?.type === 'minLength' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * La contraseña nueva es demasiado corta.
                                            </Typography>
                                        }
                                        {errors.new_password?.type === 'maxLength' &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * La contraseña nueva es demasiado larga.
                                            </Typography>
                                        }
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel htmlFor="repeat_new_password">Repetir contraseña nueva</InputLabel>
                                        <Input id="repeat_new_password" type="password" name="repeat_new_password" value={formData.repeat_new_password} />
                                        {formData.new_password !== formData.repeat_new_password &&
                                            formData.new_password.length > 0 && formData.repeat_new_password.length > 0 &&
                                            <Typography variant="caption" color="red" marginTop={1}>
                                                * Las contraseñas no coinciden.
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
                    </Box>
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