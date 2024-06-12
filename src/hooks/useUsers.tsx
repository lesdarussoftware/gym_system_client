/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from "react"

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useQuery } from "./useQuery";
import { useAuth } from "./useAuth";

import { USER_URL } from "../config/urls";
import { STATUS_CODES } from "../config/statusCodes";
import { SET_USERS } from "../config/dataReducerActionTypes";
import { ERROR, SUCCESS } from "../config/messageProviderTypes";
import { EDIT, NEW } from "../config/openTypes";

export function useUsers() {

    const { auth } = useContext(AuthContext);
    const { state, dispatch } = useContext(DataContext);
    const { setOpenMessage, setSeverity, setMessage } = useContext(MessageContext);
    const { handleQuery } = useQuery();
    const { handleLogout } = useAuth();
    const [open, setOpen] = useState<string | null>(null);

    const getUsers = async () => {
        if (state.users.rows.length === 0) {
            const { status, data } = await handleQuery({ url: `${USER_URL}/${auth?.me.gym.hash}` })
            if (status === STATUS_CODES.OK) {
                dispatch({ type: SET_USERS, payload: { rows: data[0], count: data[1] } })
            }
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
            const urls = { [NEW]: USER_URL, [EDIT]: `${USER_URL}/${auth?.me.gym.hash}/${formData.id}` };
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
                    type: SET_USERS,
                    payload: { ...state.users, rows: [data, ...state.users.rows] }
                });
                setMessage('Usuario registrado correctamente.');
            } else if (status === STATUS_CODES.OK) {
                dispatch({
                    type: SET_USERS,
                    payload: { ...state.users, rows: [data, ...state.users.rows.filter(item => item.id !== data.id)] }
                });
                setMessage('Usuario editado correctamente.');
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
            url: `${USER_URL}/${auth?.me.gym.hash}/${formData.id}`,
            method: 'DELETE'
        });
        if (status === STATUS_CODES.OK) {
            dispatch({
                type: SET_USERS,
                payload: { ...state.users, rows: [...state.users.rows.filter(item => item.id !== data.id)] }
            });
            setSeverity(SUCCESS);
            setMessage('Usuario eliminado correctamente.');
            handleClose(reset);
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setMessage(data.message);
            setSeverity(ERROR);
            setDisabled(false);
        }
        setOpenMessage(true);
    }

    const handleChangePwd = async (
        e: { preventDefault: () => void; },
        validate: () => any,
        formData: { new_password: string; },
        setDisabled: (arg0: boolean) => void,
        reset: (() => void) | undefined
    ) => {
        e.preventDefault();
        if (validate()) {
            const { status, data } = await handleQuery({
                url: `${USER_URL}/change-password/${auth?.me.id}`,
                method: 'PUT',
                body: JSON.stringify({ password: formData.new_password })
            });
            if (status === STATUS_CODES.OK) {
                setMessage('Contraseña cambiada correctamente.');
                setSeverity(SUCCESS);
                handleClose(reset);
                handleLogout();
            } else {
                setMessage(data.message);
                setDisabled(false);
                setSeverity(ERROR);
            }
            setOpenMessage(true);
        }
    }

    return { handleSubmit, handleClose, handleDelete, open, setOpen, handleChangePwd, getUsers }
}