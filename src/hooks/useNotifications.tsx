/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState } from "react"

import { AuthContext } from "../providers/AuthProvider";
import { MessageContext } from "../providers/MessageProvider";
import { Client } from "../providers/DataProvider";
import { useQuery } from "./useQuery";

import { NOTIFICATION_URL } from "../config/urls";
import { STATUS_CODES } from "../config/statusCodes";
import { ERROR, SUCCESS } from "../config/messageProviderTypes";

export type Notification = {
    id: number;
    is_read: boolean;
    created_at: string | Date;
}

export function useNotifications() {

    const { auth } = useContext(AuthContext);
    const { setOpenMessage, setSeverity, setMessage } = useContext(MessageContext);

    const { handleQuery } = useQuery();

    const [open, setOpen] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [count, setCount] = useState(0);
    const [filter, setFilter] = useState({ page: 0, offset: 25 });
    const [newMsg, setNewMsg] = useState<Client[]>([]);

    const getNotifications = async (clientId: number, params?: string | undefined) => {
        const { status, data } = await handleQuery({ url: `${NOTIFICATION_URL}/${auth?.me.gym.hash}/${clientId}${params ? params : ''}` })
        if (status === STATUS_CODES.OK) {
            setNotifications(data[0]);
            setCount(data[1]);
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
            const { status, data } = await handleQuery({
                url: NOTIFICATION_URL,
                method: 'POST',
                body: JSON.stringify({
                    ...formData,
                    clients: newMsg.map(i => i.id),
                    gym_hash: auth?.me.gym.hash,
                    client_id: undefined
                })
            });
            if (status === STATUS_CODES.CREATED) {
                setSeverity(SUCCESS);
                setMessage('Aviso registrado correctamente.');
                handleClose(reset);
            } else if (status === STATUS_CODES.SERVER_ERROR) {
                setMessage(data.message);
                setSeverity(ERROR);
                setDisabled(false);
            } else {
                setMessage('Hubo un problema al procesar la solicitud.');
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

    const handleDelete = async (formData: { id: any; }, reset: () => void, setDisabled: (arg0: boolean) => void) => {
        const { status, data } = await handleQuery({
            url: `${NOTIFICATION_URL}/${auth?.me.gym.hash}/${formData.id}`,
            method: 'DELETE'
        });
        if (status === STATUS_CODES.OK) {
            setNotifications([...notifications.filter(n => n.id !== data.id)]);
            setCount(count - 1);
            setSeverity(SUCCESS);
            setMessage('Aviso eliminado correctamente.');
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
        filter,
        setFilter,
        getNotifications,
        count,
        notifications,
        newMsg,
        setNewMsg
    }
}