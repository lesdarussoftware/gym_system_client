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
import ArticleIcon from '@mui/icons-material/Article';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import { Toolbar } from '@mui/material'

import { AuthContext } from '../../providers/AuthProvider'
import { useAuth } from '../../hooks/useAuth'

import { MAIN_COLOR } from '../../config/colors'

function Options({ type }: { type: string; }) {

    const navigate = useNavigate();
    const { pathname } = useLocation()

    let menuItemStyles = {
        display: {},
        minWidth: 100,
        textAlign: 'center',
        marginLeft: 1,
        marginRight: 1,
        borderRadius: 1,
        transition: '100ms all',
        paddingY: 0.5,
        ':hover': {
            cursor: 'pointer',
            color: '#fff',
            backgroundColor: MAIN_COLOR
        }
    }

    if (type === 'desktop') menuItemStyles = {
        ...menuItemStyles,
        display: { xs: 'none', sm: 'none', md: 'block' }
    }

    return (
        <>
            <Typography
                sx={{
                    ...menuItemStyles,
                    color: pathname === '/ingresos' ? '#fff' : '#000',
                    backgroundColor: pathname === '/ingresos' ? MAIN_COLOR : ''
                }}
                onClick={() => navigate('/ingresos')}
            >
                Ingresos
            </Typography>
            <Typography
                sx={{
                    ...menuItemStyles,
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
                    color: pathname === '/abm' ? '#fff' : '#000',
                    backgroundColor: pathname === '/abm' ? MAIN_COLOR : ''
                }}
                onClick={() => navigate('/abm')}
            >
                ABM
            </Typography>
        </>
    );
}


export function Header() {

    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const { auth, setAuth } = useContext(AuthContext)

    const navigate = useNavigate()

    const { handleLogout } = useAuth()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const drawerWidth = 120;

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const mobileDrawer = (
        <Box>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'space-around',
                gap: 2,
                height: 150,
                paddingY: 2
            }}>
                <Options type='mobile' />
            </Box>
        </Box>
    );

    const desktopDrawer = (
        <Box sx={{
            height: 60,
            borderRadius: 1,
            paddingRight: 3,
            paddingLeft: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end',
            width: '100%'
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end',
                flexDirection: 'row'
            }}>
                <Options type='desktop' />
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
                    <ListItemIcon>
                        <AccountBoxIcon fontSize="small" />
                    </ListItemIcon>
                    Perfil
                </MenuItem>
                <MenuItem onClick={() => navigate('/license')}>
                    <ListItemIcon>
                        <ArticleIcon fontSize="small" />
                    </ListItemIcon>
                    Licencia
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => {
                    handleLogout()
                    setAnchorEl(null)
                    setAuth(null)
                }}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Salir
                </MenuItem>
            </Menu>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
            </Toolbar>
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {mobileDrawer}
                </Drawer>
            </Box>
            {desktopDrawer}
        </Box>
    );
}