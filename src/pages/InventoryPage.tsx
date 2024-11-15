import { useContext, useEffect, useMemo } from "react";
import { Box, Button, Typography } from "@mui/material";
import { format } from "date-fns";

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
import { MovementForm } from "../components/products/MovementForm";
import { ProductForm } from "../components/products/ProductForm";

import { DELETE, EDIT, NEW } from "../config/openTypes";
import { movementTypes } from "../config/movementTypes";
import { getProductStock } from "../helpers/utils";

export function InventoryPage() {

    const { auth } = useContext(AuthContext);
    const { state } = useContext(DataContext);

    const { getCategories } = useCategories();
    const { getSuppliers } = useSuppliers();
    const {
        getProducts,
        open,
        setOpen,
        filter,
        setFilter,
        handleClose,
        handleSubmit,
        handleDelete,
        handleSubmitMovement
    } = useProducts();
    const { formData, setFormData, handleChange, validate, errors, disabled, setDisabled, reset } = useForm({
        defaultData: {
            id: '',
            gym_hash: '',
            name: '',
            sku: '',
            price: 0,
            min_stock: 0,
            is_active: true,
            expiration_date: '',
            category_id: '',
            supplier_id: ''
        },
        rules: {
            name: { required: true, maxLength: 55 },
            sku: { required: true, maxLength: 55 },
            category_id: { required: true },
            supplier_id: { required: true }
        }
    })
    const movementData = useForm({
        defaultData: {
            id: '',
            gym_hash: '',
            product_id: '',
            product_price: 0,
            quantity: 0,
            type: movementTypes.AJUSTE,
            description: '',
            discount: 0,
            final_price: 0
        },
        rules: { description: { maxLength: 100 } }
    })

    useEffect(() => {
        if (auth) {
            getProducts();
            getCategories();
            getSuppliers();
        }
    }, [])

    useEffect(() => {
        if (open !== null) {
            movementData.setFormData({
                ...movementData.formData,
                product_id: formData.id,
                product_price: formData.price
            });
        }
    }, [formData, open])

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
            id: 'current_stock',
            numeric: false,
            disablePadding: true,
            label: 'Stock actual',
            accessor: (row: Product) => getProductStock(row)
        },
        {
            id: 'expiration_date',
            numeric: false,
            disablePadding: true,
            label: 'Fecha expiración',
            accessor: (row: Product) => row.expiration_date ? format(new Date(row.expiration_date), 'dd-MM-yyyy') : ''
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
                            showInput
                            showOutput
                            showViewAction
                        >
                            <ModalComponent
                                open={open === NEW || open === EDIT}
                                onClose={() => handleClose(reset)}
                                reduceWidth={800}
                            >
                                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                                    {open === NEW && 'Nuevo producto'}
                                    {open === EDIT && `Editar producto #${formData.id}`}
                                </Typography>
                                <ProductForm
                                    handleChange={handleChange}
                                    handleSubmit={handleSubmit}
                                    validate={validate}
                                    formData={formData}
                                    setDisabled={setDisabled}
                                    reset={reset}
                                    errors={errors}
                                    handleClose={handleClose}
                                    disabled={disabled}
                                // open={open}
                                />
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
                            <ModalComponent
                                open={open === 'NEW_INCOME' || open === 'NEW_EXPENSE'}
                                onClose={() => handleClose(reset)}
                                reduceWidth={800}
                            >
                                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                                    {`Nuevo ${open === 'NEW_INCOME' ? 'Ingreso' : 'Egreso'}`}
                                </Typography>
                                <MovementForm
                                    movementData={movementData}
                                    open={open}
                                    handleSubmit={handleSubmitMovement}
                                    handleClose={handleClose}
                                />
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