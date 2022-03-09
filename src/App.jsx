import { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import './App.css'
import Login from './pages/login'
import Create from './pages/create'
import Home from './pages/home'
import { auth } from './firebase-config'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Notification from './components/Notification'
import useNotification from './hooks/useNotification'
import { NotificationContext } from './context/NotificationContext'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import Navbar from './components/Navbar'

const theme = createTheme({
    palette: {
        primary: {
            main: '#005b8b'
        },
        secondary: {
            main: '#dac828'
        }
    }
})


const Root = () => {
    const navigate = useNavigate()
    const { notificationState, setNotificationState } = useNotification()
    const [isAuth, setIsAuth] = useState(false)
 
    useEffect(() => {
        navigate('/')
    }, [])

    const handleLogout = async (e) => {
        e.preventDefault()
        await signOut(auth)
        setIsAuth(false)
        setNotificationState({ ...notificationState, isOpen: true, type: 'success', description: 'Logout success' })
        navigate('/')
    }

    return (
        <ThemeProvider theme={theme}>
            <StyledThemeProvider theme={theme}>
                {isAuth && (
                    <Navbar onLogout={handleLogout} />
                )}
                <NotificationContext.Provider
                    value={{
                        notificationState,
                        setNotificationState
                    }}
                >
                    <Routes>
                        {isAuth && (
                            <>
                                <Route path="/dashboard" element={<Home isAuth={isAuth} />} />
                                <Route path="/create-issue" element={<Create />} />
                            </>
                        )}
                        <Route path="/" element={<Login setIsAuth={setIsAuth} />} />
                    </Routes>
                    <Notification />
                </NotificationContext.Provider>
            </StyledThemeProvider>
        </ThemeProvider>
    )
}

function App() {
    return (
        <Router>
            <Root />
        </Router>
    )
}

export default App
