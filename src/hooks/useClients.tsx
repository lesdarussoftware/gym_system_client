/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react"

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useQuery } from "./useQuery";

import { CLIENT_URL, MEMBERSHIP_URL } from "../config/urls";
import { STATUS_CODES } from "../config/statusCodes";
import { SET_CLIENTS } from "../config/dataReducerActionTypes";
import { ERROR, SUCCESS } from "../config/messageProviderTypes";
import { EDIT, NEW } from "../config/openTypes";

export function useClients() {

    const { auth } = useContext(AuthContext);
    const { state, dispatch } = useContext(DataContext);
    const { setOpenMessage, setSeverity, setMessage } = useContext(MessageContext);
    const { handleQuery } = useQuery();
    const [open, setOpen] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            if (state.clients.length === 0) {
                const { status, data } = await handleQuery({ url: `${CLIENT_URL}/${auth?.me.gym.hash}` })
                if (status === STATUS_CODES.OK) {
                    dispatch({ type: SET_CLIENTS, payload: data })
                }
            }
        })()
    }, [])

    const handleSubmit = async (
        e: { preventDefault: () => void; },
        validate: () => any,
        formData: { id: any; },
        setDisabled: (arg0: boolean) => void,
        reset: (() => void) | undefined
    ) => {
        e.preventDefault();
        if (validate()) {
            const urls = { [NEW]: CLIENT_URL, [EDIT]: `${CLIENT_URL}/${auth?.me.gym.hash}/${formData.id}` };
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
                    payload: [data, ...state.clients]
                });
                setMessage('Cliente registrado correctamente.');
            } else if (status === STATUS_CODES.OK) {
                dispatch({
                    type: SET_CLIENTS,
                    payload: [data, ...state.clients.filter(item => item.id !== data.id)]
                });
                setMessage('Cliente editado correctamente.');
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
    }

    const handleSubmitMembership = async (
        e: { preventDefault: () => void; },
        validate: () => any,
        formData: { id: any; },
        setDisabled: (arg0: boolean) => void,
        reset: (() => void) | undefined
    ) => {
        e.preventDefault();
        if (validate()) {
            const urls = { [NEW]: MEMBERSHIP_URL, [EDIT]: `${MEMBERSHIP_URL}/${auth?.me.gym.hash}/${formData.id}` };
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
                    payload: [
                        ...state.clients.filter(item => item.id !== data.client_id),
                        {
                            ...state.clients.find(item => item.id === data.client_id)!,
                            memberships: [
                                data,
                                ...state.clients.find(item => item.id === data.client_id)!.memberships
                            ]
                        }
                    ]
                });
                setMessage('Membresía registrada correctamente.');
            } else if (status === STATUS_CODES.OK) {
                dispatch({
                    type: SET_CLIENTS,
                    payload: [
                        ...state.clients.filter(item => item.id !== data.client_id),
                        {
                            ...state.clients.find(item => item.id === data.client_id)!,
                            memberships: [
                                data,
                                ...state.clients.find(item => item.id === data.client_id)!.memberships
                                    .filter(item => item.id !== data.id)
                            ]
                        }
                    ]
                });
                setMessage('Membresía editada correctamente.');
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
            url: `${CLIENT_URL}/${auth?.me.gym.hash}/${formData.id}`,
            method: 'DELETE'
        });
        if (status === STATUS_CODES.OK) {
            dispatch({
                type: SET_CLIENTS,
                payload: [...state.clients.filter(item => item.id !== data.id)]
            });
            setSeverity(SUCCESS);
            setMessage('Cliente eliminado correctamente.');
            handleClose(reset);
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setMessage(data.message);
            setSeverity(ERROR);
            setDisabled(false);
        }
        setOpenMessage(true);
    }

    const handleDeleteMembership = async (
        formData: { id: any; },
        reset: () => void,
        setDisabled: (arg0: boolean) => void
    ) => {
        const { status, data } = await handleQuery({
            url: `${MEMBERSHIP_URL}/${auth?.me.gym.hash}/${formData.id}`,
            method: 'DELETE'
        });
        if (status === STATUS_CODES.OK) {
            dispatch({
                type: SET_CLIENTS,
                payload: [
                    ...state.clients.filter(item => item.id !== data.client_id),
                    {
                        ...state.clients.find(item => item.id === data.client_id)!,
                        memberships: [
                            ...state.clients.find(item => item.id === data.client_id)!.memberships
                                .filter(item => item.id !== data.id)
                        ]
                    }
                ]
            });
            setSeverity(SUCCESS);
            setMessage('Membresía eliminada correctamente.');
            handleClose(reset);
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setMessage(data.message);
            setSeverity(ERROR);
            setDisabled(false);
        }
        setOpenMessage(true);
    }

    return { handleSubmit, handleClose, handleDelete, open, setOpen, handleSubmitMembership, handleDeleteMembership }
}