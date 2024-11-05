import { Typography } from "@mui/material";
import { Membership } from "../../providers/DataProvider";
import { DataGridFrontend } from "../DataGrid/DataGridFrontend";
import { format } from "date-fns";

type InactiveMembershipDetailesProps = {
    membership: Membership;
}

export function InactiveMembershipDetails({ membership }: InactiveMembershipDetailesProps) {

    const classes = membership?.classes.map(c => ({ id: c.id, name: c.class.name }))
    const visits = membership?.classes.flatMap(c => c.visits)

    const headCells = [
        {
            id: 'date',
            numeric: false,
            disablePadding: true,
            label: 'Fecha',
            accessor: (row: { date: string | number | Date; }) => format(new Date(row.date), 'dd-MM-yy')
        },
        {
            id: 'class',
            numeric: false,
            disablePadding: true,
            label: 'Clase',
            accessor: (row: { membership_class_id: number; }) => classes.find(c => c.id === row.membership_class_id)!.name
        }
    ];

    return (
        <>
            <Typography variant="h6" marginBottom={1}>
                Clases e ingresos
            </Typography>
            <DataGridFrontend
                headCells={headCells}
                rows={visits ?? []}
                stopPointerEvents
            />
        </>
    );
}