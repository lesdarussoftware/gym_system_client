import { useContext } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";

import { AuthContext } from "../providers/AuthProvider";
import { useLicense } from "../hooks/useLicense";

import { Header } from "../components/common/Header";
import { LoginForm } from "../components/common/LoginForm";

export function LicensePage() {

    const { auth } = useContext(AuthContext);
    const { license } = useLicense();

    return (
        <>
            {auth ?
                <>
                    <Header />
                    <Box sx={{ padding: 2 }}>
                        <Typography variant="h4" marginBottom={1}>
                            Licencia
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                            Nombre
                                        </TableCell>
                                        <TableCell align="center">
                                            {license.name}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                            Hash
                                        </TableCell>
                                        <TableCell align="center">
                                            {license.hash}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                            Vencimiento
                                        </TableCell>
                                        <TableCell align="center">
                                            {license.next_deadline === null ? 'No válido' : license.next_deadline.split('T')[0].split('-').reverse().join('/')}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                            Dirección
                                        </TableCell>
                                        <TableCell align="center">
                                            {license.address}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                            Ciudad
                                        </TableCell>
                                        <TableCell align="center">
                                            {license.city}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                            País
                                        </TableCell>
                                        <TableCell align="center">
                                            {license.country}
                                        </TableCell>
                                    </TableRow>
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