/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";
import { Box, Button } from "@mui/material";
import { format } from "date-fns";

import { Client, DataContext } from "../../providers/DataProvider";
import { useClients } from "../../hooks/useClients";
import { useForm } from "../../hooks/useForm";
import { useMemberships } from "../../hooks/useMemberships";

import { DataGrid } from "../DataGrid/DataGrid";
import { ModalComponent } from "../common/ModalComponent";
import { InactiveMembershipDetails } from "./InactiveMembershipDetails";
import { DeleteMembershipModal } from "./DeleteMembershipModal";

import { VIEW_MEMBERSHIP_DETAILS } from "../../config/openTypes";
import { membershipIsActive } from "../../helpers/membership";

type MembershipsAMBPRops = {
    client: Client;
}

export function MemebershipsABM({ client }: MembershipsAMBPRops) {

    const { state } = useContext(DataContext);
    const { handleDelete } = useMemberships();
    const { open, setOpen, handleClose } = useClients();
    const { formData, setFormData, reset, setDisabled, disabled } = useForm({
        defaultData: {
            id: '',
            client_id: client.id,
            start: new Date(Date.now()),
            duration: 30,
            price: 0,
            limit: 12,
            gym_hash: '',
            observations: ''
        },
        rules: {
            start: { required: true },
            duration: { required: true },
            limit: { required: true },
            price: { required: true },
            observations: { maxLength: 255 }
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
            hideEditAction
        >
            <DeleteMembershipModal
                open={open}
                handleClose={handleClose}
                reset={reset}
                formData={formData}
                disabled={disabled}
                handleDelete={handleDelete}
                setDisabled={setDisabled}
            />
            <ModalComponent open={open === VIEW_MEMBERSHIP_DETAILS} onClose={() => handleClose(reset)} reduceWidth={800}>
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