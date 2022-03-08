import { useState, useEffect } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import { signOut } from 'firebase/auth'
import { auth } from './../../firebase-config'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import useNotification from './../../hooks/useNotification'
import { StyledNavbar } from './index.style'

const logo = require('./../../images/main_logo.png')

const Navbar = ({onLogout}) => {
    const navigate = useNavigate()
    const { notificationState, setNotificationState } = useNotification()

    const logout = async (e) => {
        e.preventDefault()
        await signOut(auth)
        // setIsAuth(false)
        setNotificationState({ ...notificationState, isOpen: true, type: 'success', description: 'Logout success' })
        navigate('/')
    }

    const handleCloseNavMenu = () => {
        // setAnchorElNav(null)
    }

    return (
        <StyledNavbar position="sticky">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <img
                    style={{width: 85}}
                    src={logo}
                    alt={'main logo'}/>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', justifyContent: 'flex-end' } }}>
                        <Button key={'page-1'} onClick={handleCloseNavMenu}>
                            <Link to="/dashboard">
                                <Typography textAlign="center">{'Home'}</Typography>
                            </Link>
                        </Button>
                        <Button key={'page-2'} onClick={handleCloseNavMenu}>
                            <Link to="/create">
                                <Typography textAlign="center">{'Create'}</Typography>
                            </Link>
                        </Button>
                        <Button key={'page-3'} onClick={handleCloseNavMenu}>
                            <Link to="/#" onClick={onLogout}>
                                <Typography textAlign="center">{'Logout'}</Typography>
                            </Link>
                        </Button>
                    </Box>

                </Toolbar>
            </Container>
        </StyledNavbar>
    )
}

export default Navbar
