/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react"

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useQuery } from "./useQuery";

import { CLASS_URL, SCHEDULE_URL, TEACHER_CLASS_URL } from "../config/urls";
import { STATUS_CODES } from "../config/statusCodes";
import { SET_CLASSES } from "../config/dataReducerActionTypes";
import { ERROR, SUCCESS } from "../config/messageProviderTypes";
import { NEW, EDIT } from '../config/openTypes';

export function useClasses() {

    const { auth } = useContext(AuthContext);
    const { state, dispatch } = useContext(DataContext);
    const { setOpenMessage, setSeverity, setMessage } = useContext(MessageContext);
    const { handleQuery } = useQuery();
    const [open, setOpen] = useState(null);

    useEffect(() => {
        (async () => {
            if (state.classes.length === 0) {
                const { status, data } = await handleQuery({ url: `${CLASS_URL}/${auth?.me.gym.hash}` })
                if (status === STATUS_CODES.OK) {
                    dispatch({ type: SET_CLASSES, payload: data })
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
            const methods = { [NEW]: 'POST', [EDIT]: 'PUT' };
            const urls = { [NEW]: CLASS_URL, [EDIT]: `${CLASS_URL}/${auth?.me.gym.hash}/${formData.id}` };
            const { status, data } = await handleQuery({
                url: urls[open!],
                method: methods[open!],
                body: JSON.stringify({
                    ...formData,
                    gym_hash: auth?.me.gym.hash
                })
            });
            if (status === STATUS_CODES.CREATED) {
                dispatch({
                    type: SET_CLASSES,
                    payload: [data, ...state.classes]
                });
                setMessage('Clase registrada correctamente.');
            } else if (status === STATUS_CODES.OK) {
                dispatch({
                    type: SET_CLASSES,
                    payload: [data, ...state.classes.filter(item => item.id !== data.id)]
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
            const { status, data } = await handleQuery({
                url: SCHEDULE_URL,
                method: 'POST',
                body: JSON.stringify({
                    ...formData,
                    gym_hash: auth?.me.gym.hash
                })
            });
            if (status === STATUS_CODES.CREATED) {
                dispatch({
                    type: SET_CLASSES,
                    payload: [
                        ...state.classes.filter(item => item.id !== data.class_id),
                        {
                            ...state.classes.find(item => item.id === data.class_id)!,
                            schedules: [
                                data,
                                ...state.classes.find(item => item.id === data.class_id)!.schedules
                            ]
                        }
                    ]
                });
                setMessage('Horario registrado correctamente.');
                setSeverity(SUCCESS);
                handleClose(reset);
            } else {
                setMessage(data.message);
                setSeverity(ERROR);
                setDisabled(false);
            }
            setOpenMessage(true);
        }
    }

    const handleSubmitTeacherClass = async (
        e: { preventDefault: () => void; },
        validate: () => any,
        formData: { id: any; },
        setDisabled: (arg0: boolean) => void,
        reset: (() => void) | undefined
    ) => {
        e.preventDefault();
        if (validate()) {
            const { status, data } = await handleQuery({
                url: TEACHER_CLASS_URL,
                method: 'POST',
                body: JSON.stringify({
                    ...formData,
                    gym_hash: auth?.me.gym.hash
                })
            });
            if (status === STATUS_CODES.CREATED) {
                dispatch({
                    type: SET_CLASSES,
                    payload: [
                        ...state.classes.filter(item => item.id !== data.class_id),
                        {
                            ...state.classes.find(item => item.id === data.class_id)!,
                            teachers: [
                                data,
                                ...state.classes.find(item => item.id === data.class_id)!.teachers
                            ]
                        }
                    ]
                });
                setMessage('Profesor registrado correctamente.');
                setSeverity(SUCCESS);
                handleClose(reset);
            } else {
                setMessage(data.message);
                setSeverity(ERROR);
                setDisabled(false);
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
                payload: [...state.classes.filter(item => item.id !== data.id)]
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
                payload: [
                    ...state.classes.filter(item => item.id !== data.class_id),
                    {
                        ...state.classes.find(item => item.id === data.class_id)!,
                        schedules: [
                            ...state.classes.find(item => item.id === data.class_id)!.schedules
                                .filter(item => item.id !== data.id)
                        ]
                    }
                ]
            });
            setSeverity(SUCCESS);
            setMessage('Horario eliminado correctamente.');
            handleClose(reset);
        }
        setOpenMessage(true);
    }

    const handleDeleteTeacherClass = async (teacher_id: number, class_id: number, reset: () => void) => {
        const { status, data } = await handleQuery({
            url: `${TEACHER_CLASS_URL}/${auth?.me.gym.hash}/${teacher_id}/${class_id}`,
            method: 'DELETE'
        });
        if (status === STATUS_CODES.OK) {
            dispatch({
                type: SET_CLASSES,
                payload: [
                    ...state.classes.filter(item => item.id !== data.class_id),
                    {
                        ...state.classes.find(item => item.id === data.class_id)!,
                        teachers: [
                            ...state.classes.find(item => item.id === data.class_id)!.teachers
                                .filter(item => item.teacher_id !== data.teacher_id)
                        ]
                    }
                ]
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
        handleDeleteTeacherClass,
        handleSubmitTeacherClass
    }
}