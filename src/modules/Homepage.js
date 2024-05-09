import React from 'react';
import Login from '../userComponents/Login';

const Homepage = () => {
    return (
        <div>
            <h1>Welcome to the Homepage!</h1>
            <Login />
            <button onClick={() => window.location.href = '/signup'}>Sign Up</button>
            {/* Add your other content here */}
        </div>
    );
};

export default Homepage;