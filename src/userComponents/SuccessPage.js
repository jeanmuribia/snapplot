import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
  return (
    <div>
      <h2>Sign in successful!</h2>
      <p>You can now log in and start writing stories.</p>
      <Link to="/login">Go to Login</Link>
    </div>
  );
};

export default SuccessPage;
