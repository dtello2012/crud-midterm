import React, { useState, useContext } from 'react'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './../../firebase-config'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import LockIcon from '@mui/icons-material/Lock'
import { StyledLoginWrap, StyledButtonGroupWrap, StyledIconWrap } from './index.style'
import { StyledInputWrap, StyledButtonWrap } from '../../components/utils.style'
import { useNavigate } from 'react-router-dom'
import { NotificationContext } from './../../context/NotificationContext'

const Login = ({ setIsAuth }) => {
    const navigate = useNavigate()
    const { notificationState, setNotificationState } = useContext(NotificationContext)

    const [registerEmail, setRegisterEmail] = useState('')
    const [registerPassword, setRegisterPassword] = useState('')
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [isLogin, setIsLogin] = useState(true)

    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            setIsAuth(true)
            navigate(`/dashboard/${currentUser.uid}`)
        }
    })

    const handleRegister = async () => {
        if (!registerEmail && !registerPassword) {
            showErrorMessage()
            return
        }
        try {
            await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
            setIsAuth(true)
            showToast('success', 'Registration success')
        } catch (err) {
            showToast('error', 'There was an issue with the registration, please try again later.')
        }
    }

    const handleLogin = async () => {
        if (!loginEmail || !loginPassword) {
            showErrorMessage()
            return
        }
        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            setIsAuth(true)
            showToast('success', 'Login success')
        } catch (err) {
            showToast('error', 'Your email/password is incorrect')
        }
    }

    const handleEmailChange = (e) => {
        const VALUE = e.target.value
        isLogin ? setLoginEmail(VALUE) : setRegisterEmail(VALUE)
    }
    const getEmailValue = () => (isLogin ? loginEmail : registerEmail)

    const getPasswordValue = () => (isLogin ? loginPassword : registerPassword)

    const handlePasswordChange = (e) => {
        const VALUE = e.target.value
        isLogin ? setLoginPassword(VALUE) : setRegisterPassword(VALUE)
    }

    const handleSubmit = () => (isLogin ? handleLogin() : handleRegister())

    const showToast = (type, description) => {
        setNotificationState({
            ...notificationState,
            isOpen: true,
            type,
            description
        })
    }

    const showErrorMessage = () => showToast('error', 'Email and Password are required')

    return (
        <>
            <StyledLoginWrap>
                <article className="background" role="img" aria-label="background image, balboa park"></article>
                <article>
                    <StyledIconWrap elevation={2}>
                        <LockIcon />
                    </StyledIconWrap>
                    <h1>{isLogin ? 'Login' : 'Register'}</h1>
                    <StyledButtonGroupWrap>
                        <Button
                            variant={isLogin ? 'outlined' : 'contained'}
                            onClick={() => setIsLogin(false)}
                            color={'primary'}
                        >
                            Register
                        </Button>
                        <Button
                            variant={isLogin ? 'contained' : 'outlined'}
                            onClick={() => setIsLogin(true)}
                            color={'primary'}
                        >
                            Login
                        </Button>
                    </StyledButtonGroupWrap>
                    <StyledInputWrap>
                        <TextField
                            label="Email"
                            variant="outlined"
                            value={getEmailValue()}
                            onChange={handleEmailChange}
                        />
                    </StyledInputWrap>
                    <StyledInputWrap>
                        <TextField
                            label="Password"
                            variant="outlined"
                            type="password"
                            value={getPasswordValue()}
                            onChange={handlePasswordChange}
                        />
                    </StyledInputWrap>
                    <StyledButtonWrap>
                        <Button variant="contained" onClick={handleSubmit}>
                            {isLogin ? 'Sign in' : 'Register'}
                        </Button>
                    </StyledButtonWrap>
                </article>
            </StyledLoginWrap>
        </>
    )
}

export default Login
