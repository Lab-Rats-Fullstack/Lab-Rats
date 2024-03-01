import {useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:3000/api/';

export default function Login ({token, setToken}) {
    const [email, setEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [loginUsername, setLoginUsername] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [failMessage, setFailMessage] = useState ('');
    const navigate = useNavigate();
    const [confirmPassword, setConfirmPassword] = useState('');
    const [buttonStatus, setButtonStatus] = useState(true);

    async function loginUser(event) {
        event.preventDefault ();
        try {
            const response = await fetch (`${API}users/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: loginUsername,
                    password: loginPassword,
                })
            });
            const userAuth = await response.json();
            if (userAuth.token) {
                console.log(userAuth.token);
                setToken(userAuth.token);
                alert(userAuth.message);
                navigate('/account');
            } else {
                setFailMessage(userAuth.message);
            }
        } catch (error) {
            setError(error.message);
        }
    }

    async function registerUser(event) {
        event.preventDefault ();
        try {
            const response = await fetch ( `${API}users/register`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: registerUsername,
                    email,
                    password: registerPassword,
                    name,
                })
            });
            const userAuth = await response.json();
            if (userAuth.token){
                setToken(userAuth.token);
                alert(userAuth.message);
                navigate('/account');
            } else {
                setFailMessage(userAuth.message);
            }
        } catch (error) {
            setError(error.message);
        }
    }

    useEffect(() => {
        async function enableButton () {
            try {
                if (registerPassword == confirmPassword) {
                    setButtonStatus(false);
                } else {
                    setButtonStatus(true);
                }
            } catch(error) {
                console.log(error);
            }
        }enableButton();
    }, [registerPassword, confirmPassword]);

    return (
        <><p>This is the Login and Registration page</p> 
        <div className = 'wrapper'>
            <div className = 'login'>
                <h2>Sign In</h2>
                {failMessage && <p>{failMessage}</p>}
                {error && <p>{error}</p>}
                <form onSubmit={loginUser}>
                    <label>
                        Username:
                        <input 
                            value = {loginUsername}
                            required = {true}
                            onChange = {(e) => setLoginUsername(e.target.value)}
                        />
                    </label>
                    <br/>
                    <label>
                        Password:
                        <input 
                            type = "password"
                            value = {loginPassword}
                            required = {true}
                            onChange = {(e) => setLoginPassword(e.target.value)}
                        />
                    </label>
                    <br/>            
                    <button type='submit'>Submit</button>
                </form>
            </div>
            <div className = 'register'>
                <h2>New User Registration</h2>
                {failMessage && <p>{failMessage}</p>}
                {error && <p>{error}</p>}
                <form onSubmit = {registerUser}>
                    <label>
                        Username:
                        <input
                            value = {registerUsername}
                            required = {true}
                            onChange = {(e)=> setRegisterUsername(e.target.value)}
                        />
                    </label>
                    <br/>
                    <label>
                        Email:
                        <input
                            value = {email}
                            required = {true}
                            onChange = {(e)=> setEmail(e.target.value)}
                        />
                    </label>
                    <br/>
                    <label>
                        Name:
                        <input
                            value = {name}
                            required = {true}
                            onChange = {(e)=> setName(e.target.value)}
                        />
                    </label>
                    <br/>
                    <label>
                        Password:
                        <input
                            type = "password"
                            value = {registerPassword}
                            required = {true}
                            onChange = {(e)=> setRegisterPassword(e.target.value)}
                        />
                    </label>
                    <br/>
                    <label>
                         Confirm Password:
                        <input
                            type = "password"
                            value = {confirmPassword}
                            required = {true}
                            onChange = {(e)=> setConfirmPassword(e.target.value)}
                        />
                    </label>
                    {buttonStatus == true && <p>Passwords must match</p>}
                    <br/>
                    <button type='submit' disabled = {buttonStatus} >Submit</button>
                </form>
            </div>
        </div>
        </>
    )
}
