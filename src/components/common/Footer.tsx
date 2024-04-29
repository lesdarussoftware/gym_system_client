export function Footer() {
    return (
        <footer style={{ position: 'absolute', bottom: 10, right: 20 }}>
            Desarrollado por <a style={{ textDecoration: 'none' }}>Lesdarus Software</a> &copy; | {new Date().getFullYear()}
        </footer>
    );
}