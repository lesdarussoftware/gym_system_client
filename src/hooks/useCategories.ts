/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from "react"

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useQuery } from "./useQuery";

import { CATEGORY_URL } from "../config/urls";
import { STATUS_CODES } from "../config/statusCodes";
import { SET_CATEGORIES } from "../config/dataReducerActionTypes";
import { ERROR, SUCCESS } from "../config/messageProviderTypes";
import { EDIT, NEW } from "../config/openTypes";

export function useCategories() {

    const { auth } = useContext(AuthContext);
    const { state, dispatch } = useContext(DataContext);
    const { setOpenMessage, setSeverity, setMessage } = useContext(MessageContext);

    const { handleQuery } = useQuery();

    const [open, setOpen] = useState<string | null>(null);
    const [filter, setFilter] = useState({ page: 0, offset: 25 });

    const getCategories = async (params?: string | undefined) => {
        const { status, data } = await handleQuery({ url: `${CATEGORY_URL}/${auth?.me.gym.hash}${params ? `/${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            dispatch({ type: SET_CATEGORIES, payload: { rows: data[0], count: data[1] } })
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
            const urls = { [NEW]: CATEGORY_URL, [EDIT]: `${CATEGORY_URL}/${auth?.me.gym.hash}/${formData.id}` };
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
                    type: SET_CATEGORIES,
                    payload: {
                        ...state.categories,
                        rows: [data, ...state.categories.rows],
                        count: state.categories.count + 1
                    }
                });
                setMessage('Categoría registrada correctamente.');
            } else if (status === STATUS_CODES.OK) {
                dispatch({
                    type: SET_CATEGORIES,
                    payload: { ...state.categories, rows: [data, ...state.categories.rows.filter(item => item.id !== data.id)] }
                });
                setMessage('Categoría editada correctamente.');
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
            url: `${CATEGORY_URL}/${auth?.me.gym.hash}/${formData.id}`,
            method: 'DELETE'
        });
        if (status === STATUS_CODES.OK) {
            dispatch({
                type: SET_CATEGORIES,
                payload: {
                    ...state.categories,
                    rows: [...state.categories.rows.filter(item => item.id !== data.id)],
                    count: state.categories.count - 1
                }
            });
            setSeverity(SUCCESS);
            setMessage('Categoría eliminada correctamente.');
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
        getCategories,
        filter,
        setFilter
    }
}