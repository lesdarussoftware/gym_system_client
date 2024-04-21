import { IconButton, Toolbar, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface EnhancedTableToolbarProps {
    numSelected: number;
    setOpen: any;
}

export function EnhancedTableToolbar({
    numSelected,
    setOpen
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
            <Tooltip title="Nuevo" onClick={() => setOpen('NEW')}>
                <IconButton>
                    <AddCircleSharpIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
                <IconButton>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={"Editar"}>
                <IconButton>
                    <EditIcon />
                </IconButton>
            </Tooltip>
        </Toolbar>
    );
}