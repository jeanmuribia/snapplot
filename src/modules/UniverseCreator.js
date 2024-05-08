import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import firebaseExports from "../firebase";

const UniverseCreator = ({ onUniverseCreated }) => {
    const [universeName, setUniverseName] = useState('');
    const [universeType, setUniverseType] = useState('');

    const firestore = firebaseExports.firestore;
    const auth = firebaseExports.auth;

    const createUniverse = async () => {
        if (!auth.currentUser) {
            console.error('No user logged in');
            return;
        }
        if (!universeName || !universeType) {
            console.error('Universe name and type are required');
            return;
        }
        const userId = auth.currentUser.uid;
        const newUniverseRef = await addDoc(collection(firestore, `users/${userId}/universes`), {
            name: universeName,
            type: universeType,
            created: new Date()
        });

        // Clear the input fields after creating
        setUniverseName('');
        setUniverseType('');

        // Optional: callback to notify parent component
        onUniverseCreated(newUniverseRef.id, universeName, universeType);
    };

    return (
        <div>
            <h2>Create Universe</h2>
            <label htmlFor="universeName">Universe Name:</label>
            <input
                type="text"
                id="universeName"
                value={universeName}
                onChange={(e) => setUniverseName(e.target.value)}
            />
            <label htmlFor="universeType">Universe Type:</label>
            <input
                type="text"
                id="universeType"
                value={universeType}
                onChange={(e) => setUniverseType(e.target.value)}
            />
            <button onClick={createUniverse}>Create Universe</button>
        </div>
    );
};

export default UniverseCreator;
