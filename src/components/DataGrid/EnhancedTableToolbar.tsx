import { IconButton, Toolbar, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleSharpIcon from '@mui/icons-material/AddCircleSharp';
import PersonSearchSharpIcon from '@mui/icons-material/PersonSearchSharp';
import CalendarMonthSharpIcon from '@mui/icons-material/CalendarMonthSharp';
import RemoveRedEyeSharpIcon from '@mui/icons-material/RemoveRedEyeSharp';

import { NEW, EDIT, DELETE, VIEW_TEACHERS, VIEW_SCHEDULES, VIEW_MEMBERSHIP_DETAILS } from '../../config/openTypes';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface EnhancedTableToolbarProps {
    numSelected: number;
    setOpen: any;
    setFormData: any;
    selected: any;
    rows: any;
    showClassesDetails?: boolean;
    showMembershipDetails?: boolean;
}

export function EnhancedTableToolbar({
    numSelected,
    setOpen,
    setFormData,
    selected,
    rows,
    showClassesDetails,
    showMembershipDetails
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
            {selected.length === 0 &&
                <Tooltip title="Nuevo" onClick={() => setOpen(NEW)}>
                    <IconButton>
                        <AddCircleSharpIcon />
                    </IconButton>
                </Tooltip>
            }
            {selected.length === 1 && rows.length > 0 &&
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
                    {showClassesDetails &&
                        <>
                            <Tooltip title={"Ver profesores"} onClick={() => {
                                setOpen(VIEW_TEACHERS);
                                setFormData(rows.find((row: { id: number; }) => row.id === selected[0]));
                            }}>
                                <IconButton>
                                    <PersonSearchSharpIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={"Ver días y horarios"} onClick={() => {
                                setOpen(VIEW_SCHEDULES);
                                setFormData(rows.find((row: { id: number; }) => row.id === selected[0]));
                            }}>
                                <IconButton>
                                    <CalendarMonthSharpIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    }
                    {showMembershipDetails &&
                        <Tooltip title={"Ver detalles"} onClick={() => {
                            setOpen(VIEW_MEMBERSHIP_DETAILS);
                            setFormData(rows.find((row: { id: number; }) => row.id === selected[0]));
                        }}>
                            <IconButton>
                                <RemoveRedEyeSharpIcon />
                            </IconButton>
                        </Tooltip>
                    }
                </>
            }
        </Toolbar>
    );
}