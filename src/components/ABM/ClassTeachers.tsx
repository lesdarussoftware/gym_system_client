import { useContext } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';

import { Class, DataContext } from "../../providers/DataProvider";
import { useForm } from "../../hooks/useForm";
import { useClasses } from "../../hooks/useClasses";

import { DataGrid } from "../DataGrid/DataGrid";

type ClassTeachersProps = {
    formData: Class;
}

export function ClassTeachers({ formData }: ClassTeachersProps) {

    const { state } = useContext(DataContext);
    const {
        formData: newTeacherClass,
        errors,
        validate,
        setDisabled,
        handleChange,
        disabled,
        reset
    } = useForm({
        defaultData: { class_id: formData.id, teacher_id: '' },
        rules: { teacher_id: { required: true, } }
    });
    const { handleSubmitTeacherClass, handleDeleteTeacherClass } = useClasses();

    const headCells = [
        {
            id: 'teacher',
            numeric: false,
            disablePadding: true,
            label: 'Nombre y apellido',
            accessor: (row: { teacher: { first_name: string; last_name: string; }; }) => {
                return `${row.teacher.first_name} ${row.teacher.last_name}`;
            }
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: true,
            label: 'Email',
            accessor: 'email'
        },
        {
            id: 'phone',
            numeric: false,
            disablePadding: true,
            label: 'Teléfono',
            accessor: 'phone'
        },
        {
            id: 'actions',
            numeric: false,
            disablePadding: true,
            label: '',
            accessor: (row: { teacher_id: number; class_id: number; }) => {
                return (
                    <Button onClick={() => handleDeleteTeacherClass(row.teacher_id, row.class_id, reset)}>
                        <HighlightOffSharpIcon />
                    </Button>
                )
            }
        },
    ]

    return (
        <Box>
            <Typography variant="h6" marginBottom={2}>
                Profesores de la clase {formData.name}
            </Typography>
            <form
                onSubmit={(e) => handleSubmitTeacherClass(e, validate, newTeacherClass, setDisabled, reset)}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 1,
                    alignItems: 'center'
                }}
            >
                <FormControl sx={{ width: '70%' }}>
                    <InputLabel id="teacher-select">Profesor</InputLabel>
                    <Select
                        labelId="teacher-select"
                        id="teacher_id"
                        value={newTeacherClass.teacher_id}
                        label="Profesor"
                        name="teacher_id"
                        onChange={handleChange}
                    >
                        <MenuItem value="">Seleccione</MenuItem>
                        {state.teachers.map(t => (
                            <MenuItem key={t.id} value={t.id}>{`${t.first_name} ${t.last_name}`}</MenuItem>
                        ))}
                    </Select>
                    {errors.teacher_id?.type === 'required' &&
                        <Typography variant="caption" color="red" marginTop={1}>
                            * El profesor es requerido.
                        </Typography>
                    }
                </FormControl>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={disabled}
                >
                    Guardar
                </Button>
            </form>
            <Box sx={{ marginTop: 1 }}>
                <DataGrid
                    headCells={headCells}
                    rows={state.classes.find(c => c.id === formData.id)?.teachers || []}
                    stopPointerEvents
                />
            </Box>
        </Box>
    );
}