/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Typography } from "@mui/material";

import { ModalComponent } from "../common/ModalComponent";

import { DELETE } from "../../config/openTypes";

type DeleteMembershipModalProps = {
    open: any,
    handleClose: any,
    reset: any,
    formData: any,
    disabled: any,
    handleDelete: any,
    setDisabled: any
}

export function DeleteMembershipModal({
    open,
    handleClose,
    reset,
    formData,
    disabled,
    handleDelete,
    setDisabled
}: DeleteMembershipModalProps) {
    return (
        <ModalComponent open={open === DELETE} onClose={() => handleClose(reset)} reduceWidth={800}>
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
    );
}