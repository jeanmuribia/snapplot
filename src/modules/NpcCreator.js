import React, { useState } from 'react';

const NpcCreator = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you can handle the submission of the form, for example, by sending the data to a server or updating your state
    console.log('Name:', name);
    console.log('Description:', description);
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