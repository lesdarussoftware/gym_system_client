// import { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";
// import { Alert, Snackbar } from "@mui/material";

// import { SUCCESS } from "../config/messageProviderTypes";

// interface MessageContextType {
//     openMessage: boolean;
//     setOpenMessage: Dispatch<SetStateAction<boolean>>;
//     severity: 'success' | 'info' | 'warning' | 'error';
//     setSeverity: Dispatch<SetStateAction<'success' | 'info' | 'warning' | 'error'>>;
//     message: string;
//     setMessage: Dispatch<SetStateAction<string>>;
// }

// export const MessageContext = createContext<MessageContextType>({
//     openMessage: false,
//     setOpenMessage: () => { },
//     severity: SUCCESS,
//     setSeverity: () => { },
//     message: '',
//     setMessage: () => { }
// })

// interface MessageProviderProps {
//     children: ReactNode;
// }

// export function MessageProvider({ children }: MessageProviderProps) {

//     const [openMessage, setOpenMessage] = useState<boolean>(false)
//     const [severity, setSeverity] = useState<'success' | 'info' | 'warning' | 'error'>(SUCCESS)
//     const [message, setMessage] = useState<string>('')

//     return (
//         <MessageContext.Provider value={{
//             openMessage,
//             setOpenMessage,
//             severity,
//             setSeverity,
//             message,
//             setMessage
//         }}>
//             {children}
//             <Snackbar
//                 open={openMessage}
//                 autoHideDuration={3000}
//                 onClose={() => setOpenMessage(false)}
//                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//             >
//                 <Alert severity={severity} sx={{ width: '100%' }}>
//                     {message}
//                 </Alert>
//             </Snackbar>
//         </MessageContext.Provider>
//     )
// }
