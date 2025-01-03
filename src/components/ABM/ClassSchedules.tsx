import { useContext } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import EditIcon from '@mui/icons-material/Edit';

import { Class, DataContext, Schedule } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { useClasses } from "../../hooks/useClasses";
import { useTeachers } from "../../hooks/useTeachers";

import { DataGridFrontend } from "../DataGrid/DataGridFrontend";

import { DAYS, HOURS } from "../../config/schedules";
import { EDIT, NEW, DELETE } from "../../config/openTypes";

type ClassSchedulesProps = {
    formData: Class;
}

export function ClassSchedules({ formData }: ClassSchedulesProps) {

    const { state } = useContext(DataContext);
    const {
        formData: newSchedule,
        setFormData,
        errors,
        validate,
        setDisabled,
        handleChange,
        disabled,
        reset
    } = useForm({
        defaultData: {
            class_id: formData.id,
            teacher_id: '',
            day: '',
            hour: '',
            observations: ''
        },
        rules: {
            day: { required: true, },
            teacher_id: { required: true },
            hour: { required: true },
            observations: { maxLength: 255 }
        }
    });
    const { handleSubmitSchedule, handleDeleteSchedule, open, setOpen, handleClose } = useClasses();
    useTeachers();

    const headCells = [
        {
            id: 'day',
            numeric: false,
            disablePadding: true,
            label: 'Día',
            accessor: 'day'
        },
        {
            id: 'hour',
            numeric: false,
            disablePadding: true,
            label: 'Hora',
            accessor: 'hour'
        },
        {
            id: 'teacher_id',
            numeric: false,
            disablePadding: true,
            label: 'Profesor',
            accessor: (row: Schedule) => `${row.teacher.first_name} ${row.teacher.last_name}`
        },
        {
            id: 'observations',
            numeric: false,
            disablePadding: true,
            label: 'Detalles',
            accessor: 'observations'
        },
        {
            id: 'actions',
            numeric: false,
            disablePadding: true,
            label: '',
            accessor: (row: { id: number; }) => (
                <>
                    <Button onClick={() => {
                        setFormData(row);
                        setOpen(DELETE);
                    }}>
                        <HighlightOffSharpIcon />
                    </Button>
                    <Button onClick={() => {
                        setFormData(row);
                        setOpen(EDIT);
                    }}>
                        <EditIcon />
                    </Button>
                </>
            )
        },
    ]

    return (
        <Box>
            <Typography variant="h6">
                Horarios y días de la clase {formData.name}
            </Typography>
            {(open === NEW || open === EDIT) &&
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 1 }}>
                    <form onSubmit={(e) => handleSubmitSchedule(e, validate, newSchedule, setDisabled, reset)}>
                        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <FormControl sx={{ width: '50%' }}>
                                    <InputLabel id="day-select">Día</InputLabel>
                                    <Select
                                        labelId="day-select"
                                        id="day"
                                        value={newSchedule.day}
                                        label="Día"
                                        name="day"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="">Seleccione</MenuItem>
                                        <MenuItem value={DAYS.MONDAY}>{DAYS.MONDAY}</MenuItem>
                                        <MenuItem value={DAYS.TUESDAY}>{DAYS.TUESDAY}</MenuItem>
                                        <MenuItem value={DAYS.WEDNESDAY}>{DAYS.WEDNESDAY}</MenuItem>
                                        <MenuItem value={DAYS.THURSDAY}>{DAYS.THURSDAY}</MenuItem>
                                        <MenuItem value={DAYS.FRIDAY}>{DAYS.FRIDAY}</MenuItem>
                                        <MenuItem value={DAYS.SATURDAY}>{DAYS.SATURDAY}</MenuItem>
                                        <MenuItem value={DAYS.SUNDAY}>{DAYS.SUNDAY}</MenuItem>
                                    </Select>
                                    {errors.day?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * El día es requerido.
                                        </Typography>
                                    }
                                </FormControl>
                                <FormControl sx={{ width: '50%' }}>
                                    <InputLabel id="hour-select">Hora</InputLabel>
                                    <Select
                                        labelId="hour-select"
                                        id="hour"
                                        value={newSchedule.hour}
                                        label="Hora"
                                        name="hour"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="">Seleccione</MenuItem>
                                        {HOURS.map(h => (
                                            <MenuItem key={h} value={h}>{h}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.hour?.type === 'required' &&
                                        <Typography variant="caption" color="red" marginTop={1}>
                                            * La hora es requerida.
                                        </Typography>
                                    }
                                </FormControl>
                            </Box>
                            <FormControl sx={{ width: '100%' }}>
                                <InputLabel id="teacher-select">Profesor</InputLabel>
                                <Select
                                    labelId="teacher-select"
                                    id="teacher_id"
                                    value={newSchedule.teacher_id}
                                    label="Profesor"
                                    name="teacher_id"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">Seleccione</MenuItem>
                                    {state.teachers.rows.map(t => (
                                        <MenuItem key={t.id} value={t.id}>{`${t.first_name} ${t.last_name}`}</MenuItem>
                                    ))}
                                </Select>
                                {errors.teacher_id?.type === 'required' &&
                                    <Typography variant="caption" color="red" marginTop={1}>
                                        * El profesor es requerido.
                                    </Typography>
                                }
                            </FormControl>
                            <FormControl>
                                <InputLabel htmlFor="observations">Detalles</InputLabel>
                                <Input
                                    id="observations"
                                    type="text"
                                    name="observations"
                                    value={newSchedule.observations}
                                    onChange={handleChange}
                                />
                                {errors.observations?.type === 'maxLength' &&
                                    <Typography variant="caption" color="red" marginTop={1}>
                                        * El detalle es demasiado largo.
                                    </Typography>
                                }
                            </FormControl>
                        </Box>
                        <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                            <Button type="button" variant="outlined" sx={{ marginRight: 1 }} onClick={() => handleClose(reset)}>
                                Cancelar
                            </Button>
                            <Button type="submit" variant="contained" disabled={disabled} sx={{ color: '#fff' }}>
                                Guardar
                            </Button>
                        </Box>
                    </form>
                </Box>
            }
            {open === DELETE &&
                <Box sx={{ margin: 1, textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ color: '#f00', marginBottom: 1 }}>
                        ¿Eliminar horario?
                    </Typography>
                    <Button size="small" variant="outlined" sx={{ marginRight: 1 }} onClick={() => handleClose(reset)}>
                        Cancelar
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        sx={{ color: '#fff' }}
                        onClick={() => handleDeleteSchedule(newSchedule.id, reset)}
                    >
                        Confirmar
                    </Button>
                </Box>
            }
            <Box sx={{ marginTop: 2 }}>
                <DataGridFrontend
                    headCells={headCells}
                    rows={state.classes.rows.find(c => c.id === formData.id)?.schedules || []}
                    stopPointerEvents
                    setOpen={open !== null ? false : setOpen}
                    setFormData={open !== null ? false : setFormData}
                />
            </Box>
        </Box>
    );
}