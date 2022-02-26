import React, { useState } from 'react'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from './../../firebase-config'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import LockIcon from '@mui/icons-material/Lock';
import { StyledLoginWrap, StyledInputWrap, StyledButtonWrap, StyledButtonGroupWrap, StyledIconWrap } from './index.style'

const Login = () => {
    const [registerEmail, setRegisterEmail] = useState('')
    const [registerPassword, setRegisterPassword] = useState('')
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [user, setUser] = useState({})
    const [isLogin, setIsLogin] = useState(true);

    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser)
    })

    const handleRegister = async () => {
        try {
            await createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
            setRegisterEmail('')
            setRegisterPassword('')
        } catch (err) {
            console.log('%c [ err ]: ', 'color: #bf2c9f; background: pink; font-size: 13px;', 'err', err)
        }
    }

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
            setLoginEmail('')
            setLoginPassword('')
        } catch (err) {
            console.log('%c [ err ]: ', 'color: #bf2c9f; background: pink; font-size: 13px;', 'err', err)
        }
    }

    const logout = async () => {
        await signOut(auth)
    }

    return (
        <StyledLoginWrap>
            <article></article>
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
            
                {user && (
                    <article>
                        <button type="button" onClick={logout}>
                            Sign out
                        </button>
                    </article>
                )}
                Logged in user {user?.email}
            </article>
        </StyledLoginWrap>
    )
}

export default Login
