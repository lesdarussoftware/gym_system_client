import { useContext } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, tooltipClasses, TooltipProps, Tooltip } from "@mui/material";
import { styled } from '@mui/material/styles';

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useClasses } from "../hooks/useClasses";

import { Header } from "../components/common/Header";
import { LoginForm } from "../components/common/LoginForm";

import { DAYS } from "../config/schedules";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));

export function SchedulesPage() {

    const { auth } = useContext(AuthContext);
    const { state } = useContext(DataContext);
    useClasses();

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
                        <TableContainer
                            component={Paper}
                            sx={{
                                width: '100%',
                                backgroundColor: '#f5f5f5'
                            }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        {headers.map(h => (
                                            <TableCell
                                                align="center"
                                                sx={{ color: '#011627' }}
                                                key={h}
                                            >
                                                {h}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {state.classes.length === 0 ?
                                        <TableRow>
                                            <TableCell colSpan={headers.length + 1} align="center">
                                                No hay registros para mostrar.
                                            </TableCell>
                                        </TableRow> :
                                        state.classes.sort((a, b) => {
                                            if (a.name > b.name) return 1;
                                            if (a.name < b.name) return -1;
                                            return 0;
                                        }).map(c => {
                                            return (
                                                <TableRow key={c.id}>
                                                    <TableCell
                                                        align="center"
                                                        sx={{ color: '#011627' }}
                                                    >
                                                        {c.name}
                                                    </TableCell>
                                                    {headers.map(h => {
                                                        if (c.schedules.some(s => s.day === h)) {
                                                            return (
                                                                <TableCell align="center" key={h}
                                                                    sx={{
                                                                        color: '#011627',
                                                                        transition: '300ms all',
                                                                        ':hover': {
                                                                            backgroundColor: '#BDBDBD'
                                                                        }
                                                                    }}>
                                                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                                                        {c.schedules.filter(s => s.day === h).map(s => {
                                                                            return (
                                                                                <HtmlTooltip
                                                                                    title={
                                                                                        <>
                                                                                            <Typography
                                                                                                color="body1"
                                                                                                sx={{
                                                                                                    fontWeight: 'bold',
                                                                                                    textAlign: 'center',
                                                                                                    marginBottom: 1
                                                                                                }}
                                                                                            >
                                                                                                Observaciones
                                                                                            </Typography>
                                                                                            <Typography color="inherit">
                                                                                                {s.observations}
                                                                                            </Typography>
                                                                                        </>
                                                                                    }
                                                                                >
                                                                                    <p>
                                                                                        {`${s.hour} hs`}
                                                                                    </p>
                                                                                </HtmlTooltip>
                                                                            );
                                                                        })}
                                                                    </ul>
                                                                </TableCell>
                                                            );
                                                        } else {
                                                            return (
                                                                <TableCell align="center" key={h}></TableCell>
                                                            );
                                                        }
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </> :
                <LoginForm />
            }
        </>
    );
}