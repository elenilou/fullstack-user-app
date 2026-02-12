import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import DisplayUsersPage from './pages/DisplayUsersPage';
import UserDetailsPage from './pages/UserDetailsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/users" element={<DisplayUsersPage />} />
          <Route path="/users/:id" element={<UserDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;