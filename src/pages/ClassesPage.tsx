import { useContext, useEffect } from "react";
import { Box } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useQuery } from "../hooks/useQuery";

import { Header } from "../components/Header";

import { CLASS_URL } from "../config/urls";
import { STATUS_CODES } from "../config/statusCodes";
import { SET_CLASSES } from "../config/dataReducerActionTypes";

export function ClassesPage() {

    const { auth } = useContext(AuthContext);
    const { state, dispatch } = useContext(DataContext);
    const { handleQuery } = useQuery();

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

    return (
        <>
            <Header showOptions />
            <Box>
                clases
            </Box>
        </>
    );
}