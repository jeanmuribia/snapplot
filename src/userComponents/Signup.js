import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import firebaseExports from '../firebase';
import { useLocation } from 'react-router-dom';

const Signup = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultEmail = queryParams.get('email') || '';
  const defaultPassword = queryParams.get('password') || '';

  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const handleSignup = async () => {
    try {
      
      if (!email || !password || !confirmPassword || !username || !age || !gender) {
        console.error("All fields are required");
        return;
      }// Création d'une instance d'authentification Firebase
      const { firebase, firestore } = firebaseExports;
      const auth = getAuth(firebase);

      // Vérification si les mots de passe correspondent
      if (password !== confirmPassword) {
        console.error("Passwords do not match");
        return;
      }

      // Création de l'utilisateur avec l'email et le mot de passe
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Ajout d'un document utilisateur dans Firestore avec l'ID utilisateur authentifié
      const userData = {
        userId: userCredential.user.uid,
        email: email,
        username: username,
        age: age,
        gender: gender,
        // Ajoutez d'autres champs utilisateur ici
      };

      // Ajout du document à la collection "users"
      await addDoc(collection(firestore, "users"), userData);

      // Navigation vers le tableau de bord ou toute autre action après l'inscription réussie
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
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
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default Signup;
