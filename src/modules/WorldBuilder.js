import React, { useState } from 'react';
import Modal from 'react-modal';
import firebaseExports from '../firebase'; // Adjust this path to where your firebaseExports is located
import { collection, addDoc, getDoc, doc } from "firebase/firestore";

Modal.setAppElement('#root');

const WorldbuilderDashboard = () => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [setupName, setSetupName] = useState('');
    const [setupTemplate, setSetupTemplate] = useState('');
    const [error, setError] = useState('');

    // Destructure the needed Firebase services
    const { auth, firestore } = firebaseExports;

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setError(''); // Clear errors on modal close
        setIsOpen(false);
    };

    const handleSetupNameChange = (event) => {
        setSetupName(event.target.value);
    };

    const handleSetupTemplateChange = (event) => {
        setSetupTemplate(event.target.value);
    };

    const validateInput = () => {
        if (!setupName.trim()) return "Setup name is required.";
        if (!setupTemplate) return "Setup template is required.";
        return null;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationError = validateInput();
        if (validationError) {
            setError(validationError);
            return;
        }

        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const userSetupsRef = collection(firestore, "users", userId, "setups");

            try {
                const userDocRef = doc(firestore, "users", userId);
                const userDocSnap = await getDoc(userDocRef);
                
                if (userDocSnap.exists()) {
                    const userDocData = userDocSnap.data();
                    const setupOwnerName = userDocData.username; // Assuming username is stored in the user document

                    const docRef = await addDoc(userSetupsRef, {
                        setupName,
                        setupTemplate,
                        setupDateCreation: new Date(),
                        setupDescription: "Description of what this setup is for.",
                        setupOwnerId: userId,
                        setupOwnerName,
                        setupEditors: []
                    });
                    console.log("Document written with ID: ", docRef.id);
                    closeModal();
                } else {
                    console.error("User document does not exist");
                }
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }
    };

    return (
        <div>
            <h1>Worldbuilder Dashboard</h1>
            <button onClick={openModal}>Create Setup</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={{
                    content: {
                        width: '40%',
                        height: 'auto',
                        top: '50%',
                        left: 'auto',
                        right: '0',
                        bottom: 'auto',
                        transform: 'translateY(-50%)'
                    }
                }}
            >
                <h2>New Setup</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            Setup Name:
                            <input type="text" value={setupName} onChange={handleSetupNameChange} />
                        </label>
                    </div>
                    <div>
                        <label>
                            Setup Template:
                            <select value={setupTemplate} onChange={handleSetupTemplateChange}>
                                <option value="">Select a template</option>
                                <option value="template1">Template 1</option>
                                <option value="template2">Template 2</option>
                                <option value="template3">Template 3</option>
                            </select>
                        </label>
                    </div>
                    <button type="submit">Create Setup</button>
                </form>
                <button onClick={closeModal}>Close</button>
            </Modal>
        </div>
    );
};

export default WorldbuilderDashboard;
