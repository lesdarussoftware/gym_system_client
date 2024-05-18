import { useContext } from "react";
import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import EditIcon from '@mui/icons-material/Edit';

import { Class, DataContext } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { useClasses } from "../../hooks/useClasses";

import { DataGrid } from "../DataGrid/DataGrid";

import { DAYS, HOURS } from "../../config/schedules";

type ClassSchedulesProps = {
    formData: Class;
}

export function ClassSchedules({ formData }: ClassSchedulesProps) {

    const { state } = useContext(DataContext);
    const {
        formData: newSchedule,
        errors,
        validate,
        setDisabled,
        handleChange,
        disabled,
        reset
    } = useForm({
        defaultData: { class_id: formData.id, day: '', hour: '', observations: '' },
        rules: { day: { required: true, }, hour: { required: true }, observations: { maxLength: 255 } }
    });
    const { handleSubmitSchedule, handleDeleteSchedule } = useClasses();

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
                    <Button onClick={() => handleDeleteSchedule(row.id, reset)}>
                        <HighlightOffSharpIcon />
                    </Button>
                    <Button>
                        <EditIcon />
                    </Button>
                </>
            )
        },
    ]

    return (
        <Box>
            <Typography variant="h6" marginBottom={2}>
                Horarios y días de la clase {formData.name}
            </Typography>
            <form
                onSubmit={(e) => handleSubmitSchedule(e, validate, newSchedule, setDisabled, reset)}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 1,
                    alignItems: 'center'
                }}
            >
                <Box sx={{ width: '70%', display: 'flex', gap: 1, flexDirection: 'column' }}>
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
                <Button
                    type="submit"
                    variant="contained"
                    disabled={disabled}
                >
                    Guardar
                </Button>
            </form>
            <Box sx={{ marginTop: 2 }}>
                <DataGrid
                    headCells={headCells}
                    rows={state.classes.find(c => c.id === formData.id)?.schedules || []}
                    stopPointerEvents
                />
            </Box>
        </Box>
    );
}