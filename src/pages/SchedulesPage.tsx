import { useContext } from "react";
import { Box } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useClasses } from "../hooks/useClasses";

import { Header } from "../components/common/Header";
import { LoginForm } from "../components/common/LoginForm";
import { DAYS } from "../config/schedules";

export function SchedulesPage() {

    const { auth } = useContext(AuthContext);
    const { state } = useContext(DataContext);
    useClasses();
    console.log(state.classes)

    const headers = [
        DAYS.MONDAY,
        DAYS.TUESDAY,
        DAYS.WEDNESDAY,
        DAYS.THURSDAY,
        DAYS.FRIDAY,
        DAYS.SATURDAY,
        DAYS.SUNDAY
    ];

    return (
        <>
            {auth ?
                <>
                    <Header />
                    <Box sx={{ padding: 2 }}>
                        <table border={1}>
                            <thead>
                                <tr>
                                    <th></th>
                                    {headers.map(h => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {state.classes.sort((a, b) => {
                                    if (a.name > b.name) return 1;
                                    if (a.name < b.name) return -1;
                                    return 0;
                                }).map(c => {
                                    return (
                                        <tr key={c.id}>
                                            <td>
                                                {c.name}
                                            </td>
                                            {headers.map(h => {
                                                if (c.schedules.some(s => s.day === h)) {
                                                    return (
                                                        <td key={h}>
                                                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                                                {c.schedules.filter(s => s.day === h).map(s => {
                                                                    return (
                                                                        <li key={s.id}>{`${s.hour} hs`}</li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        </td>
                                                    );
                                                } else {
                                                    return <td key={h}></td>
                                                }
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </Box>
                </> :
                <LoginForm />
            }
        </>
    );
}