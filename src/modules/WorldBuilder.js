import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import firebaseExports from '../firebase'; // Adjust this path to where your firebaseExports is located
import { doc, updateDoc, deleteDoc, collection, addDoc, onSnapshot, getDoc, getDocs } from "firebase/firestore";

Modal.setAppElement('#root');

const useEditableField = (initialValue) => {
    const [value, setValue] = useState(initialValue);
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        setValue(value); // Update the value in state
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return {
        value,
        isEditing,
        setValue,
        handleEdit,
        handleSave,
        handleCancel
    };
};

const WorldbuilderDashboard = () => {
    // Define state variables
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [error, setError] = useState('');
    const [projects, setProjects] = useState([]);
    const [editorModalIsOpen, setEditorModalIsOpen] = useState(false); // State for editor modal
    const [newEditorEmail, setNewEditorEmail] = useState(''); // State for new editor email

    // Destructure the needed Firebase services
    const { auth, firestore } = firebaseExports;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Vérifiez s'il y a des données sauvegardées dans le stockage local
                const savedProjects = JSON.parse(localStorage.getItem('projects'));
                if (savedProjects) {
                    setProjects(savedProjects);
                } else {
                    const user = auth.currentUser;
                    if (user) {
                        const userId = user.uid;
                        const userSetupsRef = collection(firestore, "users", userId, "setups");
                        const querySnapshot = await getDocs(userSetupsRef);
                        const projectsData = [];
                        querySnapshot.forEach((doc) => {
                            projectsData.push({ id: doc.id, ...doc.data() });
                        });
                        setProjects(projectsData);
    
                        // Sauvegardez les données dans le stockage local
                        localStorage.setItem('projects', JSON.stringify(projectsData));
                    }
                }
            } catch (error) {
                console.error("Error fetching projects: ", error);
                setError("Error fetching projects");
            }
        };
    
        fetchData();
    }, [auth.currentUser, firestore]);

    // Function to open the create modal
    const openCreateModal = () => {
        setCreateModalIsOpen(true);
    };

    // Function to close the create modal
    const closeCreateModal = () => {
        setError('');
        setCreateModalIsOpen(false);
    };

    // Function to open the edit modal
    const openEditModal = (project) => {
        setSelectedProject(project);
        setEditModalIsOpen(true);
    };

    // Function to close the edit modal
    const closeEditModal = () => {
        setError('');
        setEditModalIsOpen(false);
    };

    // Function to open the editor modal
    const openEditorModal = () => {
        setEditorModalIsOpen(true);
    };

    // Function to close the editor modal
    const closeEditorModal = () => {
        setNewEditorEmail(''); // Reset new editor email input
        setEditorModalIsOpen(false);
    };

    // Function to save changes
    const handleSaveChanges = async () => {
        try {
            // Update the project in Firestore
            const projectRef = doc(firestore, "users", auth.currentUser.uid, "setups", selectedProject.id);
            await updateDoc(projectRef, {
                setupName: editedSetupName.value,
                setupTemplate: editedSetupTemplate.value,
                setupDescription: editedSetupDescription.value,
            });
            console.log("Document updated successfully");
            closeEditModal();
        } catch (error) {
            console.error("Error updating document: ", error);
            setError("Error updating document");
        }
    };

    // Function to duplicate the setup
    const handleDuplicateSetup = async () => {
        try {
            // Duplicate the selected project
            const newSetup = {
                setupName: `${selectedProject.setupName} - Copy`,
                setupTemplate: selectedProject.setupTemplate,
                setupDescription: selectedProject.setupDescription,
                setupOwnerName: selectedProject.setupOwnerName,
                setupOwnerId: auth.currentUser.uid,
                setupEditors: selectedProject.setupEditors,
            };
            const userSetupsRef = collection(firestore, "users", auth.currentUser.uid, "setups");
            await addDoc(userSetupsRef, newSetup);
            console.log("Document duplicated successfully");
            closeEditModal();
        } catch (error) {
            console.error("Error duplicating document: ", error);
            setError("Error duplicating document");
        }
    };

    // Function to remove the setup
    const handleRemoveSetup = async () => {
        try {
            // Delete the selected project
            const projectRef = doc(firestore, "users", auth.currentUser.uid, "setups", selectedProject.id);
            await deleteDoc(projectRef);
            console.log("Document removed successfully");
            closeEditModal();
        } catch (error) {
            console.error("Error removing document: ", error);
            setError("Error removing document");
        }
    };

    // Function to add a new editor
    const handleAddEditor = async () => {
        try {
            // Add new editor to the selected project
            const projectRef = doc(firestore, "users", auth.currentUser.uid, "setups", selectedProject.id);
            await updateDoc(projectRef, {
                setupEditors: [...selectedProject.setupEditors, newEditorEmail],
            });
            console.log("Editor added successfully");
            setNewEditorEmail('');
            closeEditorModal();
        } catch (error) {
            console.error("Error adding editor: ", error);
            setError("Error adding editor");
        }
    };

    // Function to handle changes in the new editor email input
    const handleNewEditorEmailChange = (e) => {
        setNewEditorEmail(e.target.value);
    };

    // Function to create a new setup
    const handleCreateSetup = async () => {
        try {
            // Get the current user's username
            const currentUser = auth.currentUser;
            const currentUserDocRef = doc(firestore, "users", currentUser.uid);
            const currentUserDocSnap = await getDoc(currentUserDocRef);
            const currentUserData = currentUserDocSnap.data();
            const ownerName = currentUserData.username;
    
            // Create a new setup object with the necessary fields
            const newSetup = {
                setupName: editedSetupName.value,
                setupTemplate: editedSetupTemplate.value,
                setupDescription: editedSetupDescription.value,
                setupOwnerId: currentUser.uid, // Firebase Authentication user ID of the owner
                setupOwnerName: ownerName, // Username of the owner
                setupEditors: [], // Assuming initial setup has no editors
            };
    
            // Add the new setup document to Firestore
            const userSetupsRef = collection(firestore, "users", currentUser.uid, "setups");
            await addDoc(userSetupsRef, newSetup);
            console.log("Document created successfully");
            closeCreateModal();
        } catch (error) {
            console.error("Error creating document: ", error);
            setError("Error creating document");
        }
    };

    const editedSetupName = useEditableField('');
    const editedSetupTemplate = useEditableField('');
    const editedSetupDescription = useEditableField('');

    return (
        <div>
            <h1>Worldbuilder Dashboard</h1>
            <button onClick={openCreateModal}>Create Setup</button>
            <Modal
                isOpen={createModalIsOpen}
                onRequestClose={closeCreateModal}
                style={{
                    // Style for create setup modal
                }}
            >
                <h2>Create Setup</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div>
                    <label>
                        Setup Name:
                        <input type="text" value={editedSetupName.value} onChange={(e) => editedSetupName.setValue(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Setup Template:
                        <select value={editedSetupTemplate.value} onChange={(e) => editedSetupTemplate.setValue(e.target.value)}>
                            <option value="">Select a template</option>
                            <option value="template1">Template 1</option>
                            <option value="template2">Template 2</option>
                            <option value="template3">Template 3</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Setup Description:
                        <textarea value={editedSetupDescription.value} onChange={(e) => editedSetupDescription.setValue(e.target.value)} />
                    </label>
                </div>
                <button onClick={handleCreateSetup}>Create</button>
                <button onClick={closeCreateModal}>Cancel</button>
            </Modal>
            <Modal
                isOpen={editModalIsOpen}
                onRequestClose={closeEditModal}
                style={{
                    // Style for edit modal
                }}
            >
                <h2>Edit Project</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div>
                    <label>
                        Setup Name:
                        {editedSetupName.isEditing ? (
                            <div>
                                <input type="text" value={editedSetupName.value} onChange={(e) => editedSetupName.setValue(e.target.value)} />
                                <button onClick={editedSetupName.handleSave}>Save</button>
                                <button onClick={editedSetupName.handleCancel}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                {editedSetupName.value}
                                <button onClick={editedSetupName.handleEdit}>Edit</button>
                            </div>
                        )}
                    </label>
                </div>
                <div>
                    <label>
                        Setup Template:
                        {editedSetupTemplate.isEditing ? (
                            <div>
                                <input type="text" value={editedSetupTemplate.value} onChange={(e) => editedSetupTemplate.setValue(e.target.value)} />
                                <button onClick={editedSetupTemplate.handleSave}>Save</button>
                                <button onClick={editedSetupTemplate.handleCancel}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                {editedSetupTemplate.value}
                                <button onClick={editedSetupTemplate.handleEdit}>Edit</button>
                            </div>
                        )}
                    </label>
                </div>
                <div>
                    <label>
                        Setup Description:
                        {editedSetupDescription.isEditing ? (
                            <div>
                                <textarea value={editedSetupDescription.value} onChange={(e) => editedSetupDescription.setValue(e.target.value)} />
                                <button onClick={editedSetupDescription.handleSave}>Save</button>
                                <button onClick={editedSetupDescription.handleCancel}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                {editedSetupDescription.value}
                                <button onClick={editedSetupDescription.handleEdit}>Edit</button>
                            </div>
                        )}
                    </label>
                </div>
                <button onClick={handleSaveChanges}>Save</button>
                <button onClick={closeEditModal}>Cancel</button>
                <button onClick={handleDuplicateSetup}>Duplicate</button>
                <button onClick={handleRemoveSetup}>Remove</button>
                <button onClick={openEditorModal}>Add Editor</button> {/* Button to open editor modal */}
            </Modal>
            <Modal
                isOpen={editorModalIsOpen}
                onRequestClose={closeEditorModal}
                style={{
                    // Style for editor modal
                }}
            >
                <h2>Add Editor</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div>
                    <label>
                        New Editor Email:
                        <input type="text" value={newEditorEmail} onChange={handleNewEditorEmailChange} />
                    </label>
                </div>
                <button onClick={handleAddEditor}>Add Editor</button>
                <button onClick={closeEditorModal}>Cancel</button>
            </Modal>
            <div>
                <h2>Projects</h2>
                <ul>
                    {projects.map(project => (
                        <li key={project.id} onClick={() => openEditModal(project)}>{project.setupName}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WorldbuilderDashboard;
