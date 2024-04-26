/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";
import { Box, Button, Typography } from "@mui/material";
import { format } from "date-fns";

import { Client, DataContext } from "../../providers/DataProvider";
import { useClients } from "../../hooks/useClients";
import { useForm } from "../../hooks/useForm";

import { DataGrid } from "../DataGrid/DataGrid";
import { ModalComponent } from "../common/ModalComponent";
import { InactiveMembershipDetails } from "./InactiveMembershipDetails";

import { DELETE, VIEW_MEMBERSHIP_DETAILS } from "../../config/openTypes";
import { membershipIsActive } from "../../helpers/membership";
import { AddMembershipForm } from "./AddMembershipForm";

type MembershipsAMBPRops = {
    client: Client;
}

export function MemebershipsABM({ client }: MembershipsAMBPRops) {

    const { state } = useContext(DataContext);
    const { open, setOpen, handleClose, handleSubmitMembership, handleDeleteMembership } = useClients();
    const { formData, setFormData, reset, handleChange, validate, setDisabled, errors, disabled } = useForm({
        defaultData: {
            id: '',
            client_id: client.id,
            start: new Date(Date.now()),
            duration: 30,
            price: 0,
            limit: 12,
            gym_hash: ''
        },
        rules: {
            start: { required: true },
            duration: { required: true },
            limit: { required: true },
            price: { required: true }
        }
    });

    const headCells = [
        {
            id: 'id',
            numeric: true,
            disablePadding: false,
            label: 'N° registro',
            accessor: 'id'
        },
        {
            id: 'price',
            numeric: false,
            disablePadding: true,
            label: 'Precio',
            accessor: (row: { price: number; }) => `$${row.price.toFixed(2)}`
        },
        {
            id: 'start',
            numeric: false,
            disablePadding: true,
            label: 'Fecha inicio',
            accessor: (row: { start: any; }) => format(new Date(row.start), 'dd-MM-yy')
        },
        {
            id: 'duration',
            numeric: false,
            disablePadding: true,
            label: 'Fecha vencimiento',
            accessor: 'duration'
        },
        {
            id: 'limit',
            numeric: false,
            disablePadding: true,
            label: 'Límite de visitas',
            accessor: 'limit'
        }
    ]

    return (
        <DataGrid
            headCells={headCells}
            rows={state.clients.find(c => c.id === client.id)!.memberships.filter(m => !membershipIsActive(m))}
            setFormData={setFormData}
            setOpen={setOpen}
            showMembershipDetails
            hideAddMembership
        >
            <AddMembershipForm
                open={open}
                handleClose={handleClose}
                reset={reset}
                formData={formData}
                handleChange={handleChange}
                handleSubmitMembership={handleSubmitMembership}
                validate={validate}
                disabled={disabled}
                setDisabled={setDisabled}
                errors={errors}
            />
            <ModalComponent
                open={open === DELETE}
                onClose={() => handleClose(reset)}
            >
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                    {`¿Desea borrar el registro de la membresía #${formData.id}?`}
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
                            marginTop: 1
                        }}
                        disabled={disabled}
                        onClick={() => handleDeleteMembership(formData, reset, setDisabled)}
                    >
                        Confirmar
                    </Button>
                </Box>
            </ModalComponent>
            <ModalComponent
                open={open === VIEW_MEMBERSHIP_DETAILS}
                onClose={() => handleClose(reset)}
            >
                <InactiveMembershipDetails
                    membership={state.clients.find(c => c.id === client.id)!.memberships
                        .find(m => m.id === formData.id)!
                    }
                />
                <Box sx={{ marginTop: 1, display: 'flex', justifyContent: 'end' }}>
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={() => handleClose(reset)}
                    >
                        Cerrar
                    </Button>
                </Box>
            </ModalComponent>
        </DataGrid>
    );
}