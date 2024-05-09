import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './userComponents/Home';
import Login from './userComponents/Login';
import Signup from './userComponents/Signup';
import Dashboard from './userComponents/Dashboard';
import SuccessPage from './userComponents/SuccessPage';
import WorldbuilderDashboard from './modules/WorldBuilder';
import Navbar from './modules/shared/Navbar';
import { AuthProvider } from './auth/AuthProvider'; // Ensure the path is correct
import ProtectedRoute from './auth/ProtectedRoute';
<source />; // Import ProtectedRoute

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/SuccessPage" element={<SuccessPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/worldbuilder" element={
            <ProtectedRoute>
              <WorldbuilderDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
