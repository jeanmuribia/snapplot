import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import firebaseExports from '../firebase'; // Adjust this path to where your firebaseExports is located
import { doc, updateDoc, deleteDoc, collection, addDoc, onSnapshot, getDoc } from "firebase/firestore";

Modal.setAppElement('#root');

const generateUniqueName = (name, projects) => {
    if (!name.trim()) return { valid: false, newName: '' }; // Check if name is not just empty spaces

    let newName = name;
    let counter = 1;

    // Check if the name exists and generate a new name with a counter
    while (projects.some(project => project.setupName === newName)) {
        newName = `${name}(${counter})`;
        counter++;
    }

    return { valid: true, newName };
};

const useEditableField = (initialValue, validationRule = () => true) => {
    const [value, setValue] = useState(initialValue);
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        if (!validationRule(value)) {
            console.error('Validation failed');
            return;
        }
        setValue(value ? value.trim() : ''); // Update the value in state after trimming, handle null values
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
    const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [error, setError] = useState('');
    const [projects, setProjects] = useState([]);
    const [editorModalIsOpen, setEditorModalIsOpen] = useState(false);
    const [newEditorEmail, setNewEditorEmail] = useState('');

    const { auth, firestore } = firebaseExports;

    useEffect(() => {
        if (!auth.currentUser) return;

        const userId = auth.currentUser.uid;
        const userSetupsRef = collection(firestore, "users", userId, "setups");

        const unsubscribe = onSnapshot(userSetupsRef, (querySnapshot) => {
            const projectsData = [];
            querySnapshot.forEach((doc) => {
                projectsData.push({ id: doc.id, ...doc.data() });
            });
            setProjects(projectsData);
            localStorage.setItem('projects', JSON.stringify(projectsData));
        }, (error) => {
            console.error("Error fetching projects: ", error);
            setError("Error fetching projects");
        });

        return () => unsubscribe();
    }, [auth.currentUser, firestore]);

    const openCreateModal = () => {
        setCreateModalIsOpen(true);
    };

    const closeCreateModal = () => {
        setError('');
        setCreateModalIsOpen(false);
    };

    const openEditModal = (project) => {
        setSelectedProject(project);
        setEditModalIsOpen(true);
    };

    const closeEditModal = () => {
        setError('');
        setEditModalIsOpen(false);
        setSelectedProject(null); // Reset selected project
    };

    const openEditorModal = () => {
        setEditorModalIsOpen(true);
    };

    const closeEditorModal = () => {
        setNewEditorEmail('');
        setEditorModalIsOpen(false);
    };

    const handleSaveChanges = async () => {
        try {
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

    const handleCreateSetup = async () => {
        if (!editedSetupName.value.trim()) {
            setError('Setup name cannot be empty');
            return;
        }
    
        const { valid, newName } = generateUniqueName(editedSetupName.value, projects);
        if (!valid) {
            setError('Setup name already exists');
            return;
        }
    
        try {
            // Fetch user's username from the database
            const userRef = doc(firestore, "users", auth.currentUser.uid);
            const userDoc = await getDoc(userRef);
            const username = userDoc.data().username;
    
            const newSetup = {
                setupName: newName,
                setupTemplate: editedSetupTemplate.value,
                setupDescription: editedSetupDescription.value,
                setupOwnerId: auth.currentUser.uid,
                setupOwnerName: username, // Set user's username as setupOwnerName
                setupEditors: [],
            };
            const userSetupsRef = collection(firestore, "users", auth.currentUser.uid, "setups");
            await addDoc(userSetupsRef, newSetup);
            console.log("Document created successfully");
            closeCreateModal();
        } catch (error) {
            console.error("Error creating document: ", error);
            setError("Error creating document");
        }
    };

    const handleDuplicateSetup = async () => {
        if (!selectedProject) {
            console.error('No project selected for duplication');
            return;
        }
    
        // Check if all necessary fields are present
        if (!selectedProject.setupName || !selectedProject.setupTemplate || !selectedProject.setupDescription) {
            console.error('Selected project data is incomplete');
            return;
        }
    
        const newName = selectedProject.setupName + ' (Copy)';
        console.log('New name:', newName);
    
        const { valid, uniqueName } = generateUniqueName(newName, projects);
        console.log('Valid:', valid, 'Unique name:', uniqueName);
    
        if (!valid) {
            setError('Duplicate name already exists');
            return;
        }
    
        try {
            const newSetup = {
                setupName: uniqueName,
                setupTemplate: selectedProject.setupTemplate,
                setupDescription: selectedProject.setupDescription,
                setupOwnerId: auth.currentUser.uid,
                setupOwnerName: "Current User", // Placeholder, replace with actual user name if available
                setupEditors: [],
            };
            console.log('New setup:', newSetup);
    
            const userSetupsRef = collection(firestore, "users", auth.currentUser.uid, "setups");
            await addDoc(userSetupsRef, newSetup);
            console.log("Setup duplicated successfully");
            closeEditModal();
        } catch (error) {
            console.error("Error duplicating setup: ", error);
            setError("Error duplicating setup");
        }
    };

    const handleRemoveSetup = async () => {
        if (!selectedProject) return;

        try {
            const projectRef = doc(firestore, "users", auth.currentUser.uid, "setups", selectedProject.id);
            await deleteDoc(projectRef);
            console.log("Document removed successfully");
            closeEditModal();
        } catch (error) {
            console.error("Error removing document: ", error);
            setError("Error removing document");
        }
    };

    const editedSetupName = useEditableField('', (value) => !!value); // Validation rule to prevent empty setup name
    const editedSetupTemplate = useEditableField('');
    const editedSetupDescription = useEditableField('');

    return (
        <div>
            <h1>Worldbuilder Dashboard</h1>
            <button onClick={openCreateModal}>Create Setup</button>
            <h2>Setups</h2>
            <div>
                {projects.map(project => (
                    <p key={project.id} onClick={() => openEditModal(project)} style={{ cursor: 'pointer' }}>
                        {project.setupName}
                    </p>
                ))}
            </div>
            <Modal
                isOpen={createModalIsOpen}
                onRequestClose={closeCreateModal}
                style={{ content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)' } }}
            >
                <h2>Create Setup</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div>
                    <label>Setup Name:
                        <input type="text" value={editedSetupName.value} onChange={(e) => editedSetupName.setValue(e.target.value)} />
                    </label>
                    <label>Setup Template:
                        <select value={editedSetupTemplate.value} onChange={(e) => editedSetupTemplate.setValue(e.target.value)}>
                            <option value="">Select a template</option>
                            <option value="template1">Template 1</option>
                            <option value="template2">Template 2</option>
                            <option value="template3">Template 3</option>
                        </select>
                    </label>
                    <label>Setup Description:
                        <textarea value={editedSetupDescription.value} onChange={(e) => editedSetupDescription.setValue(e.target.value)} />
                    </label>
                    <button onClick={handleCreateSetup}>Create</button>
                    <button onClick={closeCreateModal}>Cancel</button>
                </div>
            </Modal>
            <Modal
                isOpen={editModalIsOpen}
                onRequestClose={closeEditModal}
                style={{ content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)' } }}
            >
                <h2>Edit Setup</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {selectedProject && (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {editedSetupName.isEditing ? (
                                <input type="text" value={editedSetupName.value} onChange={(e) => editedSetupName.setValue(e.target.value)} onBlur={editedSetupName.handleSave} autoFocus />
                            ) : (
                                <p onClick={editedSetupName.handleEdit}>{selectedProject.setupName}</p>
                            )}
                            {editedSetupTemplate.isEditing ? (
                                <input type="text" value={editedSetupTemplate.value} onChange={(e) => editedSetupTemplate.setValue(e.target.value)} onBlur={editedSetupTemplate.handleSave} />
                            ) : (
                                <p onClick={editedSetupTemplate.handleEdit}>{selectedProject.setupTemplate}</p>
                            )}
                            {editedSetupDescription.isEditing ? (
                                <textarea value={editedSetupDescription.value} onChange={(e) => editedSetupDescription.setValue(e.target.value)} onBlur={editedSetupDescription.handleSave} />
                            ) : (
                                <p onClick={editedSetupDescription.handleEdit}>{selectedProject.setupDescription}</p>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                <button onClick={handleSaveChanges}>Save</button>
                                <div>
                                    <button onClick={handleDuplicateSetup}>Duplicate</button>
                                    <button onClick={handleRemoveSetup}>Remove</button>
                                </div>
                                <button onClick={closeEditModal}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default WorldbuilderDashboard;
