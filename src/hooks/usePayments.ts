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

    async function handleSubmit(
        e: { preventDefault: () => void; },
        formData: { id: any; },
        setDisabled: (arg0: boolean) => void,
        reset: (() => void) | undefined
    ) {
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
        if (status === STATUS_CODES.CREATED || status === STATUS_CODES.OK) {
            const membership = state.clients.rows.flatMap(c => c.memberships).find(m => m.id === data.membership_id)!;
            const client = state.clients.rows.find(c => c.id === membership.client_id)!;
            const otherMemberships = client.memberships.filter(m => m.id !== membership.id);
            const otherClients = state.clients.rows.filter(c => c.id !== client!.id);
            const otherPayments = membership!.payments.filter(p => p.id !== data.id);
            if (status === STATUS_CODES.CREATED) {
                dispatch({
                    type: SET_CLIENTS,
                    payload: {
                        ...state.clients,
                        rows: [
                            ...otherClients,
                            {
                                ...client,
                                memberships: [
                                    ...otherMemberships,
                                    {
                                        ...membership,
                                        payments: [
                                            ...membership.payments,
                                            data
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                });
                setMessage('Pago registrado correctamente.');
            } else {
                dispatch({
                    type: SET_CLIENTS,
                    payload: {
                        ...state.clients,
                        rows: [
                            ...otherClients,
                            {
                                ...client,
                                memberships: [
                                    ...otherMemberships,
                                    {
                                        ...membership,
                                        payments: [
                                            ...otherPayments,
                                            data
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                });
                setMessage('Pago editado correctamente.');
            }
            setSeverity(SUCCESS);
            handleClose(reset);
        } else {
            setMessage('Hubo un problema al procesar la solicitud.');
            setSeverity(ERROR);
            setDisabled(false);
        }
        setOpenMessage(true);
    }

    function handleClose(reset: (() => void) | undefined) {
        setOpen(null);
        reset!();
    }

    async function handleDelete(formData: { id: any; }, reset: () => void, setDisabled: (arg0: boolean) => void) {
        const { status, data } = await handleQuery({
            url: `${PAYMENT_URL}/${auth?.me.gym.hash}/${formData.id}`,
            method: 'DELETE'
        });
        if (status === STATUS_CODES.OK) {
            const membership = state.clients.rows.flatMap(c => c.memberships).find(m => m.id === data.membership_id)!;
            const client = state.clients.rows.find(c => c.id === membership.client_id)!;
            const otherMemberships = client.memberships.filter(m => m.id !== membership.id);
            const otherClients = state.clients.rows.filter(c => c.id !== client!.id);
            const otherPayments = membership!.payments.filter(p => p.id !== data.id);
            dispatch({
                type: SET_CLIENTS,
                payload: {
                    ...state.clients,
                    rows: [
                        ...otherClients,
                        {
                            ...client,
                            memberships: [
                                ...otherMemberships,
                                {
                                    ...membership,
                                    payments: [...otherPayments]
                                }
                            ]
                        }
                    ]
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