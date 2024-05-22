export function LoginPage() {
    return (
        <div style={{ width: '50%', margin: '0 auto' }}>
            <h3>Lesda Gym</h3>
            <form style={{ width: '50%' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="username">Usuario</label>
                    <input type="text" name="username" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="password">Contraseña</label>
                    <input type="password" name="password" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <input type="submit" value="Iniciar sesión" className="btn btn-primary" />
                    <input type="button" value="Volver" className="btn btn-secondary" />
                </div>
            </form>
        </div>
    );
}