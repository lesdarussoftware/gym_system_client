import { Box, Button, FormControl, Input, InputLabel, Typography } from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale/es';

import { ModalComponent } from "../common/ModalComponent";

import { EDIT, NEW } from "../../config/openTypes";
import { getNumberInputAbsValue } from "../../helpers/math";

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
        <ModalComponent
            open={open === NEW || open === EDIT}
            onClose={() => handleClose(reset)}
        >
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <FormControl>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                            <DatePicker
                                label="Fecha de inicio"
                                value={new Date(formData.start)}
                                onChange={value => handleChange({
                                    target: {
                                        name: 'date',
                                        value: new Date(value!.toISOString())
                                    }
                                })}
                            />
                        </LocalizationProvider>
                        {errors.date?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * La fecha es requerida.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="price">Precio</InputLabel>
                        <Input
                            id="price"
                            type="number"
                            name="price"
                            value={getNumberInputAbsValue(+formData.price, 0, 99999999999)}
                        />
                        {errors.price?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El precio es requerido.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="duration">Duración (días)</InputLabel>
                        <Input
                            id="duration"
                            type="number"
                            name="duration"
                            value={getNumberInputAbsValue(+formData.duration, 1, 99999999999)}
                        />
                        {errors.duration?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * La duración es requerida.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="duration">Límite de visitas</InputLabel>
                        <Input
                            id="limit"
                            type="number"
                            name="limit"
                            value={getNumberInputAbsValue(+formData.limit, 1, 99999999999)}
                        />
                        {errors.limit?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El límite de visitas es requerido.
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
    );
}