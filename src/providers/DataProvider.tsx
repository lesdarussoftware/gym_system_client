import { createContext, ReactNode, Dispatch, useReducer } from "react";

import { SET_CLIENTS, SET_USERS, SET_TEACHERS, SET_CLASSES, SET_PACKS } from '../config/dataReducerActionTypes'

interface Visit {
    id: number;
    membership_class_id: number;
    membership_class: MembershipClass;
    date: Date;
    observations?: string;
    created_at: Date;
    updated_at: Date;
}

export interface Membership {
    id: number;
    client_id: number;
    client: Client;
    start: Date;
    duration: number;
    price: number;
    limit: number;
    observations?: string;
    classes: MembershipClass[];
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

export interface Schedule {
    id: number;
    class_id: number;
    class: Class;
    teacher_id: number;
    teacher: Teacher;
    day: 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'Sabado' | 'Domingo';
    hour: number;
    observations?: string;
    created_at: Date;
    updated_at: Date;
}

export interface Client {
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

export interface User {
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

export interface Teacher {
    id: number;
    gym_hash: string;
    first_name: string;
    last_name: string;
    email?: string | null;
    phone?: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface Class {
    id: number;
    gym_hash: string;
    name: string;
    price: number;
    duration?: number | null;
    schedules: Schedule[];
    memberships: MembershipClass[];
    created_at: Date;
    updated_at: Date;
}

export interface Pack {
    id: number;
    gym_hash: string;
    name: string;
    price: number;
    created_at: Date;
    updated_at: Date;
}

export interface PackClass {
    id: number;
    pack_id: number;
    class_id: number;
    amount: number;
    created_at: Date;
    updated_at: Date;
}

interface State {
    clients: { rows: Client[], count: number };
    users: { rows: User[], count: number };
    teachers: { rows: Teacher[], count: number };
    classes: { rows: Class[], count: number };
    packs: { rows: Pack[], count: number };
}

type Action =
    | { type: "SET_CLIENTS"; payload: { rows: Client[], count: number } }
    | { type: "SET_USERS"; payload: { rows: User[], count: number } }
    | { type: "SET_TEACHERS"; payload: { rows: Teacher[], count: number } }
    | { type: "SET_CLASSES"; payload: { rows: Class[], count: number } }
    | { type: "SET_PACKS"; payload: { rows: Pack[], count: number } };

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
        case SET_PACKS:
            return { ...state, packs: action.payload };
        default:
            return state;
    }
};

const initialState: State = {
    clients: { rows: [], count: 0 },
    users: { rows: [], count: 0 },
    teachers: { rows: [], count: 0 },
    classes: { rows: [], count: 0 },
    packs: { rows: [], count: 0 }
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
