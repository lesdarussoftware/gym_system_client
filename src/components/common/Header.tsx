/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import { createTheme, styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { AuthContext } from '../../providers/AuthProvider';
import { ThemeContext } from '../../App';
import { useQuery } from '../../hooks/useQuery';
import { useThemes } from '../../hooks/useThemes';

import { LOGOUT_URL } from '../../config/urls';
import { DARK, LIGHT } from '../../config/themes';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#FFD700',
        width: 32,
        height: 32,
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));

type ThemeSwitchProps = {
    handleChangeTheme: any;
}

function ThemeSwitch({ handleChangeTheme }: ThemeSwitchProps) {
    return (
        <FormGroup>
            <FormControlLabel
                control={<MaterialUISwitch sx={{ m: 1 }} defaultChecked />}
                label="Tema"
                onChange={handleChangeTheme}
            />
        </FormGroup>
    );
}

export function Header() {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const { handleQuery } = useQuery();
    const { auth, setAuth } = React.useContext(AuthContext);
    const { setTheme } = React.useContext(ThemeContext);
    const { pathname } = useLocation();
    const { themes } = useThemes();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleQuery({
            url: LOGOUT_URL,
            method: 'POST',
            token: auth?.refresh_token
        });
        setAnchorEl(null);
        setAuth(null);
        localStorage.removeItem('auth');
        navigate('/')
    };

    const handleChangeTheme = (e: { target: { checked: any; }; }) => {
        let newTheme;
        if (e.target.checked) {
            newTheme = createTheme(themes[DARK]);
        } else {
            newTheme = createTheme(themes[LIGHT]);
        }
        setTheme(newTheme);
    }

    const menuItemStyles = {
        minWidth: 100,
        textAlign: 'center',
        marginLeft: 1,
        marginRight: 1,
        borderRadius: 1,
        transition: '100ms all',
        ':hover': {
            cursor: 'pointer',
            color: '#fff',
            backgroundColor: '#BDBDBD'
        }
    }

    return (
        <Box sx={{
            height: 60,
            marginBottom: 1,
            paddingRight: 3,
            paddingLeft: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end'
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                <Typography
                    sx={{
                        ...menuItemStyles,
                        color: pathname === '/clientes' ? '#fff' : '',
                        backgroundColor: pathname === '/clientes' ? '#BDBDBD' : ''
                    }}
                    onClick={() => navigate('/clientes')}
                >
                    Clientes
                </Typography>
                <Typography
                    sx={{
                        ...menuItemStyles,
                        color: pathname === '/horarios' ? '#fff' : '',
                        backgroundColor: pathname === '/horarios' ? '#BDBDBD' : ''
                    }}
                    onClick={() => navigate('/horarios')}
                >
                    Horarios
                </Typography>
                <Typography
                    sx={{
                        ...menuItemStyles,
                        color: pathname === '/abm' ? '#fff' : '',
                        backgroundColor: pathname === '/abm' ? '#BDBDBD' : ''
                    }}
                    onClick={() => navigate('/abm')}
                >
                    ABM
                </Typography>
                <ThemeSwitch handleChangeTheme={handleChangeTheme} />
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleClose}>
                    <Avatar /> Perfil
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Avatar /> Licencia
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Salir
                </MenuItem>
            </Menu>
        </Box>
    );
}