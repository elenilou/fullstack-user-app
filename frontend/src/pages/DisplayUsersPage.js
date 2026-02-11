import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser } from '../services/userService';
import './DisplayUsersPage.css';

function DisplayUsersPage() {
    const navigate = useNavigate();
    
    // State
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    
    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);
    
    // Function to fetch users from API
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch users. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    // View user details in new tab
    const handleViewDetails = (userId) => {
        // Open user details in a new tab
        window.open(`/users/${userId}`, '_blank');
    };
    
    // Handle user deletion with confirmation
    const handleDelete = async (userId) => {
        try {
            await deleteUser(userId);
            // Refresh user list after deletion
            fetchUsers();
            setDeleteConfirm(null);
        } catch (err) {
            alert('Failed to delete user.');
            console.error(err);
        }
    };
    
    // Calculate age from birthdate
    const calculateAge = (birthdate) => {
        const birth = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };
    
    if (loading) {
        return (
            <div className="users-container">
                <div className="loading">Loading users...</div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="users-container">
                <div className="error-box">
                    <p>{error}</p>
                    <button onClick={fetchUsers} className="btn-retry">Retry</button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="users-container">
            <div className="users-header">
                <h1>Display Users</h1>
                <button onClick={() => navigate('/')} className="btn-back">
                    ← Back to Home
                </button>
            </div>
            
            {users.length === 0 ? (
                <div className="no-users">
                    <p>No users available.</p>
                    <button onClick={() => navigate('/register')} className="btn-primary">
                        Register First User
                    </button>
                </div>
            ) : (
                <div className="users-list">
                    {users.map((user) => (
                        <div key={user.id} className="user-card">
                            <div className="user-info">
                                <div className="user-avatar">
                                    {user.gender === 'M' ? '👨' : '👩'}
                                </div>
                                <div className="user-details">
                                    <h3>{user.name} {user.surname}</h3>
                                    <p className="user-meta">
                                        {user.gender === 'M' ? 'Male' : 'Female'} • 
                                        {calculateAge(user.birthdate)} years old
                                    </p>
                                </div>
                            </div>
                            
                            <div className="user-actions">
                                <button 
                                    onClick={() => handleViewDetails(user.id)}
                                    className="btn-view"
                                    title="View details in new tab"
                                >
                                    👁️ View Details
                                </button>
                                <button 
                                    onClick={() => setDeleteConfirm(user.id)}
                                    className="btn-delete"
                                    title="Delete user"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                            
                            {/* Confirmation Dialog */}
                            {deleteConfirm === user.id && (
                                <div className="delete-confirm">
                                    <p>Are you sure you want to delete the user <strong>{user.name} {user.surname}</strong>?</p>
                                    <div className="confirm-buttons">
                                        <button 
                                            onClick={() => setDeleteConfirm(null)}
                                            className="btn-cancel"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(user.id)}
                                            className="btn-confirm-delete"
                                        >
                                            Yes, Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DisplayUsersPage;