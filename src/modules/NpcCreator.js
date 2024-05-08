import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import firebaseExports from "../firebase"; // I

const NpcCreator = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const userId = firebaseExports.auth.currentUser ? firebaseExports.auth.currentUser.uid : null;
      console.log("Current User ID:", userId);

    if (!userId) {
      console.error("No user is logged in or the user ID could not be retrieved.");
     return;
      }
      const npcRef = collection(firebaseExports.firestore, `users/${userId}/npcs`); // Chemin de la sous-collection spécifique à l'utilisateur
      await addDoc(npcRef, {
        name: name,
        description: description
      });
  
      // Reset the name and description fields after adding the NPC
      setName('');
      setDescription('');
      
      console.log('NPC created successfully!');
    } catch (error) {
      console.error('Error creating NPC:', error.message);
    }
  };

  return (
    <div>
      <h1>Créateur de Personnage!</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <button type="submit">Create Character</button>
      </form>
    </div>
  );
};

export default NpcCreator;