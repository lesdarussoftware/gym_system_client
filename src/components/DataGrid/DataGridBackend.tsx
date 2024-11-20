/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, ReactNode } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SearchSharpIcon from '@mui/icons-material/SearchSharp'
import EditIcon from '@mui/icons-material/Edit'
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import CalendarMonthSharpIcon from '@mui/icons-material/CalendarMonthSharp';
import { IconButton, Tooltip } from '@mui/material';
import PhoneAndroidSharpIcon from '@mui/icons-material/PhoneAndroidSharp';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import InputSharpIcon from '@mui/icons-material/InputSharp';
import OutputSharpIcon from '@mui/icons-material/OutputSharp';

import { EnhancedTableHeadBackend } from './EnhancedTableHeadBackend';
import { getComparator, stableSort } from '../../helpers/utils';
import { NEW, VIEW_SCHEDULES } from '../../config/openTypes';

interface HeadCell {
    id: string
    label: string
    disablePadding?: boolean
    disableSorting?: boolean
    accessor: any;
    sorter?: any;
}

type Order = 'asc' | 'desc'
interface DataGridBackendProps {
    children?: React.ReactNode;
    headCells: HeadCell[];
    rows: any[];
    contentHeader?: React.ReactNode;
    defaultOrder?: Order;
    defaultOrderBy?: string;
    setFormData?: (data: any) => void;
    setOpen?: (mode: string) => void;
    showViewAction?: boolean;
    showEditAction?: boolean;
    showDeleteAction?: boolean;
    showClassesDetails?: boolean;
    showCreateAppUser?: boolean;
    showInput?: boolean;
    showOutput?: boolean;
    filter: {
        offset: number;
        page: number;
    };
    setFilter: any;
    count: number;
    minWidth?: number;
    filterComponent?: ReactNode
}

export function DataGridBackend({
    children,
    headCells,
    rows,
    contentHeader,
    defaultOrder = 'desc',
    defaultOrderBy = 'id',
    setFormData,
    setOpen,
    showViewAction,
    showEditAction,
    showDeleteAction,
    showClassesDetails,
    showCreateAppUser,
    showInput,
    showOutput,
    filter,
    setFilter,
    count,
    minWidth = 750,
    filterComponent
}: DataGridBackendProps) {

    const [order, setOrder] = useState<Order>(defaultOrder);
    const [orderBy, setOrderBy] = useState<string>(defaultOrderBy);

    const handleRequestSort = (_: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setFilter({ ...filter, page: newPage });
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter({
            ...filter,
            offset: parseInt(event.target.value, 10),
            page: 0
        });
    };

    const visibleRows = useMemo(
        () =>
            stableSort(
                rows,
                getComparator(order, orderBy, headCells.find(hc => hc.id === orderBy)?.sorter)
            ),
        [order, orderBy, rows, filter.page]
    );

    return (
        <Box sx={{ width: '100%', backgroundColor: '#fff' }}>
            <Box sx={{
                display: 'flex',
                justifyContent: { md: filterComponent ? 'space-between' : 'start' },
                mb: 1,
                flexWrap: 'wrap',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 3, md: 0 },
                pt: { xs: 3, md: 0 }
            }}>
                <Tooltip
                    title="Agregar"
                    onClick={() => {
                        if (setOpen) setOpen(NEW)
                    }}
                >
                    <IconButton>
                        <AddCircleSharpIcon sx={{ color: '#CECECE !important' }} />
                    </IconButton>
                </Tooltip>
                {filterComponent}
            </Box>
            {contentHeader}
            <Paper sx={{ mb: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth, fontWeight: "bold" }} aria-labelledby="tableTitle" size="small">
                        <EnhancedTableHeadBackend
                            headCells={headCells}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            addCell={showEditAction || showDeleteAction || showViewAction || showClassesDetails || showCreateAppUser || showInput || showOutput}
                        />
                        <TableBody>
                            {visibleRows && visibleRows.length > 0 ? (
                                visibleRows.map((row, index) => (
                                    <TableRow role="checkbox" tabIndex={-1} key={row.id}>
                                        {(showEditAction ||
                                            showDeleteAction ||
                                            showViewAction ||
                                            showClassesDetails ||
                                            showCreateAppUser ||
                                            showInput ||
                                            showOutput) && (
                                                <TableCell sx={{ minWidth: 240 }}>
                                                    {showInput && (
                                                        <Tooltip
                                                            title="Ingresar"
                                                            onClick={() => {
                                                                if (setFormData) setFormData(rows.find((r) => r.id === row.id))
                                                                if (setOpen) setOpen("NEW_INCOME")
                                                            }}
                                                        >
                                                            <IconButton>
                                                                <InputSharpIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    {showOutput && (
                                                        <Tooltip
                                                            title="Egresar"
                                                            onClick={() => {
                                                                if (setFormData) setFormData(rows.find((r) => r.id === row.id))
                                                                if (setOpen) setOpen("NEW_EXPENSE")
                                                            }}
                                                        >
                                                            <IconButton>
                                                                <OutputSharpIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    {showCreateAppUser && (
                                                        <Tooltip
                                                            title="Generar usuario para app"
                                                            onClick={() => {
                                                                if (setFormData) setFormData(rows.find((r) => r.id === row.id));
                                                                if (setOpen) setOpen("GENERATE_APP_USER");
                                                            }}
                                                        >
                                                            <IconButton>
                                                                <PhoneAndroidSharpIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    {showViewAction && (
                                                        <Tooltip
                                                            title="Detalles"
                                                            onClick={() => {
                                                                if (setFormData) setFormData(rows.find((r) => r.id === row.id));
                                                                if (setOpen) setOpen("VIEW");
                                                            }}
                                                        >
                                                            <IconButton>
                                                                <SearchSharpIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    {showClassesDetails && (
                                                        <Tooltip title={"Ver días y horarios"} onClick={() => {
                                                            if (setOpen) setOpen(VIEW_SCHEDULES);
                                                            if (setFormData) setFormData(rows.find((r) => r.id === row.id));
                                                        }}>
                                                            <IconButton>
                                                                <CalendarMonthSharpIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    {showEditAction && (
                                                        <Tooltip
                                                            title="Editar"
                                                            onClick={() => {
                                                                if (setFormData) setFormData(rows.find((r) => r.id === row.id));
                                                                if (setOpen) setOpen("EDIT");
                                                            }}
                                                        >
                                                            <IconButton>
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    {showDeleteAction && (
                                                        <Tooltip
                                                            title="Borrar"
                                                            onClick={() => {
                                                                if (setFormData) setFormData(rows.find((r) => r.id === row.id));
                                                                if (setOpen) setOpen("DELETE");
                                                            }}
                                                        >
                                                            <IconButton>
                                                                <DeleteSharpIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </TableCell>
                                            )}
                                        {headCells.map((cell) => cell.accessor).map((accessor) => (
                                            <TableCell key={accessor} align="center">
                                                {typeof accessor === "function" ? accessor(row, index) : row[accessor]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={headCells.length + 1}
                                        align="inherit"
                                        sx={{
                                            fontSize: "1rem",
                                            textAlign: 'center'
                                        }}
                                    >
                                        No se encontraron registros. Pruebe actualizar la página.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 60, 100]}
                    component="div"
                    count={count}
                    rowsPerPage={filter.offset}
                    labelRowsPerPage="Registros por página"
                    labelDisplayedRows={({ from, to }) => `${from}–${to} de ${count}`}
                    page={filter.page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    slotProps={{
                        actions: {
                            nextButton: {
                                disabled: ((filter.page + 1) * filter.offset) >= count
                            }
                        }
                    }}
                />
            </Paper>
            {children}
        </Box>
    );
}
