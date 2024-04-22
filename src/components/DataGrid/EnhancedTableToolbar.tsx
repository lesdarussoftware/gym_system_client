import { IconButton, Toolbar, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';

import { NEW, EDIT, DELETE } from '../../config/openTypes';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface EnhancedTableToolbarProps {
    numSelected: number;
    setOpen: any;
    setFormData: any;
    selected: any;
    rows: any;
}

export function EnhancedTableToolbar({
    numSelected,
    setOpen,
    setFormData,
    selected,
    rows
}: EnhancedTableToolbarProps) {
    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            <Tooltip title="Nuevo" onClick={() => setOpen(NEW)}>
                <IconButton>
                    <AddCircleSharpIcon />
                </IconButton>
            </Tooltip>
            {selected.length === 1 &&
                <>
                    <Tooltip title="Eliminar" onClick={() => {
                        setOpen(DELETE);
                        setFormData(rows.find((row: { id: number; }) => row.id === selected[0]));
                    }}>
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={"Editar"} onClick={() => {
                        setOpen(EDIT);
                        setFormData(rows.find((row: { id: number; }) => row.id === selected[0]));
                    }}>
                        <IconButton>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                </>
            }
        </Toolbar>
    );
}