import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import app from '../../firebase/firebase.config';
import { Link } from 'react-router-dom';

const auth = getAuth(app);

const Login = () => {

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const emailRef = useRef();
    
    const handleLogin = event =>{
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        console.log(email, password)

        // Validation 
        setError('');
        setSuccess('');
        if(!/(?=.*[A-Z].*[A-Z])/.test(password)){
            setError('please add atleast two uppaercase.');
            return;
        }
        else if(!/(?=.*[!@#$&*])/.test(password)){
            setError('please add special charecter.');
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
        .then(result => {
            const loggedUser = result.user;
            setSuccess('user login succesfully');
            setError('');
        })
        .catch(error =>{
            setError(error.message);
        })
    }

    const handleResetPassword = event => {
        const email = emailRef.current.value;
        if(!email){
            alert('Please provide your email address to reset password.')
            return;
        }
        sendPasswordResetEmail(auth, email)
        .then( () => {
            alert('Please check your email')
        })
        .catch( error => {
            console.log(error)
            setError(error.message)
        })
    }
    return (
        <div className='w-25 mx-auto'>
            <h2 className='text-center text-warning'>Please Login</h2>
            <Form onSubmit={handleLogin} >
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name='email' ref={emailRef} placeholder="Enter email" required/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name='password' placeholder="Password" required/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            <p><small>Forget password? Please <button onClick={handleResetPassword} className='btn btn-link'>Reset Password</button></small></p>
            <p><small>New to this website? Please <Link to="/register">Register</Link></small></p>
            <p className='text-danger'>{error}</p>
            <p className='text-success'>{success}</p>
        </div>
    );
};

export default Login;