import { ReactNode, createContext, useState } from "react";
import { Client } from "./DataProvider";

interface HandleClientType {
    client: Client | null;
    setClient: (client: Client | null) => void;
}

export const HandleClientContext = createContext<HandleClientType>({
    client: null,
    setClient: () => { }
});
interface HandleClientProviderProps {
    children: ReactNode;
}

export function HandleClientProvider({ children }: HandleClientProviderProps) {

    const [client, setClient] = useState<Client | null>(null);

    return (
        <HandleClientContext.Provider value={{ client, setClient }}>
            {children}
        </HandleClientContext.Provider>
    );
}
