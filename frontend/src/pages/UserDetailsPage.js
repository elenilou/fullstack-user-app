import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById } from '../services/userService';
import './UserDetailsPage.css';

function UserDetailsPage() {
    const { id } = useParams(); // Get user ID from URL parameters
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetchUser();
    }, [id]);
    
    const fetchUser = async () => {
        try {
            setLoading(true);
            const data = await getUserById(id);
            setUser(data);
            setError(null);
        } catch (err) {
            setError('User not found');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('el-GR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    
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
            <div className="details-container">
                <div className="loading">Loading user details...</div>
            </div>
        );
    }
    
    if (error || !user) {
        return (
            <div className="details-container">
                <div className="error-box">
                    <h2>❌ User Not Found</h2>
                </div>
            </div>
        );
    }
    
    return (
        <div className="details-container">
            <div className="details-card">
                <div className="details-header">
                    <div className="user-avatar-large">
                        {user.gender === 'M' ? '👨' : '👩'}
                    </div>
                    <h1>{user.name} {user.surname}</h1>
                    <p className="user-subtitle">User Details</p>
                </div>
                
                <div className="details-body">
                    <div className="detail-row">
                        <span className="detail-label">📋 Full Name:</span>
                        <span className="detail-value">{user.name} {user.surname}</span>
                    </div>
                    
                    <div className="detail-row">
                        <span className="detail-label">⚧️ Gender:</span>
                        <span className="detail-value">
                            {user.gender === 'M' ? 'Male (M)' : 'Female (F)'}
                        </span>
                    </div>
                    
                    <div className="detail-row">
                        <span className="detail-label">🎂 Birthdate:</span>
                        <span className="detail-value">
                            {formatDate(user.birthdate)} ({calculateAge(user.birthdate)} years old)
                        </span>
                    </div>
                    
                    <div className="detail-row">
                        <span className="detail-label">🆔 User ID:</span>
                        <span className="detail-value">#{user.id}</span>
                    </div>
                    
                    {/* Addresses Section */}
                    <div className="addresses-section">
                        <h3>📍 Addresses</h3>
                        
                        {user.addresses && user.addresses.length > 0 ? (
                            <div className="addresses-list">
                                {user.addresses.map((address) => (
                                    <div key={address.id} className="address-card">
                                        <div className="address-type">
                                            {address.addressType === 'WORK' ? '🏢 Work Address' : '🏠 Home Address'}
                                        </div>
                                        <div className="address-text">
                                            {address.addressText}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-addresses">No addresses available.</p>
                        )}
                    </div>
                </div>
                
                <div className="details-footer">
                    <button onClick={() => window.close()} className="btn-close">
                        Close Tab
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserDetailsPage;