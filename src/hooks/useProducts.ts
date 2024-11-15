/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from "react"

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useQuery } from "./useQuery";

import { EXPENSE_URL, INCOME_URL, PRODUCT_URL } from "../config/urls";
import { STATUS_CODES } from "../config/statusCodes";
import { SET_PRODUCTS } from "../config/dataReducerActionTypes";
import { ERROR, SUCCESS } from "../config/messageProviderTypes";
import { EDIT, NEW } from "../config/openTypes";

export function useProducts() {

    const { auth } = useContext(AuthContext);
    const { state, dispatch } = useContext(DataContext);
    const { setOpenMessage, setSeverity, setMessage } = useContext(MessageContext);

    const { handleQuery } = useQuery();

    const [open, setOpen] = useState<string | null>(null);
    const [filter, setFilter] = useState({ page: 0, offset: 25 });

    const getProducts = async (params?: string | undefined) => {
        const { status, data } = await handleQuery({ url: `${PRODUCT_URL}/${auth?.me.gym.hash}${params ? `/${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            dispatch({ type: SET_PRODUCTS, payload: { rows: data[0], count: data[1] } })
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
            const urls = { [NEW]: PRODUCT_URL, [EDIT]: `${PRODUCT_URL}/${auth?.me.gym.hash}/${formData.id}` };
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
                    type: SET_PRODUCTS,
                    payload: {
                        ...state.products,
                        rows: [data, ...state.products.rows],
                        count: state.products.count + 1
                    }
                });
                setMessage('Producto registrado correctamente.');
            } else if (status === STATUS_CODES.OK) {
                dispatch({
                    type: SET_PRODUCTS,
                    payload: { ...state.products, rows: [data, ...state.products.rows.filter(item => item.id !== data.id)] }
                });
                setMessage('Producto editado correctamente.');
            } else {
                setMessage(data.message);
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
            url: `${PRODUCT_URL}/${auth?.me.gym.hash}/${formData.id}`,
            method: 'DELETE'
        });
        if (status === STATUS_CODES.OK) {
            dispatch({
                type: SET_PRODUCTS,
                payload: {
                    ...state.products,
                    rows: [...state.products.rows.filter(item => item.id !== data.id)],
                    count: state.products.count - 1
                }
            });
            setSeverity(SUCCESS);
            setMessage('Producto eliminado correctamente.');
            handleClose(reset);
        }
        if (status === STATUS_CODES.SERVER_ERROR) {
            setMessage(data.message);
            setSeverity(ERROR);
            setDisabled(false);
        }
        setOpenMessage(true);
    }

    const handleSubmitMovement = async (
        e: { preventDefault: () => void; },
        validate: () => any,
        formData: { id: any; },
        setDisabled: (arg0: boolean) => void,
        reset: (() => void) | undefined
    ) => {
        e.preventDefault();
        if (validate()) {
            const urls = {
                'NEW_INCOME': `${INCOME_URL}/${auth?.me.gym.hash}`,
                'NEW_EXPENSE': `${EXPENSE_URL}/${auth?.me.gym.hash}`
            };
            const { status, data } = await handleQuery({
                url: open === 'NEW_INCOME' || open === 'NEW_EXPENSE' ? urls[open] : '',
                method: 'POST',
                body: JSON.stringify({ ...formData, gym_hash: auth?.me.gym.hash })
            });
            if (status === STATUS_CODES.CREATED) {
                dispatch({
                    type: SET_PRODUCTS,
                    payload: {
                        ...state.products,
                        rows: [data, ...state.products.rows],
                        count: state.products.count + 1
                    }
                });
                setMessage(`${open === 'NEW_INCOME' ? 'Ingreso' : 'Egreso'} registrado correctamente.`);
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

    return {
        handleSubmit,
        handleClose,
        handleDelete,
        open,
        setOpen,
        getProducts,
        filter,
        setFilter,
        handleSubmitMovement
    }
}