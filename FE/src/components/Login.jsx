import {useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login ({token, setToken}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [failMessage, setFailMessage] = useState ('');
    const navigate = useNavigate();

    async function loginUser(event) {
        event.preventDefault ();
        try {
            const response = await fetch (ENDPOINT, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                })
            });
            const userAuth = await response.json();
            if (userAuth.token) {

                setToken(userAuth.token);
                alert(userAuth.message); //do we have a message for this for successful login?
                navigate('/account');
            } else {
                setFailMessage(userAuth.message); //do we have a message for a failed login?
            }
        } catch (error) {
            setError(error.message); //do we have an error message?
        }
    }

    async function registerUser(event) {
        event.preventDefault ();
        try {
            const response = await fetch ( ENDPOINT, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    name,
                })
            });
            const userAuth = await response.json();
            if (userAuth.token){
                setToken(userAuth.token);
                alert(userAuth.message); //do we have a message for this for successful login?
                navigate('/account');
            } else {
                setFailMessage(userAuth.message); //do we have a message for a failed login?
            }
        } catch (error) {
            setError(error.message); //do we have an error message?
        }
    }

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
                            value = {username}
                            required = {true}
                            onChange = {(e) => setUsername(e.target.value)}
                        />
                    </label>
                    <br/>
                    <label>
                        Password:
                        <input 
                            type = "password"
                            value = {password}
                            required = {true}
                            onChange = {(e) => setPassword(e.target.value)}
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
                            value = {username}
                            required = {true}
                            onChange = {(e)=> setUsername(e.target.value)}
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
                    {/* want to make a password confirmation section prior to setting the password */}
                    <label>
                        Password:
                        <input
                            type = "password"
                            value = {password}
                            required = {true}
                            onChange = {(e)=> setPassword(e.target.value)}
                        />
                    </label>
                    <br/>
                    <button type='submit'>Submit</button>
                </form>
            </div>
        </div>
        </>
    )
}