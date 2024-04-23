/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { EnhancedTableHead, HeadCell } from './EnhancedTableHead';
import { EnhancedTableToolbar } from './EnhancedTableToolbar';

interface DataGridProps {
    children?: React.ReactNode;
    headCells: HeadCell[];
    rows: any[];
    setOpen?: any;
    setFormData?: any;
    defaultOrder?: 'asc' | 'desc';
    defaultOrderBy?: string;
    stopPointerEvents?: boolean;
    showClassesDetails?: boolean;
}

function descendingComparator(a: any, b: any, orderBy: string) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order: 'asc' | 'desc', orderBy: string) {
    return order === 'desc'
        ? (a: any, b: any) => descendingComparator(a, b, orderBy)
        : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

function stableSort(array: any[], comparator: (a: any, b: any) => number) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export function DataGrid({
    children,
    headCells,
    rows,
    setOpen,
    setFormData,
    defaultOrder = 'desc',
    defaultOrderBy = 'id',
    stopPointerEvents,
    showClassesDetails
}: DataGridProps) {

    const [order, setOrder] = React.useState<'asc' | 'desc'>(defaultOrder);
    const [orderBy, setOrderBy] = React.useState<string>(defaultOrderBy);
    const [selected, setSelected] = React.useState<any[]>([]);
    const [dense, setDense] = React.useState<boolean>(true);
    const [page, setPage] = React.useState<number>(0);
    const [offset, setOffset] = React.useState<number>(10);

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: any) => {
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

    const handleChangePage = (event: unknown, newPage: number) => {
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const isSelected = (id: any) => selected.indexOf(id) !== -1;

    const visibleRows = React.useMemo(
        () => stableSort(rows, getComparator(order, orderBy)),
        [order, orderBy, rows]
    );

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                {setOpen && setFormData &&
                    <EnhancedTableToolbar
                        numSelected={selected.length}
                        setOpen={setOpen}
                        setFormData={setFormData}
                        selected={selected}
                        rows={rows}
                        showClassesDetails={showClassesDetails}
                    />
                }
                <TableContainer>
                    <Table
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            headCells={headCells}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            stopPointerEvents={stopPointerEvents}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
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
                                                />
                                            </TableCell>
                                        }
                                        {headCells.map(cell => cell.accessor).map(accessor => (
                                            <TableCell key={accessor} align="center" sx={{ cursor: 'pointer' }}>
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
                    count={-1}
                    rowsPerPage={offset}
                    labelRowsPerPage="Registros por página"
                    labelDisplayedRows={({ from, to }) => `${from}–${to} de ${rows.length}`}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    slotProps={{
                        actions: {
                            nextButton: {
                                disabled: ((page + 1) * offset) >= rows.length
                            }
                        }
                    }}
                />
            </Paper>
            {children}
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Condensar tabla"
            />
        </Box>
    );
}