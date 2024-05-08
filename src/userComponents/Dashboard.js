import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { collection, getDocs } from "firebase/firestore";

import NpcCreator from '../modules/NpcCreator'; 
import SceneCreator from '../modules/SceneCreator';
import UniverseCreator from '../modules/UniverseCreator';  // Import the UniverseCreator

Modal.setAppElement('#root');

const Dashboard = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [sceneModalIsOpen, setSceneModalIsOpen] = useState(false);
  const [universeModalIsOpen, setUniverseModalIsOpen] = useState(false); // State for universe creator modal
  const [universes, setUniverses] = useState([]);  // Track available universes
  const [showUniverseCreator, setShowUniverseCreator] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      } else {
        // Here you might fetch universe data
        // For now, simulate with an empty list
        setUniverses([]);  // Assuming we fetch and find no universes
        setShowUniverseCreator(universes.length === 0);
      }
    });
  }, [navigate, universes.length]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openSceneModal = () => {
    setSceneModalIsOpen(true);
  };

  const closeSceneModal = () => {
    setSceneModalIsOpen(false);
  };

  const openUniverseModal = () => { // Function to open universe creator modal
    setUniverseModalIsOpen(true);
  };

  const closeUniverseModal = () => { // Function to close universe creator modal
    setUniverseModalIsOpen(false);
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleSignOut}>Sign Out</button>
      <button onClick={openModal}>Open NpcCreator</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            width: '50%',
            height: '100%',
            position: 'absolute',
            top: '0',
            right: '0',
            bottom: '0',
            left: 'auto',
          },
        }}
      >
        <NpcCreator />
        <button onClick={closeModal}>Close</button>
      </Modal>
      <button onClick={openSceneModal}>Open SceneCreator</button> {/* Button to open Scene Creator */}
      <Modal
        isOpen={sceneModalIsOpen}
        onRequestClose={closeSceneModal}
        style={{
          content: {
            width: '50%',
            height: '100%',
            position: 'absolute',
            top: '0',
            right: '0',
            bottom: '0',
            left: 'auto',
          },
        }}
      >
        <SceneCreator />
        <button onClick={closeSceneModal}>Close</button>
      </Modal>
      <button onClick={openUniverseModal}>Create Universe</button> {/* Button to open universe creator modal */}
      <Modal
        isOpen={universeModalIsOpen}
        onRequestClose={closeUniverseModal}
        style={{
          content: {
            width: '50%',
            height: '100%',
            position: 'absolute',
            top: '0',
            right: '0',
            bottom: '0',
            left: 'auto',
          },
        }}
      >
        <UniverseCreator onUniverseCreated={(id, name, type) => {
          setUniverses([...universes, { id, name, type }]);
          setUniverseModalIsOpen(false);
        }} />
        <button onClick={closeUniverseModal}>Close</button>
      </Modal>
    </div>
  );
};

export default Dashboard;
