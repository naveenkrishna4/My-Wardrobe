import React, { useState } from 'react';
import { auth, provider } from '../firebaseConfig';
import { Navigate } from 'react-router-dom';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await auth.signInWithPopup(provider);
      setRedirectToHome(true); // Redirect to '/home' after successful login
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await auth.signInWithEmailAndPassword(email, password);
      setRedirectToHome(true); // Redirect to '/home' after successful login
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await auth.createUserWithEmailAndPassword(email, password);
      setRedirectToHome(true); // Redirect to '/home' after successful registration
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (redirectToHome) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleGoogleSignIn} disabled={loading}>Sign in with Google</button>
      <form onSubmit={handleEmailSignIn}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading}>Login</button>
      </form>
      <h2>Register</h2>
      <form onSubmit={handleRegistration}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading}>Register</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Auth;
