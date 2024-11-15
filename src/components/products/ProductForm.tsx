/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";
import { Autocomplete, Box, Button, FormControl, Input, InputLabel, TextField, Typography } from "@mui/material";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
// import { es } from "date-fns/locale";

import { DataContext } from "../../providers/DataProvider";

// import { EDIT } from "../../config/openTypes";

type ProductFormProps = {
    handleChange: any,
    handleSubmit: (e: React.FormEvent<HTMLFormElement>, validate: () => boolean, formData: any, setDisabled: (value: boolean) => void, reset: () => void) => void,
    validate: () => boolean,
    formData: any,
    setDisabled: (value: boolean) => void,
    reset: () => void,
    errors: any,
    handleClose: any,
    disabled: boolean,
    // open: string | null
}

export function ProductForm({
    handleChange,
    handleSubmit,
    validate,
    formData,
    setDisabled,
    reset,
    errors,
    handleClose,
    disabled,
    // open
}: ProductFormProps) {

    const { state } = useContext(DataContext);

    return (
        <form onChange={handleChange} onSubmit={(e) => handleSubmit(
            e,
            validate,
            formData,
            setDisabled,
            reset
        )}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                    <FormControl sx={{ width: { xs: '100%', md: '32%' } }}>
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
                    <FormControl sx={{ width: { xs: '100%', md: '32%' } }}>
                        <InputLabel htmlFor="sku">SKU</InputLabel>
                        <Input id="sku" type="text" name="sku" value={formData.sku} />
                        {errors.sku?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El sku es requerido.
                            </Typography>
                        }
                        {errors.sku?.type === 'maxLength' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El sku es demasiado largo.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', md: '32%' } }}>
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
                                    step: 0.01
                                }
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </FormControl>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                    <FormControl sx={{ width: { xs: '100%', md: '32%' } }}>
                        <Autocomplete
                            disablePortal
                            id="category-autocomplete"
                            options={state.categories.rows.map(c => ({ label: c.name, id: c?.id }))}
                            renderInput={(params) => <TextField {...params} label="Categoría" />}
                            noOptionsText="No hay categorías disponibles."
                            onChange={(_, value) => handleChange({
                                target: {
                                    name: 'category_id',
                                    value: value?.id as number
                                }
                            })}
                            isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        />
                        {errors.category_id?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * La categoría es requerida.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', md: '32%' } }}>
                        <Autocomplete
                            disablePortal
                            id="supplier-autocomplete"
                            options={state.suppliers.rows.map(s => ({ label: s.name, id: s?.id }))}
                            renderInput={(params) => <TextField {...params} label="Proveedor" />}
                            noOptionsText="No hay proveedores disponibles."
                            onChange={(_, value) => handleChange({
                                target: {
                                    name: 'supplier_id',
                                    value: value?.id as number
                                }
                            })}
                            isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        />
                        {errors.supplier_id?.type === 'required' &&
                            <Typography variant="caption" color="red" marginTop={1}>
                                * El proveedor es requerido.
                            </Typography>
                        }
                    </FormControl>
                    <FormControl sx={{ width: { xs: '100%', md: '32%' } }}>
                        <TextField
                            label="Stock mínimo"
                            type="number"
                            name="min_stock"
                            value={formData.min_stock}
                            onChange={e => handleChange({
                                target: {
                                    name: 'min_stock',
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
                </Box>
                {/* <FormControl>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DatePicker
                            label="Fecha expiración"
                            value={new Date(formData.expiration_date)}
                            onChange={value => handleChange({
                                target: {
                                    name: 'expiration_date',
                                    value: new Date(value!.toISOString())
                                }
                            })}
                        />
                    </LocalizationProvider>
                </FormControl>
                {open === EDIT &&
                    <FormControlLabel
                        control={<Checkbox />}
                        label="Activar / desactivar"
                        checked={formData.is_active}
                        onChange={(_, value) => handleChange({
                            target: { name: 'is_active', value }
                        })}
                    />
                } */}
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
    );
}