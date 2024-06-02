import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword, signInWithRedirect, GoogleAuthProvider } from '../../firebaseConfig';
import ReCAPTCHA from "react-google-recaptcha";
import ForgotPassword from './ForgetPassword';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/home'); // Redirect to home page after successful sign-in
      }
    });
    return unsubscribe;
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (!recaptchaToken) {
        setError('Please complete the reCAPTCHA verification');
        return;
      }

      const response = await axios.post('http://localhost:5000/verify-recaptcha', { token: recaptchaToken });
      if (response.data.success) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/home');
      } else {
        setError('reCAPTCHA verification failed. Please try again.');
      }
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Invalid email format.');
          break;
        case 'auth/user-disabled':
          setError('This user account has been disabled.');
          break;
        case 'auth/user-not-found':
          setError('No user found with this email.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password.');
          break;
        default:
          setError('Error logging in. Please try again.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithRedirect(auth, new GoogleAuthProvider());
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      {error && <p>{error}</p>}
      <a href="#" onClick={() => setShowForgotPassword(true)}>Forgot Password?</a>
      {showForgotPassword && <ForgotPassword onClose={() => setShowForgotPassword(false)} />}
      <ReCAPTCHA
        sitekey={process.env.SITEKEY}
        onChange={handleRecaptchaChange}
      />
      <p>Don't have an account? <a href="/register">Sign Up</a></p>
    </div>
  );
};

export default Login;
