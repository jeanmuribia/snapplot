import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();


  const handleSignup = async () => {
    try {
      if (!email || !password || !confirmPassword || !username || !age || !gender) {
        console.error("All fields are required");
        return;
      }

      const { firebase, firestore } = firebaseExports;
      const auth = getAuth(firebase);

      // Create a new user account with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Get the UID from the user credential
      const userId = userCredential.user.uid;

      const usernameLowerCase = username.toLowerCase();

      // Add user data to Firestore
      const userData = {
        userId: userId,
        email: email,
        username: username,
        usernameLowerCase: usernameLowerCase,
        age: age,
        gender: gender,
        // Add other user data fields here
      };
      await addDoc(collection(firestore, "users"), userData);
      

      // Navigate to the dashboard or other appropriate page after successful signup
      navigate('/SuccessPage');
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
