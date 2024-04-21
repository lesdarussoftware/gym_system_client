import { useContext, useEffect } from "react";
import { Box } from "@mui/material";

import { DataContext } from "../providers/DataProvider";
import { useQuery } from "../hooks/useQuery";

import { Header } from "../components/Header";

import { CLIENT_URL } from "../config/urls";
import { STATUS_CODES } from "../config/statusCodes";
import { SET_CLIENTS } from "../config/dataReducerActionTypes";
import { AuthContext } from "../providers/AuthProvider";

export function ClientsPage() {

    const { auth } = useContext(AuthContext);
    const { state, dispatch } = useContext(DataContext);
    const { handleQuery } = useQuery();

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

    return (
        <>
            <Header showOptions />
            <Box>
                clientes
            </Box>
        </>
    );
}