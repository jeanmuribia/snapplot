import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './userComponents/Home';
import Login from './userComponents/Login';
import Signup from './userComponents/Signup';
import Dashboard from './userComponents/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;