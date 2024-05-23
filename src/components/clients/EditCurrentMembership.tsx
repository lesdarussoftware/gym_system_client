import { useContext } from "react";
import { Box, Chip, Divider, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { format } from "date-fns";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { DataContext, Membership } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { useClients } from "../../hooks/useClients";
import { useMemberships } from "../../hooks/useMemberships";

import { AddMembershipForm } from "./AddMembershipForm";
import { HandleVisits } from "./HandleVisits";
import { DeleteMembershipModal } from "./DeleteMembershipModal";

import { getExpirationDate } from "../../helpers/membership";
import { DELETE, EDIT } from "../../config/openTypes";

type EditCurrentMembershipProps = {
    membership: Membership;
}

export function EditCurrentMembership({ membership }: EditCurrentMembershipProps) {

    const { state } = useContext(DataContext);
    const { open, setOpen, handleClose } = useClients();
    const { handleSubmit, handleDelete, addMembershipClass, removeMembershipClass } = useMemberships()
    const { formData, reset, handleChange, validate, setDisabled, errors, disabled } = useForm({
        defaultData: {
            id: membership.id,
            start: membership.start,
            duration: membership.duration,
            price: membership.price,
            limit: membership.limit,
            observations: membership.observations
        },
        rules: {
            start: { required: true },
            duration: { required: true },
            limit: { required: true },
            price: { required: true },
            observations: { maxLength: 255 }
        }
    });
    const classes = membership.classes.map(c => ({
        id: c.id,
        name: c.class.name
    }));
    const visits = membership.classes.flatMap(c => c.visits).map(v => {
        const currClass = classes.find(c => c.id === v.membership_class_id)!
        return {
            id: v.id,
            membership_class_id: v.membership_class_id,
            class: currClass.name,
            date: format(new Date(v.date), 'dd-MM-yy')
        }
    });

    return (
        <Box sx={{ display: 'flex', gap: 1, margin: '0 auto' }}>
            <Box sx={{
                width: '30%',
                borderRadius: 1,
                border: '1px solid #BDBDBD',
                padding: 1,
                color: '#000'
            }}>
                <Typography variant="h6">
                    Detalles
                </Typography>
                <Tooltip title="Eliminar" onClick={() => setOpen(DELETE)}>
                    <IconButton sx={{ color: '#000' }}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={"Editar"} onClick={() => setOpen(EDIT)}>
                    <IconButton sx={{ color: '#000' }}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <table style={{ width: '100%' }}>
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
                        <tr>
                            <th>Observaciones</th>
                            <td>{membership.observations}</td>
                        </tr>
                    </tbody>
                </table>
                <Box sx={{ marginTop: 1 }}>
                    <Divider textAlign="center" sx={{ color: '#000' }}>
                        Clases
                    </Divider>
                    <Stack direction="row" flexWrap="wrap" gap={1} spacing={1} padding={1}>
                        {state.classes.filter(c => classes.map(c => c.name).includes(c.name))
                            .map(c => {
                                if (visits.some(v => v.class === c.name)) {
                                    return (
                                        <Chip
                                            key={c.id}
                                            label={c.name}
                                            sx={{
                                                color: '#fff',
                                                backgroundColor: 'gray'
                                            }}
                                        />
                                    );
                                } else {
                                    return (
                                        <Chip
                                            key={c.id}
                                            label={c.name}
                                            sx={{
                                                border: '1px solid #fff',
                                                color: '#fff',
                                                backgroundColor: 'gray'
                                            }}
                                            onDelete={() => removeMembershipClass({
                                                client_id: membership.client_id,
                                                membership_id: membership.id,
                                                class_id: c.id
                                            })}
                                        />
                                    );
                                }
                            })}
                        {state.classes.filter(c => !classes.map(c => c.name).includes(c.name))
                            .map(c => {
                                return (
                                    <Chip
                                        key={c.id}
                                        label={c.name}
                                        variant="outlined"
                                        sx={{
                                            backgroundColor: '#fff',
                                            ':hover': {
                                                color: '#000',
                                            }
                                        }}
                                        onClick={() => addMembershipClass({
                                            client_id: membership.client_id,
                                            membership_id: membership.id,
                                            class_id: c.id
                                        })}
                                    />
                                );
                            })}
                    </Stack>
                </Box>
            </Box>
            <AddMembershipForm
                open={open}
                handleClose={handleClose}
                reset={reset}
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                validate={validate}
                disabled={disabled}
                setDisabled={setDisabled}
                errors={errors}
            />
            <DeleteMembershipModal
                open={open}
                handleClose={handleClose}
                reset={reset}
                formData={formData}
                disabled={disabled}
                handleDelete={handleDelete}
                setDisabled={setDisabled}
            />
            <HandleVisits
                visits={visits}
                classes={classes}
                membership={membership}
            />
        </Box >
    );
}