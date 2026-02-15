import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getUserById, updateUser, addAddress, updateAddress, deleteAddress } from '../services/userService';
import './UserDetailsPage.css';

function UserDetailsPage() {
    const { id } = useParams(); // Get user ID from URL parameters
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [newAddressData, setNewAddressData] = useState({ addressType: 'HOME', addressText: '' });
    
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
        // Parse ISO date string (YYYY-MM-DD) without timezone conversion
        const [year, month, day] = dateString.split('T')[0].split('-');
        const date = new Date(year, parseInt(month) - 1, day);
        return date.toLocaleDateString('el-GR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    
    const calculateAge = (birthdate) => {
        // Parse ISO date string (YYYY-MM-DD) without timezone conversion
        const [year, month, day] = birthdate.split('T')[0].split('-');
        const birth = new Date(year, parseInt(month) - 1, day);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const handleEditClick = () => {
        setEditFormData({
            name: user.name,
            surname: user.surname,
            gender: user.gender,
            birthdate: new Date(user.birthdate)
        });
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    const handleDateChange = (date) => {
        setEditFormData({
            ...editFormData,
            birthdate: date
        });
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            
            // Convert birthdate to ISO string format in local timezone
            let birthdateString = null;
            if (editFormData.birthdate) {
                const year = editFormData.birthdate.getFullYear();
                const month = String(editFormData.birthdate.getMonth() + 1).padStart(2, '0');
                const day = String(editFormData.birthdate.getDate()).padStart(2, '0');
                birthdateString = `${year}-${month}-${day}`;
            }

            const dataToUpdate = {
                name: editFormData.name,
                surname: editFormData.surname,
                gender: editFormData.gender,
                birthdate: birthdateString
            };

            await updateUser(id, dataToUpdate);
            
            // Update local state
            setUser({
                ...user,
                ...dataToUpdate,
                birthdate: birthdateString
            });
            
            setIsEditing(false);
            alert('User updated successfully!');
        } catch (err) {
            console.error('Error updating user:', err);
            alert('Failed to update user. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditFormData({});
        setEditingAddressId(null);
        setNewAddressData({ addressType: 'HOME', addressText: '' });
    };

    const handleAddAddress = async () => {
        if (!newAddressData.addressText.trim()) {
            alert('Please enter an address');
            return;
        }

        try {
            setIsSaving(true);
            await addAddress(id, newAddressData);
            
            // Refresh user data
            const updatedUser = await getUserById(id);
            setUser(updatedUser);
            setNewAddressData({ addressType: 'HOME', addressText: '' });
            alert('Address added successfully!');
        } catch (err) {
            console.error('Error adding address:', err);
            alert('Failed to add address. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                setIsSaving(true);
                await deleteAddress(id, addressId);
                
                // Refresh user data
                const updatedUser = await getUserById(id);
                setUser(updatedUser);
                alert('Address deleted successfully!');
            } catch (err) {
                console.error('Error deleting address:', err);
                alert('Failed to delete address. Please try again.');
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleUpdateAddress = async (addressId) => {
        const address = user.addresses.find(a => a.id === addressId);
        if (!address.addressText.trim()) {
            alert('Please enter an address');
            return;
        }

        try {
            setIsSaving(true);
            await updateAddress(id, addressId, {
                addressType: address.addressType,
                addressText: address.addressText
            });
            
            // Refresh user data
            const updatedUser = await getUserById(id);
            setUser(updatedUser);
            setEditingAddressId(null);
            alert('Address updated successfully!');
        } catch (err) {
            console.error('Error updating address:', err);
            alert('Failed to update address. Please try again.');
        } finally {
            setIsSaving(false);
        }
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
                    <button onClick={handleEditClick} className="btn-edit">
                        ✏️ Edit
                    </button>
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

                {/* Edit Modal */}
                {isEditing && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>Edit User Details</h2>
                                <button onClick={handleCancel} className="modal-close">&times;</button>
                            </div>

                            <div className="modal-body">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editFormData.name || ''}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        name="surname"
                                        value={editFormData.surname || ''}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Gender</label>
                                    <select
                                        name="gender"
                                        value={editFormData.gender || ''}
                                        onChange={handleInputChange}
                                        className="form-select"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="M">Male (M)</option>
                                        <option value="F">Female (F)</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Birthdate</label>
                                    <DatePicker
                                        selected={editFormData.birthdate}
                                        onChange={handleDateChange}
                                        dateFormat="dd/MM/yyyy"
                                        className="form-input"
                                        placeholderText="Select a date"
                                    />
                                </div>

                                {/* Addresses Section */}
                                <div className="addresses-edit-section">
                                    <h3>📍 Manage Addresses</h3>
                                    
                                    {/* Existing Addresses */}
                                    {user.addresses && user.addresses.length > 0 && (
                                        <div className="existing-addresses">
                                            {user.addresses.map((address) => (
                                                <div key={address.id} className="address-edit-item">
                                                    {editingAddressId === address.id ? (
                                                        <div className="address-edit-form">
                                                            <div className="form-group">
                                                                <label>Address Type</label>
                                                                <select
                                                                    value={address.addressType}
                                                                    onChange={(e) => {
                                                                        const updated = user.addresses.map(a => 
                                                                            a.id === address.id ? {...a, addressType: e.target.value} : a
                                                                        );
                                                                        setUser({...user, addresses: updated});
                                                                    }}
                                                                    className="form-select"
                                                                >
                                                                    <option value="HOME">Home</option>
                                                                    <option value="WORK">Work</option>
                                                                </select>
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Address</label>
                                                                <textarea
                                                                    value={address.addressText}
                                                                    onChange={(e) => {
                                                                        const updated = user.addresses.map(a => 
                                                                            a.id === address.id ? {...a, addressText: e.target.value} : a
                                                                        );
                                                                        setUser({...user, addresses: updated});
                                                                    }}
                                                                    className="form-textarea"
                                                                    rows="3"
                                                                />
                                                            </div>
                                                            <div className="address-actions">
                                                                <button 
                                                                    onClick={() => handleUpdateAddress(address.id)}
                                                                    className="btn-small btn-save"
                                                                    disabled={isSaving}
                                                                >
                                                                    Save
                                                                </button>
                                                                <button 
                                                                    onClick={() => setEditingAddressId(null)}
                                                                    className="btn-small btn-cancel"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="address-display">
                                                            <div className="address-info">
                                                                <span className="address-type">
                                                                    {address.addressType === 'WORK' ? '🏢' : '🏠'} {address.addressType}
                                                                </span>
                                                                <span className="address-text">{address.addressText}</span>
                                                            </div>
                                                            <div className="address-buttons">
                                                                <button 
                                                                    onClick={() => setEditingAddressId(address.id)}
                                                                    className="btn-small btn-edit-addr"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteAddress(address.id)}
                                                                    className="btn-small btn-delete-addr"
                                                                    disabled={isSaving}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add New Address */}
                                    <div className="add-address-form">
                                        <h4>Add New Address</h4>
                                        <div className="form-group">
                                            <label>Address Type</label>
                                            <select
                                                value={newAddressData.addressType}
                                                onChange={(e) => setNewAddressData({...newAddressData, addressType: e.target.value})}
                                                className="form-select"
                                            >
                                                <option value="HOME">Home</option>
                                                <option value="WORK">Work</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Address</label>
                                            <textarea
                                                value={newAddressData.addressText}
                                                onChange={(e) => setNewAddressData({...newAddressData, addressText: e.target.value})}
                                                className="form-textarea"
                                                rows="3"
                                                placeholder="Enter address details..."
                                            />
                                        </div>
                                        <button 
                                            onClick={handleAddAddress}
                                            className="btn-small btn-add-addr"
                                            disabled={isSaving}
                                        >
                                            + Add Address
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button onClick={handleCancel} className="btn-cancel">
                                    Cancel
                                </button>
                                <button onClick={handleSave} className="btn-save" disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserDetailsPage;