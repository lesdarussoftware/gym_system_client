import { useContext } from "react";
import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";

import { AuthContext } from "../../providers/AuthProvider";
import { useForm } from "../../hooks/useForm";
import { useAuth } from "../../hooks/useAuth";

import { STATUS_CODES } from "../../config/statusCodes";

type LoginFormProps = {
    submitAction?: () => void;
}

export function LoginForm({ submitAction }: LoginFormProps) {

    const { setAuth } = useContext(AuthContext);
    const { formData, errors, disabled, setDisabled, handleChange, validate } = useForm({
        defaultData: { username: '', password: '' },
        rules: {
            username: { required: true, maxLength: 55 },
            password: { required: true, minLength: 8, maxLength: 255 }
        }
    });
    const { login } = useAuth();

    async function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault();
        if (validate()) {
            const { username, password } = formData;
            const { status, data } = await login({ username, password });
            if (status === STATUS_CODES.OK) {
                setAuth(data);
                localStorage.setItem('auth', JSON.stringify(data));
                if (submitAction) {
                    submitAction();
                }
            } else {
                setDisabled(false);
            }
        } else {
            setDisabled(false);
        }
    }

    return (
        <Box>
            <form onChange={handleChange} onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <FormControl>
                        <InputLabel htmlFor="username">Usuario</InputLabel>
                        <Input id="username" type="text" name="username" value={formData.username} />
                        {errors.username?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El nombre de usuario es requerido.
                            </Typography>
                        }
                        {errors.username?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El nombre de usuario es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="password">Contraseña</InputLabel>
                        <Input id="password" type="password" name="password" value={formData.password} />
                        {errors.password?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * La contraseña es requerida.
                            </Typography>
                        }
                        {errors.password?.type === 'minLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * La contraseña es demasiado corta.
                            </Typography>
                        }
                        {errors.password?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * La contraseña es demasiado larga.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl>
                        <Button type="submit" variant="contained" sx={{
                            width: '50%',
                            margin: '0 auto',
                            marginTop: 1
                        }} disabled={disabled}>
                            Ingresar
                        </Button>
                    </FormControl>
                </Box>
            </form>
        </Box>
    );
}