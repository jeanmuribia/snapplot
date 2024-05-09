import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './userComponents/Home';
import Login from './userComponents/Login';
import Signup from './userComponents/Signup';
import Dashboard from './userComponents/Dashboard';
import SuccessPage from './userComponents/SuccessPage'; 

import WorldbuilderDashboard from './modules/WorldBuilder'; 
import Navbar from './modules/shared/Navbar';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/SuccessPage" element={<SuccessPage />} />
        <Route path="/worldbuilder" element={<WorldbuilderDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;