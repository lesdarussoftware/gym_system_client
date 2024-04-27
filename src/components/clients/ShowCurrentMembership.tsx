import { useContext } from "react";
import { Box, Button, Typography } from "@mui/material";

import { Client, DataContext } from "../../providers/DataProvider";
import { useClients } from "../../hooks/useClients";
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
    const { handleSubmit } = useMemberships();
    const { open, setOpen, handleClose } = useClients();
    const { formData, reset, handleChange, validate, setDisabled, errors, disabled } = useForm({
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
    const membership = state.clients.find(c => c.id === client.id)!.memberships.find(m => membershipIsActive(m));

    return (
        <Box>
            {membership ?
                <EditCurrentMembership membership={membership} /> :
                <>
                    <Typography variant="h5" marginBottom={2}>
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