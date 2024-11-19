/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from "react";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useQuery } from "./useQuery";

import { PAYMENT_URL } from "../config/urls";
import { NEW, EDIT } from "../config/openTypes";
import { STATUS_CODES } from "../config/statusCodes";
import { SET_CLIENTS } from "../config/dataReducerActionTypes";
import { ERROR, SUCCESS } from "../config/messageProviderTypes";

export function usePayments() {

    const { auth } = useContext(AuthContext);
    const { state, dispatch } = useContext(DataContext);
    const { setOpenMessage, setSeverity, setMessage } = useContext(MessageContext);

    const { handleQuery } = useQuery();

    const [open, setOpen] = useState<string | null>(null);

    const handleSubmit = async (
        e: { preventDefault: () => void; },
        formData: { id: any; },
        setDisabled: (arg0: boolean) => void,
        reset: (() => void) | undefined
    ) => {
        e.preventDefault();
        const urls = { [NEW]: PAYMENT_URL, [EDIT]: `${PAYMENT_URL}/${auth?.me.gym.hash}/${formData.id}` };
        const { status, data } = await handleQuery({
            url: open === NEW || open === EDIT ? urls[open] : '',
            method: open === NEW ? 'POST' : open === EDIT ? 'PUT' : 'GET',
            body: JSON.stringify({
                ...formData,
                gym_hash: auth?.me.gym.hash
            })
        });
        if (status === STATUS_CODES.CREATED) {
            dispatch({
                type: SET_CLIENTS,
                payload: {
                    ...state.clients,
                    rows: [data, ...state.clients.rows],
                    count: state.clients.count + 1
                }
            });
            setMessage('Pago registrado correctamente.');
        } else if (status === STATUS_CODES.OK) {
            dispatch({
                type: SET_CLIENTS,
                payload: { ...state.clients, rows: [data, ...state.clients.rows.filter(item => item.id !== data.id)] }
            });
            setMessage('Pago editado correctamente.');
        } else {
            setMessage('Hubo un problema al procesar la solicitud.');
            setSeverity(ERROR);
            setDisabled(false);
        }
        if (status === STATUS_CODES.CREATED || status === STATUS_CODES.OK) {
            setSeverity(SUCCESS);
            handleClose(reset);
        }
        setOpenMessage(true);
    }

    const handleClose = (reset: (() => void) | undefined) => {
        setOpen(null);
        reset!();
    }

    const handleDelete = async (
        formData: { id: any; },
        reset: () => void,
        setDisabled: (arg0: boolean) => void
    ) => {
        const { status, data } = await handleQuery({
            url: `${PAYMENT_URL}/${auth?.me.gym.hash}/${formData.id}`,
            method: 'DELETE'
        });
        if (status === STATUS_CODES.OK) {
            dispatch({
                type: SET_CLIENTS,
                payload: {
                    ...state.clients,
                    rows: [...state.clients.rows.filter(item => item.id !== data.id)],
                    count: state.clients.count - 1
                }
            });
            setSeverity(SUCCESS);
            setMessage('Pago eliminado correctamente.');
            handleClose(reset);
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setMessage(data.message);
            setSeverity(ERROR);
            setDisabled(false);
        }
        setOpenMessage(true);
    }

    return {
        open,
        setOpen,
        handleSubmit,
        handleClose,
        handleDelete
    }
}