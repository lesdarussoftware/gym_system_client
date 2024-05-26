import { useContext } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, tooltipClasses, TooltipProps, Tooltip, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';

import { AuthContext } from "../providers/AuthProvider";
import { DataContext } from "../providers/DataProvider";
import { useClasses } from "../hooks/useClasses";

import { Header } from "../components/common/Header";
import { LoginForm } from "../components/common/LoginForm";

import { DAYS } from "../config/schedules";
import { MAIN_COLOR } from "../config/colors";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        backgroundColor: 'transparent'
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
                        <TableContainer component={Paper} sx={{ width: '100%' }}>
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
                                                    <TableCell align="center">
                                                        {c.name}
                                                    </TableCell>
                                                    {headers.map(h => {
                                                        if (c.schedules.some(s => s.day === h)) {
                                                            return (
                                                                <TableCell align="center" key={h} sx={{ padding: 0 }}>
                                                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                                                        {c.schedules.filter(s => s.day === h).map(s => {
                                                                            return (
                                                                                <HtmlTooltip
                                                                                    title={
                                                                                        <TableContainer component={Paper}>
                                                                                            <Table>
                                                                                                <TableBody>
                                                                                                    <TableRow>
                                                                                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                                                                                            Profesor
                                                                                                        </TableCell>
                                                                                                        <TableCell align="center">
                                                                                                            {`${s.teacher.first_name} ${s.teacher.last_name}`}
                                                                                                        </TableCell>
                                                                                                    </TableRow>
                                                                                                    <TableRow>
                                                                                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                                                                                            Detalles
                                                                                                        </TableCell>
                                                                                                        <TableCell align="center">
                                                                                                            {s.observations}
                                                                                                        </TableCell>
                                                                                                    </TableRow>
                                                                                                </TableBody>
                                                                                            </Table>
                                                                                        </TableContainer>
                                                                                    }
                                                                                >
                                                                                    <Typography variant="body1" sx={{
                                                                                        transition: '100ms all',
                                                                                        borderRadius: 1,
                                                                                        ':hover': {
                                                                                            backgroundColor: MAIN_COLOR,
                                                                                            color: '#fff'
                                                                                        }
                                                                                    }}>
                                                                                        {`${s.hour} hs`}
                                                                                    </Typography>
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
                <Box sx={{ padding: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '90vh',
                        flexDirection: 'column',
                        gap: 3
                    }}>
                        <Typography variant="h2" sx={{ color: '#000' }}>
                            Iniciar sesión
                        </Typography>
                        <LoginForm />
                    </Box>
                </Box>
            }
        </>
    );
}