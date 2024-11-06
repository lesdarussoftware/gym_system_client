/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from "react"

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useQuery } from "./useQuery";

import { CLASS_URL, SCHEDULE_URL } from "../config/urls";
import { STATUS_CODES } from "../config/statusCodes";
import { SET_CLASSES } from "../config/dataReducerActionTypes";
import { ERROR, SUCCESS } from "../config/messageProviderTypes";
import { NEW, EDIT } from '../config/openTypes';

export function useClasses() {

    const { auth } = useContext(AuthContext);
    const { state, dispatch } = useContext(DataContext);
    const { setOpenMessage, setSeverity, setMessage } = useContext(MessageContext);
    const { handleQuery } = useQuery();
    const [open, setOpen] = useState<string | null>(null);
    const [filter, setFilter] = useState({
        page: 0,
        offset: 25
    });

    const getClasses = async (params?: string | undefined) => {
        const { status, data } = await handleQuery({ url: `${CLASS_URL}/${auth?.me.gym.hash}${params ? `/${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            dispatch({ type: SET_CLASSES, payload: { rows: data[0], count: data[1] } })
        }
    }

    const handleSubmit = async (
        e: { preventDefault: () => void; },
        validate: () => any,
        formData: { id: any; },
        setDisabled: (arg0: boolean) => void,
        reset: (() => void) | undefined
    ) => {
        e.preventDefault();
        if (validate()) {
            const urls = { [NEW]: CLASS_URL, [EDIT]: `${CLASS_URL}/${auth?.me.gym.hash}/${formData.id}` };
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
                    type: SET_CLASSES,
                    payload: {
                        ...state.classes,
                        rows: [data, ...state.classes.rows],
                        count: state.classes.count + 1
                    }
                });
                setMessage('Clase registrada correctamente.');
            } else if (status === STATUS_CODES.OK) {
                dispatch({
                    type: SET_CLASSES,
                    payload: { ...state.classes, rows: [data, ...state.classes.rows.filter(item => item.id !== data.id)] }
                });
                setMessage('Clase editada correctamente.');
            } else if (status === STATUS_CODES.SERVER_ERROR) {
                setMessage(data.message);
                setSeverity(ERROR);
                setDisabled(false);
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

    const handleSubmitSchedule = async (
        e: { preventDefault: () => void; },
        validate: () => any,
        formData: { id: any; },
        setDisabled: (arg0: boolean) => void,
        reset: (() => void) | undefined
    ) => {
        e.preventDefault();
        if (validate()) {
            const urls = { [NEW]: SCHEDULE_URL, [EDIT]: `${SCHEDULE_URL}/${auth?.me.gym.hash}/${formData.id}` };
            const { status, data } = await handleQuery({
                url: open === NEW || open === EDIT ? urls[open] : '',
                method: open === NEW ? 'POST' : open === EDIT ? 'PUT' : 'GET',
                body: JSON.stringify({
                    ...formData,
                    gym_hash: auth?.me.gym.hash
                })
            });
            setDisabled(false);
            if (status === STATUS_CODES.CREATED) {
                dispatch({
                    type: SET_CLASSES,
                    payload: {
                        ...state.classes,
                        rows: [
                            ...state.classes.rows.filter(item => item.id !== data.class_id),
                            {
                                ...state.classes.rows.find(item => item.id === data.class_id)!,
                                schedules: [
                                    data,
                                    ...state.classes.rows.find(item => item.id === data.class_id)!.schedules
                                ]
                            }
                        ]
                    }
                });
                setMessage('Horario registrado correctamente.');
            } else if (status === STATUS_CODES.OK) {
                dispatch({
                    type: SET_CLASSES,
                    payload: {
                        ...state.classes,
                        rows: [
                            ...state.classes.rows.filter(item => item.id !== data.class_id),
                            {
                                ...state.classes.rows.find(item => item.id === data.class_id)!,
                                schedules: [
                                    data,
                                    ...state.classes.rows.find(item => item.id === data.class_id)!.schedules
                                        .filter(s => s.id !== data.id)
                                ]
                            }
                        ]
                    }
                });
                setMessage('Horario editado correctamente.');
            } else if (status === STATUS_CODES.SERVER_ERROR) {
                setMessage(data.message);
                setSeverity(ERROR);
            } else {
                setMessage('Hubo un problema al procesar la solicitud.');
                setSeverity(ERROR);
            }
            if (status === STATUS_CODES.CREATED || status === STATUS_CODES.OK) {
                setSeverity(SUCCESS);
                setOpen(null);
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
            url: `${CLASS_URL}/${auth?.me.gym.hash}/${formData.id}`,
            method: 'DELETE'
        });
        if (status === STATUS_CODES.OK) {
            dispatch({
                type: SET_CLASSES,
                payload: {
                    ...state.classes,
                    rows: [...state.classes.rows.filter(item => item.id !== data.id)],
                    count: state.classes.count - 1
                }
            });
            setSeverity(SUCCESS);
            setMessage('Clase eliminada correctamente.');
            handleClose(reset);
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setMessage(data.message);
            setSeverity(ERROR);
            setDisabled(false);
        }
        setOpenMessage(true);
    }

    const handleDeleteSchedule = async (id: number, reset: () => void) => {
        const { status, data } = await handleQuery({
            url: `${SCHEDULE_URL}/${auth?.me.gym.hash}/${id}`,
            method: 'DELETE'
        });
        if (status === STATUS_CODES.OK) {
            dispatch({
                type: SET_CLASSES,
                payload: {
                    ...state.classes,
                    rows: [
                        ...state.classes.rows.filter(item => item.id !== data.class_id),
                        {
                            ...state.classes.rows.find(item => item.id === data.class_id)!,
                            schedules: [
                                ...state.classes.rows.find(item => item.id === data.class_id)!.schedules
                                    .filter(item => item.id !== data.id)
                            ]
                        }
                    ]
                }
            });
            setSeverity(SUCCESS);
            setMessage('Horario eliminado correctamente.');
            handleClose(reset);
        }
        setOpenMessage(true);
    }

    return {
        handleSubmit,
        handleClose,
        handleDelete,
        open,
        setOpen,
        handleSubmitSchedule,
        handleDeleteSchedule,
        getClasses,
        filter,
        setFilter
    }
}