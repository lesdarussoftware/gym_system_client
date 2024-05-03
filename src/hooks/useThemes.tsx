import { DARK, LIGHT } from "../config/themes"

export function useThemes() {

    const themes = {
        [DARK]: {
            mode: DARK,
            palette: {
                primary: {
                    main: '#FFD700',
                },
                text: {
                    primary: '#000'
                },
                background: {
                    default: '#030918'
                }
            }
        },
        [LIGHT]: {
            mode: LIGHT,
            palette: {
                primary: {
                    main: '#FFD700',
                }
            }
        }
    }

    return { themes }
}