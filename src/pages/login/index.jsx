import React, { useState, useContext } from 'react'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from './../../firebase-config'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import LockIcon from '@mui/icons-material/Lock';
import { StyledLoginWrap, StyledInputWrap, StyledButtonWrap, StyledButtonGroupWrap, StyledIconWrap } from './index.style'
import {useNavigate} from 'react-router-dom'
import {NotificationContext} from './../../context/NotificationContext'

const Login = ({ setIsAuth }) => {
    const navigate = useNavigate()
    const {notificationState, setNotificationState} = useContext(NotificationContext)
    
    const [registerEmail, setRegisterEmail] = useState('')
    const [registerPassword, setRegisterPassword] = useState('')
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [isLogin, setIsLogin] = useState(true);

    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            setIsAuth(true)
            navigate('/dashboard')
        }
    })

    const handleRegister = async () => {
        if (!registerEmail  && !registerPassword) return
        try {
            await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
            setNotificationState({...notificationState, isOpen: true, type: 'success', description: 'Registration success'})
            setIsAuth(true)
        } catch (err) {
            // console.log('%c [ err ]: ', 'color: #bf2c9f; background: pink; font-size: 13px;', 'err', err)
            setNotificationState({...notificationState, isOpen: true, type: 'error', description: 'There was an issue with the registration, please try again later.'})
        }
    }

    const handleLogin = async () => {
        if (!loginEmail && !loginPassword) return
        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            setNotificationState({...notificationState, isOpen: true, type: 'success', description: 'Login success'})
            setIsAuth(true)
        } catch (err) {
            // console.log('%c [ err ]: ', 'color: #bf2c9f; background: pink; font-size: 13px;', 'err', err)
            setNotificationState({...notificationState, isOpen: true, type: 'error', description: 'Your email/password is incorrect'})
            
        }
    }

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
                        value={isLogin ? loginEmail: registerEmail}
                        onChange={(e) => {
                            const VALUE = e.target.value
                            isLogin ? setLoginEmail(VALUE) : setRegisterEmail(VALUE)
                            }}/>
                    </StyledInputWrap>
                    <StyledInputWrap>
                        <TextField 
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={isLogin ? loginPassword : registerPassword}
                        onChange={(e) => { 
                            const VALUE = e.target.value
                            isLogin ? setLoginPassword(VALUE) : setRegisterPassword(VALUE)
                        }}/>
                    </StyledInputWrap>
                    <StyledButtonWrap>
                        <Button 
                        variant="contained"
                        onClick={isLogin ? handleLogin : handleRegister}>
                            {isLogin ? 'Sign in' : 'Register'}
                        </Button>
                    </StyledButtonWrap>
                </article>
            </StyledLoginWrap>
        </>
    )
}

export default Login
