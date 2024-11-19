import { useContext } from "react";
import { Box, Button, Typography } from "@mui/material";

import { Client, DataContext } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { useMemberships } from "../../hooks/useMemberships";

import { EditCurrentMembership } from "./EditCurrentMembership";
import { AddMembershipForm } from "./AddMembershipForm";

import { membershipIsActive } from "../../helpers/membership";
import { NEW } from "../../config/openTypes";

type ShowCurrentMembershipProps = {
    client: Client;
}

export function ShowCurrentMembership({ client }: ShowCurrentMembershipProps) {

    const { state } = useContext(DataContext);
    const { handleSubmit, open, setOpen, handleClose } = useMemberships();
    const { formData, reset, handleChange, validate, setDisabled, errors, disabled } = useForm({
        defaultData: {
            id: '',
            client_id: client.id,
            start: new Date(Date.now()),
            duration: 0,
            price: 0,
            limit: 0,
            gym_hash: '',
            discount: 0,
            payments_amount: 1
        },
        rules: {
            start: { required: true },
            duration: { required: true },
            limit: { required: true },
            price: { required: true }
        }
    });
    const membership = state.clients.rows.find(c => c.id === client.id)!.memberships.find(m => membershipIsActive(m));

    return (
        <Box>
            {membership ?
                <EditCurrentMembership membership={membership} /> :
                <>
                    <Typography variant="h5" marginBottom={2} sx={{ color: '#000' }}>
                        El cliente no tiene una membresía activa
                    </Typography>
                    <Button type="button" variant="outlined" onClick={() => setOpen(NEW)}>
                        Nueva
                    </Button>
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
                </>
            }
        </Box>
    );
}