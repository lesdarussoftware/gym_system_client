/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from "react"

import { AuthContext } from "../providers/AuthProvider";
import { DataContext, PackClass } from "../providers/DataProvider";
import { MessageContext } from "../providers/MessageProvider";
import { useQuery } from "./useQuery";

import { PACK_URL } from "../config/urls";
import { STATUS_CODES } from "../config/statusCodes";
import { SET_PACKS } from "../config/dataReducerActionTypes";
import { ERROR, SUCCESS } from "../config/messageProviderTypes";
import { EDIT, NEW } from "../config/openTypes";

export function usePacks() {

    const { auth } = useContext(AuthContext);
    const { state, dispatch } = useContext(DataContext);
    const { setOpenMessage, setSeverity, setMessage } = useContext(MessageContext);
    const { handleQuery } = useQuery();
    const [open, setOpen] = useState<string | null>(null);
    const [missing, setMissing] = useState<boolean>(true);
    const [idsToDelete, setIdsToDelete] = useState<number[]>([]);
    const [packClasses, setPackClasses] = useState<PackClass[]>([]);

    const getPacks = async (params?: string | undefined) => {
        const { status, data } = await handleQuery({ url: `${PACK_URL}/${auth?.me.gym.hash}${params ? `/${params}` : ''}` })
        if (status === STATUS_CODES.OK) {
            dispatch({ type: SET_PACKS, payload: { rows: data[0], count: data[1] } })
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
        const submitData = {
            ...formData,
            pack_classes: packClasses,
            idsToDelete: idsToDelete.length === 0 ? undefined : idsToDelete
        }
        const spMissing = submitData.pack_classes.length === 0 || submitData.pack_classes.some(pc => !pc.amount || pc.amount <= 0)
        if (validate() && !spMissing) {
            const urls = { [NEW]: PACK_URL, [EDIT]: `${PACK_URL}/${auth?.me.gym.hash}/${formData.id}` };
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
                    type: SET_PACKS,
                    payload: {
                        ...state.packs,
                        rows: [data, ...state.packs.rows],
                        count: state.packs.count + 1
                    }
                });
                setMissing(false);
                setMessage('Pack registrado correctamente.');
            } else if (status === STATUS_CODES.OK) {
                dispatch({
                    type: SET_PACKS,
                    payload: { ...state.packs, rows: [data, ...state.packs.rows.filter(item => item.id !== data.id)] }
                });
                setMessage('Pack editado correctamente.');
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
        } else {
            if (spMissing) {
                setDisabled(false)
                setMissing(true)
            }
        }
    }

    const handleClose = (reset: (() => void) | undefined) => {
        setOpen(null);
        setMissing(false);
        setPackClasses([])
        reset!();
    }

    const handleDelete = async (
        formData: { id: any; },
        reset: () => void,
        setDisabled: (arg0: boolean) => void
    ) => {
        const { status, data } = await handleQuery({
            url: `${PACK_URL}/${auth?.me.gym.hash}/${formData.id}`,
            method: 'DELETE'
        });
        if (status === STATUS_CODES.OK) {
            dispatch({
                type: SET_PACKS,
                payload: {
                    ...state.packs,
                    rows: [...state.packs.rows.filter(item => item.id !== data.id)],
                    count: state.packs.count - 1
                }
            });
            setSeverity(SUCCESS);
            setMessage('Pack eliminado correctamente.');
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
        getPacks,
        missing,
        setMissing,
        idsToDelete,
        setIdsToDelete,
        packClasses,
        setPackClasses
    }
}