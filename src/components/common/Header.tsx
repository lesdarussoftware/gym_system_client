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

import { AuthContext } from '../../providers/AuthProvider';
import { useQuery } from '../../hooks/useQuery';

import { LOGOUT_URL } from '../../config/urls';

export function Header() {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const { handleQuery } = useQuery();
    const { auth, setAuth } = React.useContext(AuthContext);
    const { pathname } = useLocation();

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

    const menuItemStyles = {
        minWidth: 100,
        textAlign: 'center',
        marginLeft: 1,
        marginRight: 1,
        borderRadius: 1,
        transition: '100ms all',
        ':hover': {
            cursor: 'pointer',
            color: '#000',
            backgroundColor: '#FFD700'
        }
    }

    return (
        <Box sx={{
            height: 60,
            borderRadius: 1,
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
                        color: pathname === '/clientes' ? '#000' : '#fff',
                        backgroundColor: pathname === '/clientes' ? '#FFD700' : ''
                    }}
                    onClick={() => navigate('/clientes')}
                >
                    Clientes
                </Typography>
                <Typography
                    sx={{
                        ...menuItemStyles,
                        color: pathname === '/horarios' ? '#000' : '#fff',
                        backgroundColor: pathname === '/horarios' ? '#FFD700' : ''
                    }}
                    onClick={() => navigate('/horarios')}
                >
                    Horarios
                </Typography>
                <Typography
                    sx={{
                        ...menuItemStyles,
                        color: pathname === '/abm' ? '#000' : '#fff',
                        backgroundColor: pathname === '/abm' ? '#FFD700' : ''
                    }}
                    onClick={() => navigate('/abm')}
                >
                    ABM
                </Typography>
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