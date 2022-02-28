import { useState, useEffect, createContext, useMemo } from 'react'
import { signOut } from 'firebase/auth'
import './App.css'
import Login from './pages/login'
import Create from './pages/create'
import Home from './pages/home'
import { auth } from './firebase-config'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Notification from './components/Notification'
import useNotification from './hooks/useNotification'
import { NotificationContext } from './context/NotificationContext'
// export const NotificationContext = createContext('notification')

function Root() {
    const navigate = useNavigate()
    const { notificationState, setNotificationState } = useNotification()
    const [isAuth, setIsAuth] = useState(false)
    const logout = async (e) => {
        e.preventDefault()
        await signOut(auth)
        setIsAuth(false)
        setNotificationState({ ...notificationState, isOpen: true, type: 'success', description: 'Logout success' })
        navigate('/')
    }

    useEffect(() => {
        navigate('/')
    }, [])

    return (
        <article>
            {isAuth && (
                <nav>
                    <Link to="/dashboard">Home</Link>
                    <Link to="/create">Create</Link>
                    <a href="#" onClick={logout}>
                        Log out
                    </a>
                </nav>
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
                            <Route path="/dashboard" element={<Home />} />
                            <Route path="/create" element={<Create />} />
                        </>
                    )}
                    <Route path="/" element={<Login setIsAuth={setIsAuth} />} />
                </Routes>
                <Notification />
            </NotificationContext.Provider>
        </article>
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
