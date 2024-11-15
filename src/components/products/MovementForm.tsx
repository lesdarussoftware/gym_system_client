/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";

import { movementTypes } from "../../config/movementTypes";

type MovementFormProps = {
    movementData: any;
    open: string | null;
    handleSubmit: any;
    handleClose: any;
}

export function MovementForm({ movementData, open, handleSubmit, handleClose }: MovementFormProps) {

    const { formData, handleChange, validate, errors, disabled, setDisabled, reset } = movementData;

    return (
        <form onChange={handleChange} onSubmit={(e) => handleSubmit(
            e,
            validate,
            formData,
            setDisabled,
            reset
        )}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl>
                    <InputLabel id="day-select">Tipo</InputLabel>
                    <Select
                        labelId="type-select"
                        id="type"
                        value={formData.type}
                        label="Tipo"
                        name="type"
                        onChange={handleChange}
                    >
                        <MenuItem value={movementTypes.AJUSTE}>{movementTypes.AJUSTE}</MenuItem>
                        {open === 'NEW_INCOME' && (
                            <>
                                <MenuItem value={movementTypes.COMPRA}>{movementTypes.COMPRA}</MenuItem>
                                <MenuItem value={movementTypes.DEVOLUCION}>{movementTypes.DEVOLUCION}</MenuItem>
                            </>
                        )}
                        {open === 'NEW_EXPENSE' && (
                            <>
                                <MenuItem value={movementTypes.VENTA}>{movementTypes.VENTA}</MenuItem>
                                <MenuItem value={movementTypes.DANO}>{movementTypes.DANO.replace('N', 'Ñ')}</MenuItem>
                                <MenuItem value={movementTypes.EXPIRACION}>{movementTypes.EXPIRACION}</MenuItem>
                            </>
                        )}
                    </Select>
                </FormControl>
                <FormControl>
                    <TextField
                        label="Cantidad"
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={e => handleChange({
                            target: {
                                name: 'quantity',
                                value: parseFloat(e.target.value) <= 0 ? 0 : Math.abs(parseFloat(e.target.value))
                            }
                        })}
                        InputProps={{
                            inputProps: {
                                step: 1
                            }
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="description">Descripción</InputLabel>
                    <Input id="description" type="text" name="description" value={formData.description} />
                    {errors.description?.type === 'maxLength' &&
                        <Typography variant="caption" color="red" marginTop={1}>
                            * La descripción es demasiado larga.
                        </Typography>
                    }
                </FormControl>
                <FormControl>
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
                                step: 0.01
                            }
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label="Precio final"
                        type="number"
                        name="final_price"
                        value={formData.final_price}
                        onChange={e => handleChange({
                            target: {
                                name: 'final_price',
                                value: parseFloat(e.target.value) <= 0 ? 0 : Math.abs(parseFloat(e.target.value))
                            }
                        })}
                        InputProps={{
                            inputProps: {
                                step: 0.01
                            }
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
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
    )
}