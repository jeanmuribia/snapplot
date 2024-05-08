import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import NpcCreator from '../modules/NpcCreator'; // Import your NpcCreator component

Modal.setAppElement('#root'); // This line is needed for accessibility reasons

const Dashboard = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });
  }, [navigate]);

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

  return (
    <div>
      <h2>Dashboard</h2>
      {/* Add your dashboard content here */}
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
    </div>
  );
};

export default Dashboard;