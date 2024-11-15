/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';

import { Product } from "../../providers/DataProvider";

import { DataGridFrontend } from "../DataGrid/DataGridFrontend";
import { useMemo } from "react";

type ProductDetailsProps = {
    product: Product;
    movementData: any;
    handleClose: any;
    handleDelete: any;
}

export function ProductDetails({ product, movementData, handleClose, handleDelete }: ProductDetailsProps) {

    const { formData, setFormData, disabled, setDisabled, reset } = movementData;

    const headCells = useMemo(() => [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N° registro',
            accessor: 'id'
        },
        {
            id: 'quantity',
            numeric: true,
            disablePadding: false,
            label: 'Cantidad',
            accessor: 'quantity'
        },
        {
            id: 'remove',
            numeric: true,
            disablePadding: false,
            label: '',
            accessor: (row: Product) => (
                <Tooltip
                    title="Borrar"
                    onClick={() => {
                        setFormData(row);
                    }}
                >
                    <IconButton>
                        <DeleteSharpIcon />
                    </IconButton>
                </Tooltip>
            )
        },
    ], []);

    return (
        <Box>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
                Ingresos
            </Typography>
            <DataGridFrontend
                headCells={headCells}
                rows={product.incomes}
                stopPointerEvents
            />
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
                Egresos
            </Typography>
            <DataGridFrontend
                headCells={headCells}
                rows={product.expenses}
                stopPointerEvents
            />
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
        </Box>
    )
}