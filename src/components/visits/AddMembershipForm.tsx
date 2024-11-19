/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, FormControl, Input, InputLabel, TextField, Typography } from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale/es';

import { ModalComponent } from "../common/ModalComponent";

import { EDIT, NEW } from "../../config/openTypes";

type AddMembershipFormProps = {
    open: string | null,
    handleClose: any,
    reset: any,
    formData: any,
    handleChange: any,
    handleSubmit: any,
    validate: any,
    disabled: boolean,
    setDisabled: any,
    errors: any
}

export function AddMembershipForm({
    open,
    handleClose,
    reset,
    formData,
    handleChange,
    handleSubmit,
    validate,
    disabled,
    setDisabled,
    errors
}: AddMembershipFormProps) {
    return (
        <ModalComponent open={open === NEW || open === EDIT} onClose={() => handleClose(reset)}>
            <Typography variant="h6" sx={{ marginBottom: 2, fontSize: { xs: 18, sm: 18, md: 20 } }}>
                {open === NEW && 'Registrar nueva membresía'}
                {open === EDIT && `Editar membresía #${formData.id}`}
            </Typography>
            <form onChange={handleChange} onSubmit={(e) => handleSubmit(
                e,
                validate,
                formData,
                setDisabled,
                reset
            )}>
                <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <FormControl sx={{ width: '50%' }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DatePicker
                                    label="Fecha de inicio"
                                    value={new Date(formData.start)}
                                    onChange={value => handleChange({
                                        target: {
                                            name: 'start',
                                            value: new Date(value!.toISOString())
                                        }
                                    })}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <FormControl sx={{ width: '50%' }}>
                            <TextField
                                label="Precio"
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={e => handleChange({
                                    target: {
                                        name: 'price',
                                        value: parseFloat(e.target.value) <= 0 ? 0 : Math.abs(parseFloat(e.target.value))
                                    }
                                })}
                                InputProps={{
                                    inputProps: {
                                        step: 0.01,
                                        min: 0
                                    }
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <FormControl sx={{ width: '50%' }}>
                            <TextField
                                label="Cuotas"
                                type="number"
                                name="payments_amount"
                                value={formData.payments_amount}
                                onChange={e => handleChange({
                                    target: {
                                        name: 'payments_amount',
                                        value: parseFloat(e.target.value) <= 0 ? 0 : Math.abs(parseFloat(e.target.value))
                                    }
                                })}
                                InputProps={{
                                    inputProps: {
                                        step: 1,
                                        min: 0
                                    }
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                        <FormControl sx={{ width: '50%' }}>
                            <TextField
                                label="Descuento"
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={e => handleChange({
                                    target: {
                                        name: 'discount',
                                        value: parseFloat(e.target.value) <= 0 ? 0 : Math.abs(parseFloat(e.target.value))
                                    }
                                })}
                                InputProps={{
                                    inputProps: {
                                        step: 0.01,
                                        min: 0
                                    }
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <FormControl sx={{ width: '50%' }}>
                            <TextField
                                label="Duración (días)"
                                type="number"
                                name="price"
                                value={formData.duration}
                                onChange={e => handleChange({
                                    target: {
                                        name: 'duration',
                                        value: parseFloat(e.target.value) <= 0 ? 0 : Math.abs(parseFloat(e.target.value))
                                    }
                                })}
                                InputProps={{
                                    inputProps: {
                                        step: 0.01,
                                        min: 0
                                    }
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                        <FormControl sx={{ width: '50%' }}>
                            <TextField
                                label="Límite de ingresos (0 = sín limite)"
                                type="number"
                                name="limit"
                                value={formData.limit}
                                onChange={e => handleChange({
                                    target: {
                                        name: 'limit',
                                        value: parseFloat(e.target.value) <= 0 ? 0 : Math.abs(parseFloat(e.target.value))
                                    }
                                })}
                                InputProps={{
                                    inputProps: {
                                        step: 1,
                                        min: 0
                                    }
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </FormControl>
                    </Box>
                    <FormControl>
                        <InputLabel htmlFor="observations">Observaciones</InputLabel>
                        <Input
                            id="observations"
                            type="text"
                            name="observations"
                            value={formData.observations}
                        />
                        {errors.observations?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * Las observaciones son demasiado largas.
                            </Typography>
                        }
                    </FormControl>
                </Box>
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
            </form>
        </ModalComponent>
    );
}