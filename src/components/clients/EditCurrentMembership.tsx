import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { format } from "date-fns";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { Membership } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { useClients } from "../../hooks/useClients";

import { AddMembershipForm } from "./AddMembershipForm";
import { AddNewVisit } from "./AddNewVisit";

import { getExpirationDate } from "../../helpers/membership";

type EditCurrentMembershipProps = {
    membership: Membership;
}

export function EditCurrentMembership({ membership }: EditCurrentMembershipProps) {

    const { open, setOpen, handleClose, handleSubmitMembership, handleDeleteMembership } = useClients();
    const { formData, setFormData, reset, handleChange, validate, setDisabled, errors, disabled } = useForm({
        defaultData: {
            start: membership.start,
            duration: membership.duration,
            price: membership.price,
            limit: membership.limit
        },
        rules: {
            start: { required: true },
            duration: { required: true },
            limit: { required: true },
            price: { required: true }
        }
    });
    const classes = membership.classes.map(c => ({
        id: c.id,
        name: c.class.name
    }));
    const visits = membership.classes.flatMap(c => c.visits).map(v => {
        const currClass = classes.find(c => c.id === v.membership_class_id)!
        return {
            class: currClass.name,
            date: format(new Date(v.date), 'dd-MM-yy')
        }
    });

    return (
        <>
            <Box sx={{ display: 'flex', gap: 1, width: '80%', margin: '0 auto' }}>
                <Box sx={{ width: '30%', borderRadius: 1, boxShadow: '3px 3px 5px gray', padding: 1 }}>
                    <Typography variant="h6">
                        Detalles
                    </Typography>
                    <Tooltip title="Eliminar" onClick={() => {
                        // setOpen(DELETE);
                        // setFormData(rows.find((row: { id: number; }) => row.id === selected[0]));
                    }}>
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={"Editar"} onClick={() => {
                        // setOpen(EDIT);
                        // setFormData(rows.find((row: { id: number; }) => row.id === selected[0]));
                    }}>
                        <IconButton>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <table>
                        <tbody>
                            <tr>
                                <th>Fecha inicio</th>
                                <td>{format(new Date(membership.start), 'dd-MM-yy')}</td>
                            </tr>
                            <tr>
                                <th>Fecha vencimiento</th>
                                <td>{format(getExpirationDate(membership), 'dd-MM-yy')}</td>
                            </tr>
                            <tr>
                                <th>N° visitas</th>
                                <td>{`${visits.length}/${membership.limit}`}</td>
                            </tr>
                            <tr>
                                <th>Monto</th>
                                <td>${membership.price}</td>
                            </tr>
                        </tbody>
                    </table>
                </Box>
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
                <AddNewVisit
                    visits={visits}
                    classes={classes}
                />
            </Box>
        </>
    );
}