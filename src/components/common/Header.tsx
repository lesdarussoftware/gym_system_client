/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Logout from '@mui/icons-material/Logout'

import { AuthContext } from '../../providers/AuthProvider'
import { useQuery } from '../../hooks/useQuery'

import { LOGOUT_URL } from '../../config/urls'
import { MAIN_COLOR } from '../../config/colors'

export function Header() {

    const { auth, setAuth } = useContext(AuthContext)

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const { handleQuery } = useQuery()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleLogout = () => {
        handleQuery({
            url: LOGOUT_URL,
            method: 'POST',
            token: auth?.refresh_token
        })
        setAnchorEl(null)
        setAuth(null)
        localStorage.removeItem('auth')
        navigate('/')
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
            backgroundColor: MAIN_COLOR
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
                        paddingY: 0.5,
                        color: pathname === '/clientes' ? '#fff' : '#000',
                        backgroundColor: pathname === '/clientes' ? MAIN_COLOR : ''
                    }}
                    onClick={() => navigate('/clientes')}
                >
                    Clientes
                </Typography>
                <Typography
                    sx={{
                        ...menuItemStyles,
                        paddingY: 0.5,
                        color: pathname === '/horarios' ? '#fff' : '#000',
                        backgroundColor: pathname === '/horarios' ? MAIN_COLOR : ''
                    }}
                    onClick={() => navigate('/horarios')}
                >
                    Horarios
                </Typography>
                <Typography
                    sx={{
                        ...menuItemStyles,
                        paddingY: 0.5,
                        color: pathname === '/abm' ? '#fff' : '#000',
                        backgroundColor: pathname === '/abm' ? MAIN_COLOR : ''
                    }}
                    onClick={() => navigate('/abm')}
                >
                    ABM
                </Typography>
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar sx={{ width: 32, height: 32 }}>
                        {auth?.me.first_name.charAt(0).toUpperCase()}{auth?.me.last_name.charAt(0).toUpperCase()}
                    </Avatar>
                </IconButton>
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
                <MenuItem onClick={() => navigate('/profile')}>
                    <Avatar /> Perfil
                </MenuItem>
                <MenuItem onClick={() => navigate('/license')}>
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
    )
}