import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, updateProfile, sendEmailVerification } from "firebase/auth";
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const [recaptchaToken, setRecaptchaToken] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    console.log('Starting registration process');

    if (!validateEmail(email)) {
      setError('Invalid email address.');
      console.error('Invalid email address:', email);
      return;
    }

    try {
      console.log('Checking sign-in methods for email:', email);
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        setError('Email is already in use.');
        console.error('Email is already in use:', email);
        return;
      }
    } catch (error) {
      setError('Failed to check email.');
      console.error('Error checking email:', error);
      return;
    }

    try {
      if (!recaptchaToken) {
        setError('Please complete the reCAPTCHA verification');
        return;
      }

      const response = await axios.post('http://localhost:5000/verify-recaptcha', { token: recaptchaToken });
      if (response.data.success) {
      console.log('Creating user with email and password');
      const UserDetail=await createUserWithEmailAndPassword(auth, email, password);
      const user=UserDetail.user
      await updateProfile(user, { displayName: username });
      navigate('/home'); // Redirect to verify email page
      }
    } catch (error) {
      setError(error.message);
      console.error('Error registering user:', error);
    }
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };
  
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Register</button>
      </form>
      <ReCAPTCHA
        sitekey='6Lc-JO4pAAAAAPbCC5jn3X-AuRMJcTMrw7QTgZki'
        onChange={handleRecaptchaChange}
      />
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
      <Link to="/" style={{ display: 'inline-block', marginTop: '10px', textDecoration: 'none', color: 'blue' }}>Already have an account?</Link>
    </div>
  );
};

export default Register;
