import { useContext, useEffect } from "react";
import { Box } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useQuery } from "../hooks/useQuery";

import { Header } from "../components/Header";

import { USER_URL } from "../config/urls";
import { STATUS_CODES } from "../config/statusCodes";
import { SET_USERS } from "../config/dataReducerActionTypes";

export function UsersPage() {

    const { auth } = useContext(AuthContext);
    const { state, dispatch } = useContext(DataContext);
    const { handleQuery } = useQuery();

    useEffect(() => {
        (async () => {
            if (state.users.length === 0) {
                const { status, data } = await handleQuery({ url: `${USER_URL}/${auth?.me.gym.hash}` })
                if (status === STATUS_CODES.OK) {
                    dispatch({ type: SET_USERS, payload: data })
                }
            }
        })()
    }, [])

    return (
        <>
            <Header showOptions />
            <Box>
                usuarios
            </Box>
        </>
    );
}