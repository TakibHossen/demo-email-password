import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile } from "firebase/auth";
import app from '../../firebase/firebase.config';
import { Link } from 'react-router-dom';

const auth = getAuth(app);

const Register = () => {
    const [error, setError] = useState('');
    // const [email, setEmail] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (event) => {
        setSuccess('');
        setError('');
        // prevent page refresh
        event.preventDefault();
        // collect from data 
        const email = event.target.email.value;
        const password = event.target.password.value;
        const name = event.target.name.value;
        console.log(name, email, password)

        // validate regular expretion---
        if(!/(?=.*[A-Z].*[A-Z])/.test(password)){
            setError('please add at least two uppercase');
            return;
        }
        else if(!/(?=.*[0-9].*[0-9])/.test(password)){
            setError('please add atleast two number');
            return;
        }
        // create user in firebase 
        createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
            const loggedUser = result.user;
            console.log(loggedUser)
            setError('');
            event.target.reset();
            setSuccess('User has created successfully')
            sendVerificationEmail(result.user);
            updateUserData(result.user, name);
        })
        .catch(error => {
            console.error(error)
            setError(error.message);
        })
    }

    const sendVerificationEmail = (user) => {
        sendEmailVerification(user)
        .then(result => {
            console.log(result)
            alert('please verify your email address')
        })
    }

    const updateUserData = (user, name) => {
        updateProfile(user, {
            displayName: name
        })
        .then( () => {
            console.log('user name updated')
        })
        .catch(error => {
            setError(error.message)
        })
    }

    const handleEmailChange = (event) =>{
        // console.log(event.target.value)
        // setEmail(event.target.value);
    }
    const handlePasswordBlur =(event) =>{

    }
    return (
        <div className='w-50 mx-auto'>
            <h2 className='text-danger'>Register</h2>
            <form onSubmit={handleSubmit}>
                <input className='w-50 mt-3'  type="text" name='name' id='name' placeholder='Your Name' required />
                <br />
                <input className='w-50 mt-3' onChange={handleEmailChange} type="email" name='email' id='email' placeholder='Your Email' required />
                <br />
                <input className='w-50 mt-3 mb-3' onBlur={handlePasswordBlur} type="Password" name='password' id='password' placeholder='Your Password' required />
                <br />
                <input className='btn btn-primary' type="submit" value="Register" />
            </form>
            <p><small>Allready have a account? Please <Link to="/login">Login</Link></small></p>
            <p className='text-danger'>{error}</p>
            <p className='text-success'>{success}</p>
        </div>
    );
};

export default Register;