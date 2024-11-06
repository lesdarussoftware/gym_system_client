import { Box, TableCell, TableRow } from '@mui/material'
import TableHead from '@mui/material/TableHead'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '@mui/utils'
import React from 'react'

interface HeadCell {
    id: string
    label: string
    disablePadding?: boolean
    disableSorting?: boolean
}

type Order = 'asc' | 'desc'

interface EnhancedTableHeadProps {
    headCells: HeadCell[]
    order: Order
    orderBy: string
    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void
    addCell?: boolean
}

export function EnhancedTableHeadBackend({
    headCells,
    order,
    orderBy,
    onRequestSort,
    addCell = false,
}: EnhancedTableHeadProps) {

    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property)
    }

    return (
        <TableHead>
            <TableRow>
                {addCell && <TableCell sx={{ width: 120 }} />}
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align="center"
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.disableSorting ? headCell.label :
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
                        }
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}
