import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import firebaseExports from '../firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { firebase } = firebaseExports;

  const handleLogin = async () => {
    try {
      const auth = getAuth(firebase);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Navigate to the dashboard upon successful login
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  const handleSignup = () => {
    // Vérifier si l'e-mail et le mot de passe sont valides
    if (!validateEmail(email)) {
      console.error('Invalid email address');
      return;
    }

    if (password.length < 6) {
      console.error('Password must be at least 6 characters long');
      return;
    }

    // Si les informations sont valides, naviguer vers la page de sign up
    navigate(`/signup?email=${email}&password=${password}`);
  };

  // Fonction pour valider l'e-mail
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {/* Lien vers la page de sign up avec gestion de la navigation conditionnelle */}
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default Login;
