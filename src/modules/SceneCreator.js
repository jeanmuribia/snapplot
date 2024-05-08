import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc } from "firebase/firestore";
import firebaseExports from "../firebase";

const SceneCreator = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCharacter, setSelectedCharacter] = useState('');
    const [universes, setUniverses] = useState([]);
    const [selectedUniverse, setSelectedUniverse] = useState('');

    const firestore = firebaseExports.firestore;
    const auth = firebaseExports.auth;

    useEffect(() => {
        const fetchUniverses = async () => {
            if (!auth.currentUser) {
                console.error('No user logged in');
                return;
            }
            const userId = auth.currentUser.uid;
            const querySnapshot = await getDocs(collection(firestore, `users/${userId}/universes`));
            const loadedUniverses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUniverses(loadedUniverses);

            // Automatically select the first universe if available
            if (loadedUniverses.length > 0) {
                setSelectedUniverse(loadedUniverses[0].id);
            }
        };

        fetchUniverses();
    }, []);

    const handleUniverseChange = (event) => {
        setSelectedUniverse(event.target.value);
    };

    const createUniverse = async () => {
        if (!auth.currentUser) {
            console.error('No user logged in');
            return;
        }
        const userId = auth.currentUser.uid;
        const newUniverseRef = await addDoc(collection(firestore, `users/${userId}/universes`), {
            name: 'New Universe', // Placeholder name, adjust as necessary
            created: new Date()
        });
        setUniverses([...universes, { id: newUniverseRef.id, name: 'New Universe' }]);
        setSelectedUniverse(newUniverseRef.id);
    };

    const saveScene = async () => {
        if (!selectedUniverse) {
            console.error('No universe selected');
            return;
        }
        const userId = auth.currentUser.uid;
        const scenesRef = collection(firestore, `users/${userId}/universes/${selectedUniverse}/scenes`);

        const sceneData = {
            title,
            description,
            characters: selectedCharacter ? [selectedCharacter] : [],
        };

        try {
            await addDoc(scenesRef, sceneData);
            console.log('Scene created successfully!');
        } catch (error) {
            console.error('Error creating scene:', error);
        }
    };

    return (
        <div>
            <h2>Scene Creator</h2>
            <select value={selectedUniverse} onChange={handleUniverseChange}>
                {universes.map((universe) => (
                    <option key={universe.id} value={universe.id}>{universe.name}</option>
                ))}
            </select>
            <button onClick={createUniverse}>Create New Universe</button>

            {/* The rest of your component */}
        </div>
    );
};

export default SceneCreator;
