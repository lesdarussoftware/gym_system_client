/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from "react"

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useQuery } from "./useQuery";

import { TEACHER_URL } from "../config/urls";
import { STATUS_CODES } from "../config/statusCodes";
import { SET_TEACHERS } from "../config/dataReducerActionTypes";
import { ERROR, SUCCESS } from "../config/messageProviderTypes";
import { EDIT, NEW } from "../config/openTypes";

export function useTeachers() {

    const { auth } = useContext(AuthContext);
    const { state, dispatch } = useContext(DataContext);
    const { setOpenMessage, setSeverity, setMessage } = useContext(MessageContext);
    const { handleQuery } = useQuery();
    const [open, setOpen] = useState<string | null>(null);
    const [filter, setFilter] = useState({
        page: 0,
        offset: 25
    });

    const getTeachers = async (params?: string | undefined) => {
        const { status, data } = await handleQuery({ url: `${TEACHER_URL}/${auth?.me.gym.hash}${params ? `/${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            dispatch({ type: SET_TEACHERS, payload: { rows: data[0], count: data[1] } })
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
            const methods = { [NEW]: 'POST', [EDIT]: 'PUT' };
            const urls = { [NEW]: TEACHER_URL, [EDIT]: `${TEACHER_URL}/${auth?.me.gym.hash}/${formData.id}` };
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
                    type: SET_TEACHERS,
                    payload: {
                        ...state.teachers,
                        rows: [data, ...state.teachers.rows],
                        count: state.teachers.count + 1
                    }
                });
                setMessage('Profesor registrado correctamente.');
            } else if (status === STATUS_CODES.OK) {
                dispatch({
                    type: SET_TEACHERS,
                    payload: { ...state.teachers, rows: [data, ...state.teachers.rows.filter(item => item.id !== data.id)] }
                });
                setMessage('Profesor editado correctamente.');
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
            url: `${TEACHER_URL}/${auth?.me.gym.hash}/${formData.id}`,
            method: 'DELETE'
        });
        if (status === STATUS_CODES.OK) {
            dispatch({
                type: SET_TEACHERS,
                payload: {
                    ...state.teachers,
                    rows: [...state.teachers.rows.filter(item => item.id !== data.id)],
                    count: state.teachers.count - 1
                }
            });
            setSeverity(SUCCESS);
            setMessage('Profesor eliminado correctamente.');
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
        handleSubmit,
        handleClose,
        handleDelete,
        open,
        setOpen,
        getTeachers,
        filter,
        setFilter
    }
}