import { createContext, ReactNode, Dispatch, useReducer } from "react";

import { SET_CLIENTS, SET_USERS, SET_TEACHERS, SET_CLASSES } from '../config/dataReducerActionTypes'

interface Visit {
    id: number;
    membership_class_id: number;
    membership_class: MembershipClass;
    date: Date;
    created_at: Date;
    updated_at: Date;
}

interface Membership {
    id: number;
    client_id: number;
    client: Client;
    start: Date;
    duration: number;
    price: number;
    limit: number;
    classes: MembershipClass[];
    created_at: Date;
    updated_at: Date;
}

interface TeacherClass {
    teacher_id: number;
    teacher: Teacher;
    class_id: number;
    class: Class;
    created_at: Date;
    updated_at: Date;
}

interface MembershipClass {
    id: number;
    membership_id: number;
    membership: Membership;
    class_id: number;
    class: Class;
    visits: Visit[];
    created_at: Date;
    updated_at: Date;
}

interface Schedule {
    id: number;
    class_id: number;
    class: Class;
    day: 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'Sabado' | 'Domingo';
    hour: number;
    created_at: Date;
    updated_at: Date;
}

interface Client {
    id: number;
    first_name: string;
    last_name: string;
    dni: number;
    email: string;
    phone: string;
    gym_hash: string;
    memberships: Membership[];
    created_at: Date;
    updated_at: Date;
}

interface User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email?: string | null;
    password: string;
    role: 'SUPERUSER' | 'ADMIN' | 'USER';
    gym_hash: string;
    created_at: Date;
    updated_at: Date;
}

interface Teacher {
    id: number;
    gym_hash: string;
    first_name: string;
    last_name: string;
    email?: string | null;
    phone?: string | null;
    classes: TeacherClass[];
    created_at: Date;
    updated_at: Date;
}

export interface Class {
    id: number;
    gym_hash: string;
    name: string;
    duration?: number | null;
    teachers: TeacherClass[];
    schedules: Schedule[];
    memberships: MembershipClass[];
    created_at: Date;
    updated_at: Date;
}

// Definimos el tipo para el estado del contexto
interface State {
    clients: Client[];
    users: User[];
    teachers: Teacher[];
    classes: Class[];
}

type Action =
    | { type: "SET_CLIENTS"; payload: Client[] }
    | { type: "SET_USERS"; payload: User[] }
    | { type: "SET_TEACHERS"; payload: Teacher[] }
    | { type: "SET_CLASSES"; payload: Class[] };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case SET_CLIENTS:
            return { ...state, clients: action.payload };
        case SET_USERS:
            return { ...state, users: action.payload };
        case SET_TEACHERS:
            return { ...state, teachers: action.payload };
        case SET_CLASSES:
            return { ...state, classes: action.payload };
        default:
            return state;
    }
};

const initialState: State = {
    clients: [],
    users: [],
    teachers: [],
    classes: [],
};

export const DataContext = createContext<{
    state: State;
    dispatch: Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

interface DataProviderProps {
    children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <DataContext.Provider value={{ state, dispatch }}>
            {children}
        </DataContext.Provider>
    );
}
