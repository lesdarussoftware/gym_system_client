import { Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { visuallyHidden } from '@mui/utils';

export interface HeadCell {
    id: string;
    label: string;
    disablePadding?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    accessor: string | ((row: any, index: number) => React.ReactNode);
}

interface EnhancedTableHeadProps {
    headCells: HeadCell[];
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: 'asc' | 'desc';
    orderBy: string;
    numSelected: number;
    rowCount: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
    stopPointerEvents?: boolean;
}

export function EnhancedTableHeadFrontend({
    headCells,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    stopPointerEvents
}: EnhancedTableHeadProps) {

    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow sx={{ backgroundColor: '#fff' }}>
                {!stopPointerEvents &&
                    <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{
                                'aria-label': 'select all desserts',
                            }}
                            sx={{ color: '#011627' }}
                        />
                    </TableCell>
                }
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align="center"
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}