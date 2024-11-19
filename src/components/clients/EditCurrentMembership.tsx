import { useContext } from "react";
import { Box, Chip, Divider, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { format } from "date-fns";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { DataContext, Membership } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { useMemberships } from "../../hooks/useMemberships";

import { AddMembershipForm } from "./AddMembershipForm";
import { HandleVisits } from "./HandleVisits";
import { DeleteMembershipModal } from "./DeleteMembershipModal";

import { getExpirationDate } from "../../helpers/membership";
import { DELETE, EDIT } from "../../config/openTypes";
import { MAIN_COLOR } from "../../config/colors";

type EditCurrentMembershipProps = {
    membership: Membership;
}

export function EditCurrentMembership({ membership }: EditCurrentMembershipProps) {

    const { state } = useContext(DataContext);
    const {
        handleSubmit,
        handleDelete,
        addMembershipClass,
        removeMembershipClass,
        handleClose,
        open,
        setOpen
    } = useMemberships()
    const { formData, reset, handleChange, validate, setDisabled, errors, disabled } = useForm({
        defaultData: {
            id: membership.id,
            start: membership.start,
            duration: membership.duration,
            price: membership.price,
            limit: membership.limit,
            observations: membership.observations,
            payments_amount: membership.payments_amount,
            discount: membership.discount
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
        <>
            <Box sx={{
                width: '100%',
                borderRadius: 1,
                border: '1px solid #BDBDBD',
                padding: 1,
                color: '#000',
                mb: 3
            }}>
                <Typography variant="h6">
                    Detalles
                </Typography>
                <Tooltip title="Eliminar" onClick={() => setOpen(DELETE)}>
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={"Editar"} onClick={() => setOpen(EDIT)}>
                    <IconButton>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Fecha inicio</TableCell>
                                <TableCell align="center">Fecha vencimiento</TableCell>
                                <TableCell align="center">N° ingresos</TableCell>
                                <TableCell align="center">Monto</TableCell>
                                <TableCell align="center">Observaciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell align="center">{format(new Date(membership.start), 'dd-MM-yy')}</TableCell>
                                <TableCell align="center">
                                    {membership.limit > 0 ?
                                        format(getExpirationDate(membership), 'dd-MM-yy') :
                                        'Sin vencimiento'
                                    }
                                </TableCell>
                                <TableCell align="center">{`${visits.length}/${membership.limit}`}</TableCell>
                                <TableCell align="center">${membership.price}</TableCell>
                                <TableCell align="center">{membership.observations}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ marginTop: 1 }}>
                    <Divider textAlign="center" sx={{ color: '#000' }}>
                        Clases
                    </Divider>
                    <Stack direction="row" flexWrap="wrap" gap={1} spacing={1} padding={1}>
                        {state.classes.rows.filter(c => classes.map(c => c.name).includes(c.name))
                            .map(c => {
                                if (visits.some(v => v.class === c.name)) {
                                    return (
                                        <Chip
                                            key={c.id}
                                            label={c.name}
                                            sx={{
                                                color: '#fff',
                                                backgroundColor: MAIN_COLOR
                                            }}
                                        />
                                    );
                                } else {
                                    return (
                                        <Chip
                                            key={c.id}
                                            label={c.name}
                                            sx={{ border: '1px solid #fff' }}
                                            onDelete={() => removeMembershipClass({
                                                client_id: membership.client_id,
                                                membership_id: membership.id,
                                                class_id: c.id
                                            })}
                                        />
                                    );
                                }
                            })}
                        {state.classes.rows.filter(c => !classes.map(c => c.name).includes(c.name))
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
        </>
    );
}