/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";
import { Client, DataContext } from "../../providers/DataProvider";
import { DataGrid } from "../DataGrid/DataGrid";
import { useClients } from "../../hooks/useClients";
import { useForm } from "../../hooks/useForm";

type MembershipsAMBPRops = {
    client: Client;
}

export function MemebershipsABM({ client }: MembershipsAMBPRops) {

    const { state } = useContext(DataContext);
    const { setOpen } = useClients();
    const { setFormData } = useForm({
        defaultData: { id: '', client_id: client.id, start: '', duration: '', price: '', gym_hash: '' },
        rules: { start: { required: true }, duration: { required: true }, price: { required: true } }
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
            id: 'start',
            numeric: false,
            disablePadding: true,
            label: 'Fecha inicio',
            accessor: (row: { start: any; }) => row.start
        },
        {
            id: 'duration',
            numeric: false,
            disablePadding: true,
            label: 'Fecha vencimiento',
            accessor: 'duration'
        },
        {
            id: 'price',
            numeric: false,
            disablePadding: true,
            label: 'Precio',
            accessor: (row: { price: number; }) => `$${row.price.toFixed(2)}`
        }
    ]

    return (
        <DataGrid
            headCells={headCells}
            rows={state.clients.find(c => c.id === client.id)!.memberships}
            setFormData={setFormData}
            setOpen={setOpen}
        />
    );
}