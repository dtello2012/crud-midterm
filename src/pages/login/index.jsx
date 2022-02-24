
import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from './../../firebase-config';

const Login = () => {
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [user, setUser] = useState({});
  
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  
    const register = async () => {
      try {
        const user = await createUserWithEmailAndPassword(
          auth,
          registerEmail,
          registerPassword
        );
        setRegisterEmail('')
        setRegisterPassword('')
        console.log(
          '%c [ user ]-14',
          'font-size:13px; background:pink; color:#bf2c9f;',
          user
        );
      } catch (err) {
        console.log(
          '%c [ err ]: ',
          'color: #bf2c9f; background: pink; font-size: 13px;',
          'err',
          err
        );
      }
    };
  
    const login = async () => {
      try {
        const user = await signInWithEmailAndPassword(
          auth,
          loginEmail,
          loginPassword
        );
        setLoginEmail('')
        setLoginPassword('')
        console.log(
          '%c [ user ]-14',
          'font-size:13px; background:pink; color:#bf2c9f;',
          user
        );
      } catch (err) {
        console.log(
          '%c [ err ]: ',
          'color: #bf2c9f; background: pink; font-size: 13px;',
          'err',
          err
        );
      }
    };
  
    const logout = async () => {
      await signOut(auth);
    };
  
    return (
      <article className="App">
        <form>
          <article>
            <h1>register</h1>
            <input
              type="text"
              placeholder="Email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
          </article>
          <article>
            <input
              type="password"
              placeholder="Password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
          </article>
          <button type="button" onClick={register}>
            Register
          </button>
        </form>
        <form>
          <article>
            <h1>Login</h1>
            <input
              type="text"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </article>
          <article>
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </article>
          <button type="button" onClick={login}>
            Sign in
          </button>
        </form>
        Logged in user {user?.email}
        <article>
          <button type="button" onClick={logout}>
            Sign out
          </button>
        </article>
      </article>
    );
}

export default Login;
