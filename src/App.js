import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Campaign from './components/Campaign';
import Navbar from './components/Navbar';
import ScheduledTasks from './components/ScheduledTasks';
import Offer from './components/Offer';
import './styles/variables.css';
import './styles/layout.css';
import './styles/auth.css';

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route
          path="/campaigns"
          element={
            <PrivateRoute>
              <Layout>
                <Campaign />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/scheduled-tasks"
          element={
            <PrivateRoute>
              <Layout>
                <ScheduledTasks />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/offer/:campaignId"
          element={
            <PrivateRoute>
              <Layout>
                <Offer />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
