/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';

import { DataContext } from '../../providers/DataProvider';

import { EnhancedTableHeadBackend, HeadCell } from './EnhancedTableHeadBackend';
import { EnhancedTableToolbar } from './EnhancedTableToolbar';

interface DataGridProps {
    children?: React.ReactNode;
    headCells: HeadCell[];
    entityKey: 'clients' | 'users' | 'teachers' | 'classes' | 'packs';
    getter: (params?: string | undefined) => void;
    setOpen?: any;
    setFormData?: any;
    defaultOrder?: 'asc' | 'desc';
    defaultOrderBy?: string;
    stopPointerEvents?: boolean;
    showClassesDetails?: boolean;
    showMembershipDetails?: boolean;
    hideAddMembership?: boolean;
    hideEditAction?: boolean;
}

export function DataGridBackend({
    children,
    headCells,
    setOpen,
    setFormData,
    entityKey,
    getter,
    defaultOrder = 'desc',
    defaultOrderBy = 'id',
    stopPointerEvents,
    showClassesDetails,
    showMembershipDetails,
    hideAddMembership,
    hideEditAction = false
}: DataGridProps) {

    const { state } = useContext(DataContext);

    const [order, setOrder] = useState<'asc' | 'desc'>(defaultOrder);
    const [orderBy, setOrderBy] = useState<string>(defaultOrderBy);
    const [selected, setSelected] = useState<any[]>([]);
    const [page, setPage] = useState<number>(0);
    const [offset, setOffset] = useState<number>(5);

    const handleRequestSort = (_event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = state[entityKey].rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (_event: React.MouseEvent<unknown>, id: any) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: any[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOffset(+event.target.value);
    };

    const isSelected = (id: any) => selected.indexOf(id) !== -1;

    useEffect(() => {
        getter(`?sortOrder=${order}&orderBy=${orderBy}&page=${page}&offset=${offset}`);
    }, [order, orderBy, page, offset])

    return (
        <Box sx={{ width: '100%', backgroundColor: '#fff' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                {setOpen && setFormData &&
                    <EnhancedTableToolbar
                        numSelected={selected.length}
                        setOpen={setOpen}
                        setFormData={setFormData}
                        selected={selected}
                        rows={state[entityKey].rows}
                        showClassesDetails={showClassesDetails}
                        showMembershipDetails={showMembershipDetails}
                        hideAddMembership={hideAddMembership}
                        hideEditAction={hideEditAction}
                    />
                }
                <TableContainer>
                    <Table
                        aria-labelledby="tableTitle"
                        size="small"
                    >
                        <EnhancedTableHeadBackend
                            headCells={headCells}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={state[entityKey].count}
                            stopPointerEvents={stopPointerEvents}
                        />
                        <TableBody>
                            {state[entityKey].rows.length === 0 ?
                                <TableRow>
                                    <TableCell colSpan={headCells.length + 1} align='center'>
                                        No hay registros para mostrar.
                                    </TableCell>
                                </TableRow> :
                                state[entityKey].rows.map((row, index) => {
                                    const isItemSelected = isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => {
                                                if (!stopPointerEvents) {
                                                    handleClick(event, row.id)
                                                }
                                            }}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.id ?? index}
                                            selected={isItemSelected}
                                        >
                                            {!stopPointerEvents &&
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                        sx={{ color: '#011627' }}
                                                    />
                                                </TableCell>
                                            }
                                            {headCells
                                                .map(cell => cell.accessor)
                                                .map((accessor, idx) => (
                                                    <TableCell
                                                        key={idx}
                                                        align="center"
                                                        sx={{
                                                            cursor: 'pointer',
                                                            color: '#011627'
                                                        }}
                                                    >
                                                        {typeof accessor === 'function' ? accessor(row, index) : row[accessor]}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={state[entityKey].count}
                    rowsPerPage={offset}
                    labelRowsPerPage="Registros por página"
                    labelDisplayedRows={({ from, to }) => `${from}–${to} de ${state[entityKey].count}`}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        backgroundColor: '#fff',
                        color: '#000'
                    }}
                />
            </Paper>
            {children}
        </Box>
    );
}