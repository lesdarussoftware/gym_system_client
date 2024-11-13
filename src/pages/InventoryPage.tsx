import { useContext, useEffect, useMemo } from "react";
import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, Input, InputLabel, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext, Product } from "../providers/DataProvider";
import { useProducts } from "../hooks/useProducts";
import { useForm } from "../hooks/useForm";
import { useCategories } from "../hooks/useCategories";
import { useSuppliers } from "../hooks/useSuppliers";

import { Header } from "../components/common/Header";
import { LoginForm } from "../components/common/LoginForm";
import { DataGridBackend } from "../components/DataGrid/DataGridBackend";
import { ModalComponent } from "../components/common/ModalComponent";

import { DELETE, EDIT, NEW } from "../config/openTypes";

export function InventoryPage() {

    const { auth } = useContext(AuthContext);
    const { state } = useContext(DataContext);

    const { getCategories } = useCategories();
    const { getSuppliers } = useSuppliers();
    const { getProducts, open, setOpen, filter, setFilter, handleClose, handleSubmit, handleDelete } = useProducts();
    const { formData, setFormData, handleChange, validate, errors, disabled, setDisabled, reset } = useForm({
        defaultData: {
            id: '',
            gym_hash: '',
            name: '',
            sku: '',
            price: '',
            min_stock: '',
            is_active: true,
            expiration_date: '',
            category_id: '',
            supplier_id: ''
        },
        rules: {
            name: { required: true, maxLength: 55 },
            sku: { required: true, maxLength: 55 }
        }
    })

    useEffect(() => {
        if (auth) {
            getProducts();
            getCategories();
            getSuppliers();
        }
    }, [])

    const headCells = useMemo(() => [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N° registro',
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
            id: 'sku',
            numeric: false,
            disablePadding: true,
            label: 'SKU',
            accessor: 'sku'
        },
        {
            id: 'price',
            numeric: false,
            disablePadding: true,
            label: 'Precio',
            accessor: (row: Product) => `$${row.price}`
        },
        {
            id: 'category',
            numeric: false,
            disablePadding: true,
            label: 'Categoría',
            accessor: (row: Product) => row.category.name
        },
        {
            id: 'supplier',
            numeric: false,
            disablePadding: true,
            label: 'Proveedor',
            accessor: (row: Product) => row.supplier.name
        },
        {
            id: 'min_stock',
            numeric: false,
            disablePadding: true,
            label: 'Stock mínimo',
            accessor: 'min_stock'
        },
        {
            id: 'expiration_date',
            numeric: false,
            disablePadding: true,
            label: 'Fecha expiración',
            accessor: (row: Product) => format(new Date(row.expiration_date), 'dd-MM-yyyy')
        }
    ], [])

    return (
        <>
            {auth ?
                <>
                    <Header />
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h4">Productos</Typography>
                        <DataGridBackend
                            headCells={headCells}
                            rows={state.products.rows}
                            count={state.products.count}
                            setFormData={setFormData}
                            setOpen={setOpen}
                            filter={filter}
                            setFilter={setFilter}
                            showEditAction
                            showDeleteAction
                        >
                            <ModalComponent
                                open={open === NEW || open === EDIT}
                                onClose={() => handleClose(reset)}
                                reduceWidth={800}
                            >
                                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                                    {open === NEW && 'Registrar nuevo producto'}
                                    {open === EDIT && `Editar producto #${formData.id}`}
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
                                        <FormControl>
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
                                        <FormControl>
                                            <Autocomplete
                                                disablePortal
                                                id="category-autocomplete"
                                                options={state.categories.rows.map(c => ({ label: c.name, id: c?.id }))}
                                                renderInput={(params) => <TextField {...params} label="Buscar categoría..." />}
                                                noOptionsText="No hay categorías disponibles."
                                                onChange={(_, value) => handleChange({
                                                    target: {
                                                        name: 'category_id',
                                                        value: value?.id as number
                                                    }
                                                })}
                                                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <Autocomplete
                                                disablePortal
                                                id="supplier-autocomplete"
                                                options={state.suppliers.rows.map(s => ({ label: s.name, id: s?.id }))}
                                                renderInput={(params) => <TextField {...params} label="Buscar proveedor..." />}
                                                noOptionsText="No hay proveedores disponibles."
                                                onChange={(_, value) => handleChange({
                                                    target: {
                                                        name: 'supplier_id',
                                                        value: value?.id as number
                                                    }
                                                })}
                                                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                            />
                                        </FormControl>
                                        <FormControl>
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
                                        <FormControl>
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
                                        }
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
                            <ModalComponent
                                open={open === DELETE}
                                onClose={() => handleClose(reset)}
                            >
                                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                                    {`¿Desea borrar el registro del producto ${formData.name} (#${formData.id})?`}
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
                                        onClick={() => handleClose(reset)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="contained"
                                        sx={{
                                            width: '50%',
                                            margin: '0 auto',
                                            marginTop: 1,
                                            color: '#fff'
                                        }}
                                        disabled={disabled}
                                        onClick={() => handleDelete(formData, reset, setDisabled)}
                                    >
                                        Confirmar
                                    </Button>
                                </Box>
                            </ModalComponent>
                        </DataGridBackend>
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
    )
}