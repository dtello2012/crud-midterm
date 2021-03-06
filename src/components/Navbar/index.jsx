import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import { StyledNavbar } from './index.style'
import { auth } from './../../firebase-config'

export const LOGO = require('./../../images/main_logo.png')

const Navbar = ({ isAuth, onLogout }) => {
    return (
        <StyledNavbar position="sticky">
            <Container style={{ maxWidth: 1740 }}>
                <Toolbar disableGutters>
                    <Link to={`/dashboard/${auth?.currentUser?.uid}`}>
                        <img style={{ width: 85 }} src={LOGO} alt="" />
                    </Link>
                    {isAuth && (
                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', justifyContent: 'flex-end' } }}>
                            <Button key={'page-1'}>
                                <Link to={`/dashboard/${auth?.currentUser?.uid}`}>
                                    <Typography textAlign="center">{'Issues'}</Typography>
                                </Link>
                            </Button>
                            <Button key={'page-2'}>
                                <Link to="/create-issue">
                                    <Typography textAlign="center">{'Create'}</Typography>
                                </Link>
                            </Button>
                            <Button key={'page-3'}>
                                <Link to="/#" onClick={onLogout}>
                                    <Typography textAlign="center">{'Logout'}</Typography>
                                </Link>
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </StyledNavbar>
    )
}

export default Navbar
