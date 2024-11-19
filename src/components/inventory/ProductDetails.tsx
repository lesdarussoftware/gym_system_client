/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Box, Button, IconButton, Tab, Tabs, Tooltip } from "@mui/material";
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import { format } from "date-fns";

import { Expense, Income, Product } from "../../providers/DataProvider";

import { DataGridFrontend } from "../DataGrid/DataGridFrontend";
import { CustomTabPanel } from "../common/CustomTabPanel";

import { a11yProps } from "../../helpers/utils";
import { EXPENSE_URL, INCOME_URL } from "../../config/urls";

type ProductDetailsProps = {
    product: Product;
    movementData: any;
    handleClose: any;
    handleDelete: any;
}

export function ProductDetails({ product, movementData, handleClose, handleDelete }: ProductDetailsProps) {

    const { formData, setFormData, disabled, setDisabled, reset } = movementData;

    const [valueTab, setValueTab] = useState(0);

    useEffect(() => {
        reset()
    }, [valueTab])

    const handleChangeTab = (_event: any, newValue: number) => {
        setValueTab(newValue);
    };

    const headCells = useMemo(() => [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N° registro',
            accessor: 'id'
        },
        {
            id: 'date',
            numeric: true,
            disablePadding: false,
            label: 'Fecha',
            accessor: (row: Income | Expense) => format(new Date(row.date), 'dd/MM/yy')
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
            <Tabs value={valueTab} onChange={handleChangeTab} aria-label="basic tabs example">
                <Tab label="Ingresos" {...a11yProps(0)} />
                <Tab label="Egresos" {...a11yProps(1)} />
            </Tabs>
            <CustomTabPanel value={valueTab} index={0}>
                <DataGridFrontend
                    headCells={headCells}
                    rows={product?.incomes ?? []}
                    stopPointerEvents
                />
            </CustomTabPanel>
            <CustomTabPanel value={valueTab} index={1}>
                <DataGridFrontend
                    headCells={headCells}
                    rows={product?.expenses ?? []}
                    stopPointerEvents
                />
            </CustomTabPanel>
            <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: '40%' }, m: { xs: 0, md: 'auto' } }}>
                <Button
                    type="button"
                    variant="outlined"
                    sx={{
                        width: '50%',
                        margin: '0 auto',
                        marginTop: 3
                    }}
                    onClick={() => formData.id ? reset() : handleClose(reset)}
                >
                    {formData.id ? 'Cancelar' : 'Cerrar'}
                </Button>
                {formData.id && (
                    <Button
                        type="button"
                        variant="contained"
                        sx={{
                            width: '50%',
                            margin: '0 auto',
                            marginTop: 3,
                            color: '#fff',
                            backgroundColor: '#F00',
                            ':hover': {
                                backgroundColor: '#F00'
                            }
                        }}
                        disabled={disabled}
                        onClick={() => {
                            const url = valueTab === 0 ? INCOME_URL : EXPENSE_URL;
                            handleDelete(formData, reset, setDisabled, url);
                        }}
                    >
                        {`Borrar registro N° ${formData.id}`}
                    </Button>
                )}
            </Box>
        </Box>
    )
}