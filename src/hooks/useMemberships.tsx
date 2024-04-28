/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from "react";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useQuery } from "./useQuery";

import { MEMBERSHIP_URL, MEMBERSHIP_CLASS_URL, VISIT_URL } from "../config/urls";
import { EDIT, NEW } from "../config/openTypes";
import { STATUS_CODES } from "../config/statusCodes";
import { SET_CLIENTS } from "../config/dataReducerActionTypes";
import { ERROR, SUCCESS } from "../config/messageProviderTypes";

export function useMemberships() {

    const { auth } = useContext(AuthContext);
    const { state, dispatch } = useContext(DataContext);
    const { setOpenMessage, setSeverity, setMessage } = useContext(MessageContext);
    const { handleQuery } = useQuery();
    const [open, setOpen] = useState<string | null>(null);

    const handleSubmit = async (
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

    const handleDelete = async (
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


    const handleClose = (reset: (() => void) | undefined) => {
        setOpen(null);
        reset!();
    }

    const addMembershipClass = async (formData: {
        client_id: number;
        membership_id: number;
        class_id: number;
    }) => {
        const { status, data } = await handleQuery({
            url: MEMBERSHIP_CLASS_URL,
            method: 'POST',
            body: JSON.stringify({
                ...formData,
                gym_hash: auth?.me.gym.hash
            })
        });
        if (status === STATUS_CODES.CREATED) {
            dispatch({
                type: SET_CLIENTS,
                payload: [
                    ...state.clients.filter(item => item.id !== formData.client_id),
                    {
                        ...state.clients.find(item => item.id === formData.client_id)!,
                        memberships: [
                            ...state.clients.find(item => item.id === formData.client_id)!.memberships
                                .filter(m => m.id !== formData.membership_id),
                            {
                                ...state.clients.find(item => item.id === formData.client_id)!.memberships
                                    .find(m => m.id === formData.membership_id)!,
                                classes: [
                                    data,
                                    ...state.clients.find(item => item.id === formData.client_id)!.memberships
                                        .find(m => m.id === formData.membership_id)!.classes
                                ]
                            }
                        ]
                    }
                ]
            });
            setMessage('Clase habilitada correctamente.');
            setSeverity(SUCCESS);
        } else {
            setMessage('Hubo un problema al procesar la solicitud.');
            setSeverity(ERROR);
        }
        setOpenMessage(true);
    }

    const removeMembershipClass = async (formData: {
        client_id: number;
        membership_id: number;
        class_id: number;
    }) => {
        const { status, data } = await handleQuery({
            url: `${MEMBERSHIP_CLASS_URL}/${auth?.me.gym.hash}/${formData.membership_id}/${formData.class_id}`,
            method: 'DELETE'
        });
        if (status === STATUS_CODES.OK) {
            dispatch({
                type: SET_CLIENTS,
                payload: [
                    ...state.clients.filter(item => item.id !== formData.client_id),
                    {
                        ...state.clients.find(item => item.id === formData.client_id)!,
                        memberships: [
                            ...state.clients.find(item => item.id === formData.client_id)!.memberships
                                .filter(m => m.id !== formData.membership_id),
                            {
                                ...state.clients.find(item => item.id === formData.client_id)!.memberships
                                    .find(m => m.id === formData.membership_id)!,
                                classes: [
                                    ...state.clients.find(item => item.id === formData.client_id)!.memberships
                                        .find(m => m.id === formData.membership_id)!.classes
                                        .filter(m => m.id !== data.id)
                                ]
                            }
                        ]
                    }
                ]
            });
            setMessage('Clase deshabilitada correctamente.');
            setSeverity(SUCCESS);
        } else {
            setMessage('Hubo un problema al procesar la solicitud.');
            setSeverity(ERROR);
        }
        setOpenMessage(true);
    }

    const addVisit = async (formData: {
        date: Date;
        membership_class_id: number;
        client_id: number;
        membership_id: number;
    }) => {
        const { status, data } = await handleQuery({
            url: VISIT_URL,
            method: 'POST',
            body: JSON.stringify({
                date: formData.date,
                membership_class_id: formData.membership_class_id,
                gym_hash: auth?.me.gym.hash
            })
        });
        if (status === STATUS_CODES.CREATED) {
            dispatch({
                type: SET_CLIENTS,
                payload: [
                    ...state.clients.filter(item => item.id !== formData.client_id),
                    {
                        ...state.clients.find(item => item.id === formData.client_id)!,
                        memberships: [
                            ...state.clients.find(item => item.id === formData.client_id)!.memberships
                                .filter(m => m.id !== formData.membership_id),
                            {
                                ...state.clients.find(item => item.id === formData.client_id)!.memberships
                                    .find(m => m.id === formData.membership_id)!,
                                classes: [
                                    ...state.clients.find(item => item.id === formData.client_id)!.memberships
                                        .find(m => m.id === formData.membership_id)!.classes
                                        .filter(c => c.id !== formData.membership_class_id),
                                    {
                                        ...state.clients.find(item => item.id === formData.client_id)!.memberships
                                            .find(m => m.id === formData.membership_id)!.classes
                                            .find(c => c.id === formData.membership_class_id)!,
                                        visits: [
                                            data,
                                            ...state.clients.find(item => item.id === formData.client_id)!.memberships
                                                .find(m => m.id === formData.membership_id)!.classes
                                                .find(c => c.id === formData.membership_class_id)!.visits
                                                .filter(v => v.id !== data.id)
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
            setMessage('Visita creada correctamente.');
            setSeverity(SUCCESS);
        } else {
            setMessage('Hubo un problema al procesar la solicitud.');
            setSeverity(ERROR);
        }
        setOpenMessage(true);
        return { status, data }
    }

    const removeVisit = async (formData: {
        id: number;
        membership_class_id: number;
        client_id: number;
        membership_id: number;
    }) => {
        const { status, data } = await handleQuery({
            url: `${VISIT_URL}/${auth?.me.gym.hash}/${formData.membership_class_id}/${formData.id}`,
            method: 'DELETE'
        });
        if (status === STATUS_CODES.OK) {
            dispatch({
                type: SET_CLIENTS,
                payload: [
                    ...state.clients.filter(item => item.id !== formData.client_id),
                    {
                        ...state.clients.find(item => item.id === formData.client_id)!,
                        memberships: [
                            ...state.clients.find(item => item.id === formData.client_id)!.memberships
                                .filter(m => m.id !== formData.membership_id),
                            {
                                ...state.clients.find(item => item.id === formData.client_id)!.memberships
                                    .find(m => m.id === formData.membership_id)!,
                                classes: [
                                    ...state.clients.find(item => item.id === formData.client_id)!.memberships
                                        .find(m => m.id === formData.membership_id)!.classes
                                        .filter(c => c.id !== formData.membership_class_id),
                                    {
                                        ...state.clients.find(item => item.id === formData.client_id)!.memberships
                                            .find(m => m.id === formData.membership_id)!.classes
                                            .find(c => c.id === formData.membership_class_id)!,
                                        visits: [
                                            ...state.clients.find(item => item.id === formData.client_id)!.memberships
                                                .find(m => m.id === formData.membership_id)!.classes
                                                .find(c => c.id === formData.membership_class_id)!.visits
                                                .filter(v => v.id !== data.id)
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
            setMessage('Visita eliminada correctamente.');
            setSeverity(SUCCESS);
        } else {
            setMessage('Hubo un problema al procesar la solicitud.');
            setSeverity(ERROR);
        }
        setOpenMessage(true);
    }

    return { handleSubmit, handleDelete, addMembershipClass, removeMembershipClass, addVisit, removeVisit }
}