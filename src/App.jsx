import { useState, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import './App.css'
import Login from './pages/login'
import Create from './pages/create'
import Home from './pages/home'
import { getDocs, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db, auth } from './firebase-config'

import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Notification from './components/Notification'
import useNotification from './hooks/useNotification'
import { IssuesCollectionContext } from './context/IssuesCollectionContext'
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
    const [notificationState, setNotificationState] = useNotification()
    const [isAuth, setIsAuth] = useState(false)
    const issuesCollectionRef = collection(db, 'issues')
    const [issuesList, setIssuesList] = useState([])

    const handleLogout = async (e) => {
        e.preventDefault()
        await signOut(auth)
        setIsAuth(false)
        setNotificationState({ ...notificationState, isOpen: true, type: 'success', description: 'Logout success' })
        navigate('/')
    }

    async function getListOfIssues() {
        const data = await getDocs(issuesCollectionRef)
        setIssuesList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }

    return (
        <ThemeProvider theme={theme}>
            <StyledThemeProvider theme={theme}>
                {isAuth && <Navbar onLogout={handleLogout} />}
                <NotificationContext.Provider
                    value={{
                        notificationState,
                        setNotificationState
                    }}
                >
                    <IssuesCollectionContext.Provider value={{ issuesList, getListOfIssues }}>
                        <Routes>
                            <Route path="/dashboard/team-issues" element={<Home isAuth={isAuth} />} />
                            <Route path="/dashboard/:userId" element={<Home isAuth={isAuth} />} />
                            <Route path="/dashboard" element={<Home isAuth={isAuth} />} />
                            <Route path="/edit-issues/:issueId" element={<Create isAuth={isAuth} isEdit />} />
                            <Route path="/create-issue" element={<Create isAuth={isAuth} />} />
                            <Route path="/" element={<Login setIsAuth={setIsAuth} />} />
                            <Route render={() => <Navigate replace to="/" />} />
                            <Route
                                path="*"
                                element={
                                    <main style={{ padding: '1rem' }}>
                                        <p>There's nothing here!</p>
                                    </main>
                                }
                            />
                        </Routes>
                        <Notification />
                    </IssuesCollectionContext.Provider>
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
