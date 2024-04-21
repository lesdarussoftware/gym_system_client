import { useContext, useEffect } from "react";
import { Box } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useQuery } from "../hooks/useQuery";

import { Header } from "../components/Header";

import { TEACHER_URL } from "../config/urls";
import { STATUS_CODES } from "../config/statusCodes";
import { SET_TEACHERS } from "../config/dataReducerActionTypes";

export function TeachersPage() {

    const { auth } = useContext(AuthContext);
    const { state, dispatch } = useContext(DataContext);
    const { handleQuery } = useQuery();

    useEffect(() => {
        (async () => {
            if (state.teachers.length === 0) {
                const { status, data } = await handleQuery({ url: `${TEACHER_URL}/${auth?.me.gym.hash}` })
                if (status === STATUS_CODES.OK) {
                    dispatch({ type: SET_TEACHERS, payload: data })
                }
            }
        })()
    }, [])

    return (
        <>
            <Header showOptions />
            <Box>
                profesores
            </Box>
        </>
    );
}