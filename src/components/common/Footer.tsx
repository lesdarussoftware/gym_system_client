import { useContext } from "react";

import { ThemeContext } from "../../App";

import { DARK } from "../../config/themes";

export function Footer() {

    const { theme } = useContext(ThemeContext);

    return (
        <footer style={{ position: 'absolute', bottom: 10, right: 20, color: theme.mode === DARK ? '#fff' : '#000' }}>
            Desarrollado por <a style={{ textDecoration: 'none' }} href="https://lesdarussoftware.github.io/web/" target="_blank">Lesdarus Software</a> &copy; | {new Date().getFullYear()}
        </footer>
    );
}