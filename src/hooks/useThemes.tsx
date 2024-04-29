import { DARK, LIGHT } from "../config/themes"

export function useThemes() {

    const themes = {
        [DARK]: {
            palette: {
                primary: {
                    main: '#FFD700',
                },
                text: {
                    primary: '#fff'
                },
                background: {
                    default: '#1A1A1A'
                }
            },
            components: {
                MuiInputLabel: {
                    styleOverrides: {
                        root: {
                            color: '#fff',
                            borderColor: '#fff'
                        }
                    }
                }
            }
        },
        [LIGHT]: {
            palette: {
                primary: {
                    main: '#FFD700',
                }
            }
        }
    }

    return { themes }
}