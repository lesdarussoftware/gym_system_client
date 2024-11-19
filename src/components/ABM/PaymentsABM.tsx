import { useMemo } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { es } from "date-fns/locale";

import { Membership, Payment } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { usePayments } from "../../hooks/usePayments";

import { DataGridFrontend } from "../DataGrid/DataGridFrontend";
import { ModalComponent } from "../common/ModalComponent";

import { DELETE, EDIT, NEW } from "../../config/openTypes";
import { CURRENCIES, PAYMENT_STATUS, PAYMENT_TYPES } from "../../config/payments";
import { format } from "date-fns";

type PaymentsTableProps = {
    membership: Membership;
}

export function PaymentsABM({ membership }: PaymentsTableProps) {

    const { open, setOpen, handleClose, handleSubmit, handleDelete } = usePayments();
    const { formData, setFormData, reset, handleChange, disabled, setDisabled } = useForm({
        defaultData: {
            id: '',
            gym_hash: '',
            membership_id: membership.id,
            type: 'EFECTIVO',
            amount: 0,
            status: 'PENDIENTE',
            currency: 'ARS',
            date: new Date(Date.now())
        },
        rules: {}
    });

    const headCells = useMemo(() => [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: '#',
            accessor: 'id'
        },
        {
            id: 'date',
            numeric: true,
            disablePadding: false,
            label: 'Fecha',
            accessor: (row: Payment) => format(new Date(row.date), 'dd/MM/yy')
        },
        {
            id: 'amount',
            numeric: true,
            disablePadding: false,
            label: 'Monto',
            accessor: (row: Payment) => `${row.amount} ${row.currency}`
        },
        {
            id: 'type',
            numeric: true,
            disablePadding: false,
            label: 'Tipo',
            accessor: 'type'
        },
        {
            id: 'status',
            numeric: true,
            disablePadding: false,
            label: 'Estado',
            accessor: 'status'
        }
    ], []);

    return (
        <Box sx={{ p: 3 }}>
            <DataGridFrontend
                rows={membership.payments}
                headCells={headCells}
                setFormData={setFormData}
                setOpen={setOpen}
                stopPointerEvents
                showEditAction
                showDeleteAction
            >
                <ModalComponent open={open === NEW || open === EDIT} onClose={() => handleClose(reset)} reduceWidth={800}>
                    <Typography variant="h6" sx={{ marginBottom: 1 }}>
                        {open === NEW && 'Nuevo pago'}
                        {open === EDIT && `Editar pago #${formData.id}`}
                    </Typography>
                    <form onChange={handleChange} onSubmit={(e) => handleSubmit(e, formData, setDisabled, reset)}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <FormControl>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                    <DatePicker
                                        label="Fecha"
                                        value={new Date(formData.date)}
                                        onChange={value => handleChange({
                                            target: {
                                                name: 'date',
                                                value: new Date(value!.toISOString())
                                            }
                                        })}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                            <FormControl>
                                <TextField
                                    label="Monto"
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={e => handleChange({
                                        target: {
                                            name: 'amount',
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
                            <FormControl>
                                <InputLabel id="currency-select">Moneda</InputLabel>
                                <Select
                                    labelId="currency-select"
                                    id="currency"
                                    value={formData.currency}
                                    label="Estado"
                                    name="currency"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={CURRENCIES.ARS}>{CURRENCIES.ARS}</MenuItem>
                                    <MenuItem value={CURRENCIES.USD}>{CURRENCIES.USD}</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <InputLabel id="type-select">Tipo</InputLabel>
                                <Select
                                    labelId="type-select"
                                    id="type"
                                    value={formData.type}
                                    label="Tipo"
                                    name="type"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={PAYMENT_TYPES.EFECTIVO}>{PAYMENT_TYPES.EFECTIVO}</MenuItem>
                                    <MenuItem value={PAYMENT_TYPES.DEBITO}>{PAYMENT_TYPES.DEBITO}</MenuItem>
                                    <MenuItem value={PAYMENT_TYPES.CREDITO}>{PAYMENT_TYPES.CREDITO}</MenuItem>
                                    <MenuItem value={PAYMENT_TYPES.CHEQUE}>{PAYMENT_TYPES.CHEQUE}</MenuItem>
                                    <MenuItem value={PAYMENT_TYPES.TRANSFERENCIA}>{PAYMENT_TYPES.TRANSFERENCIA}</MenuItem>
                                </Select>
                            </FormControl>
                            {open === EDIT && (
                                <FormControl>
                                    <InputLabel id="status-select">Estado</InputLabel>
                                    <Select
                                        labelId="status-select"
                                        id="status"
                                        value={formData.status}
                                        label="Estado"
                                        name="status"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={PAYMENT_STATUS.PENDIENTE}>{PAYMENT_STATUS.PENDIENTE}</MenuItem>
                                        <MenuItem value={PAYMENT_STATUS.COMPLETADO}>{PAYMENT_STATUS.COMPLETADO}</MenuItem>
                                        <MenuItem value={PAYMENT_STATUS.FALLIDO}>{PAYMENT_STATUS.FALLIDO}</MenuItem>
                                        <MenuItem value={PAYMENT_STATUS.CANCELADO}>{PAYMENT_STATUS.CANCELADO}</MenuItem>
                                        <MenuItem value={PAYMENT_STATUS.REEMBOLSADO}>{PAYMENT_STATUS.REEMBOLSADO}</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
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
                                    disabled={disabled || +formData.amount <= 0}
                                >
                                    Guardar
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </ModalComponent>
                <ModalComponent open={open === DELETE} onClose={() => handleClose(reset)}>
                    <Typography variant="h6" sx={{ marginBottom: 1 }}>
                        {`¿Desea borrar el registro del pago #${formData.id}?`}
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
            </DataGridFrontend>
        </Box>
    );
}