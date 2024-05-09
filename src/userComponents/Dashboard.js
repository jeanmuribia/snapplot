import React, { useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Navbar from '../modules/shared/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');  // Redirects to login if no user is authenticated
      }
    });

    return () => unsubscribe();  // Clean up the subscription when the component unmounts
  }, [navigate, auth]);  // Corrected by removing the undefined variable from the dependencies

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');  // Navigates back to login on sign out
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const goToWorldbuilder = () => {
    navigate('/worldbuilder');  // Navigation function to go to the Worldbuilder Dashboard
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {auth.currentUser && (
        <>
          <button onClick={handleSignOut}>Sign Out</button>
          <button onClick={goToWorldbuilder}>Go to Worldbuilder</button>
        </>
      )}
    </div>
  );
};

export default Dashboard;
