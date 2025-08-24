import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import Form from '../Form/Form';
import Button from '../Button/Button';
import { eye, eyeSlash } from '../../utils/Icons';

function Profile() {
    const { user, updateProfile, updatePassword, updateProfilePicture, error, setError } = useGlobalContext();
    
    const [profileData, setProfileData] = useState({
        username: '',
        name: '',
        email: ''
    });
    
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [profilePicture, setProfilePicture] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isUploadingPicture, setIsUploadingPicture] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Auto-clear success message after 5 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        if (user) {
            setProfileData({
                username: user.username || '',
                name: user.name || '',
                email: user.email || ''
            });
            setProfilePicture(user.profilePicture || '');
        }
    }, [user?._id]); // Only depend on user ID, not the entire user object

    const handleProfileChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            await updateProfile(profileData);
            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            // Error is handled by the context
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('New password must be at least 6 characters long');
            return;
        }

        try {
            await updatePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setSuccessMessage('✅ Password changed successfully! Your new password is now active.');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setIsChangingPassword(false);
        } catch (err) {
            // Check if it's an incorrect current password error
            if (err.response && err.response.data && err.response.data.message === 'Current password is incorrect') {
                setError('❌ Incorrect current password. Please try again.');
                // Reset all password fields
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
            // Other errors are handled by the context
        }
    };

    const handleProfilePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file type
        if (!file.type.startsWith('image/')) {
            setError('Please select a valid image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError('File size must be less than 5MB');
            return;
        }

        setIsUploadingPicture(true);
        setError('');
        setSuccessMessage('');

        try {
            // Convert file to base64 for storage
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const base64String = event.target.result;
                    console.log('Uploading profile picture...');
                    await updateProfilePicture({ profilePicture: base64String });
                    setSuccessMessage('✅ Profile picture updated successfully!');
                    setIsUploadingPicture(false);
                } catch (uploadError) {
                    console.error('Profile picture upload error:', uploadError);
                    setError('Failed to upload profile picture. Please try again.');
                    setIsUploadingPicture(false);
                }
            };
            reader.onerror = () => {
                setError('Failed to read the image file. Please try again.');
                setIsUploadingPicture(false);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error('File reading error:', err);
            setError('Failed to process the image file. Please try again.');
            setIsUploadingPicture(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Check if all password conditions are met
    const arePasswordConditionsMet = () => {
        return passwordData.currentPassword && 
               passwordData.newPassword && 
               passwordData.confirmPassword && 
               passwordData.newPassword === passwordData.confirmPassword && 
               passwordData.newPassword.length >= 6;
    };

    return (
        <ProfileStyled>
            <div className="profile-container">
                <h1>Profile Settings</h1>

                {/* Profile Picture Section */}
                <div className="profile-picture-section">
                    <h2>Profile Picture</h2>
                    <div className="picture-container">
                        {profilePicture ? (
                            <img src={profilePicture} alt="Profile" className="profile-picture" />
                        ) : (
                            <div className="profile-initials">
                                {getInitials(user?.name)}
                            </div>
                        )}
                        <div className="picture-upload">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePictureUpload}
                                id="profile-picture-input"
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="profile-picture-input" className="upload-button">
                                {isUploadingPicture ? 'Uploading...' : (profilePicture ? 'Change Picture' : 'Add Profile Picture')}
                            </label>
                            {profilePicture && (
                                <button 
                                    className="remove-picture-button"
                                    onClick={() => {
                                        setProfilePicture('');
                                        updateProfilePicture({ profilePicture: null });
                                        setSuccessMessage('✅ Profile picture removed successfully!');
                                    }}
                                >
                                    Remove Picture
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Information Section */}
                <div className="profile-info-section">
                    <div className="section-header">
                        <h2>Profile Information</h2>
                        <Button
                            name={isEditing ? 'Cancel' : 'Edit Profile'}
                            icon={isEditing ? '✕' : '✎'}
                            bPad={'.8rem 1.6rem'}
                            bRad={'30px'}
                            bg={isEditing ? 'var(--color-red)' : 'var(--color-accent)'}
                            color={'#fff'}
                            onClick={() => {
                                if (isEditing) {
                                    // Reset profile data to original values when canceling
                                    setProfileData({
                                        username: user?.username || '',
                                        name: user?.name || '',
                                        email: user?.email || ''
                                    });
                                }
                                setIsEditing(!isEditing);
                                setError('');
                                setSuccessMessage('');
                            }}
                        />
                    </div>

                    <div className="profile-fields">
                        {isEditing && <div className="editing-indicator">✏️ Editing mode - You can now edit your profile information</div>}
                        <div className="field-group">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Enter username"
                                value={profileData.username}
                                onChange={handleProfileChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="field-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter full name"
                                value={profileData.name}
                                onChange={handleProfileChange}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="field-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter email address"
                                value={profileData.email}
                                onChange={handleProfileChange}
                                disabled={!isEditing}
                            />
                        </div>

                        {isEditing && (
                            <div className="submit-btn">
                                <Button
                                    name="Save Changes"
                                    icon="✓"
                                    bPad={'.8rem 1.6rem'}
                                    bRad={'30px'}
                                    bg={'var(--color-green)'}
                                    color={'#fff'}
                                    onClick={handleProfileSubmit}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Messages Section */}
                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                {/* Password Change Section */}
                <div className="password-section">
                    <div className="section-header">
                        <h2>Change Password</h2>
                        <Button
                            name={isChangingPassword ? 'Cancel' : 'Change Password'}
                            icon={isChangingPassword ? '✕' : '🔒'}
                            bPad={'.8rem 1.6rem'}
                            bRad={'30px'}
                            bg={isChangingPassword ? 'var(--color-red)' : 'var(--color-accent)'}
                            color={'#fff'}
                            onClick={() => {
                                if (isChangingPassword) {
                                    // Reset password data when canceling
                                    setPasswordData({
                                        currentPassword: '',
                                        newPassword: '',
                                        confirmPassword: ''
                                    });
                                }
                                setIsChangingPassword(!isChangingPassword);
                                setError('');
                                setSuccessMessage('');
                            }}
                        />
                    </div>

                    {isChangingPassword && (
                        <div className="password-fields">
                            <div className="field-group">
                                <label>Current Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        name="currentPassword"
                                        placeholder="Enter current password"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                    />
                                    <div 
                                        className="password-toggle"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? eyeSlash : eye}
                                    </div>
                                </div>
                            </div>
                            <div className="field-group">
                                <label>New Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        name="newPassword"
                                        placeholder="Enter new password"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                    />
                                    <div 
                                        className="password-toggle"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? eyeSlash : eye}
                                    </div>
                                </div>
                                {passwordData.newPassword && (
                                    <span className={`password-length ${passwordData.newPassword.length >= 6 ? 'valid' : 'invalid'}`}>
                                        {passwordData.newPassword.length >= 6 
                                            ? '✓ Password length is valid' 
                                            : `✗ Password must be at least 6 characters (${passwordData.newPassword.length}/6)`
                                        }
                                    </span>
                                )}
                            </div>
                            <div className="field-group">
                                <label>Confirm New Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Confirm new password"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                    />
                                    <div 
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? eyeSlash : eye}
                                    </div>
                                </div>
                                {passwordData.confirmPassword && (
                                    <span className={`password-match ${passwordData.newPassword === passwordData.confirmPassword ? 'match' : 'no-match'}`}>
                                        {passwordData.newPassword === passwordData.confirmPassword 
                                            ? '✓ Passwords match' 
                                            : '✗ Passwords do not match'
                                        }
                                    </span>
                                )}
                            </div>
                            <div className="submit-btn">
                                <Button
                                    name="Update Password"
                                    icon="✓"
                                    bPad={'.8rem 1.6rem'}
                                    bRad={'30px'}
                                    bg={arePasswordConditionsMet() ? 'var(--color-green)' : 'var(--color-grey)'}
                                    color={'#fff'}
                                    onClick={handlePasswordSubmit}
                                    disabled={!arePasswordConditionsMet()}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProfileStyled>
    );
}

const ProfileStyled = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: var(--bg-color);
    padding: 2rem;

    .profile-container {
        background: var(--bg-secondary);
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 600px;

        h1 {
            text-align: center;
            color: var(--text-color);
            margin-bottom: 2rem;
            font-size: 2rem;
        }

        .error-message {
            background: var(--color-red);
            color: white;
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1rem;
            text-align: center;
        }

        .success-message {
            background: var(--color-green);
            color: white;
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1rem;
            text-align: center;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(66, 173, 0, 0.3);
            animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .profile-picture-section,
        .profile-info-section,
        .password-section {
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: var(--bg-color);
            border-radius: 15px;

            h2 {
                color: var(--text-color);
                margin-bottom: 1rem;
                font-size: 1.3rem;
            }
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }

        .picture-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;

            .profile-picture {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                object-fit: cover;
                border: 4px solid var(--color-accent);
            }

            .profile-initials {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                background: var(--color-accent);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.5rem;
                font-weight: bold;
                color: white;
                border: 4px solid var(--color-accent);
            }

            .upload-button {
                background: var(--color-accent);
                color: white;
                padding: 0.8rem 1.6rem;
                border-radius: 30px;
                cursor: pointer;
                transition: all 0.3s ease;

                &:hover {
                    background: var(--color-accent-hover);
                }
            }

            .remove-picture-button {
                background: var(--color-red);
                color: white;
                padding: 0.6rem 1.2rem;
                border: none;
                border-radius: 20px;
                cursor: pointer;
                font-size: 0.9rem;
                margin-top: 0.5rem;
                transition: all 0.3s ease;

                &:hover {
                    background: #d63031;
                }
            }
        }

        .profile-fields,
        .password-fields {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .editing-indicator {
            background: #e3f2fd;
            color: #1976d2;
            padding: 0.8rem;
            border-radius: 8px;
            text-align: center;
            font-weight: 500;
            border: 1px solid #bbdefb;
        }

        .field-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            label {
                font-weight: 600;
                color: var(--text-color);
                font-size: 0.9rem;
            }

            input {
                width: 100%;
                padding: 1rem;
                border: 2px solid var(--border-color);
                border-radius: 10px;
                background: var(--bg-secondary);
                color: var(--text-color);
                font-size: 1rem;
                transition: all 0.3s ease;

                &:focus {
                    outline: none;
                    border-color: var(--color-accent);
                }

                &:disabled {
                    background: #f5f5f5;
                    color: #999;
                    cursor: not-allowed;
                    opacity: 0.7;
                }
            }

            .password-input-container {
                position: relative;

                input {
                    padding-right: 3rem;
                }

                .password-toggle {
                    position: absolute;
                    right: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                    cursor: pointer;
                    z-index: 1;
                    transition: all 0.3s ease;

                    &:hover {
                        color: var(--color-accent);
                    }
                }
            }

            .password-match,
            .password-length {
                font-size: 0.85rem;
                font-weight: 500;
                margin-top: 0.3rem;
                padding: 0.3rem 0.5rem;
                border-radius: 5px;
                display: inline-block;
            }

            .password-match {
                &.match {
                    color: var(--color-green);
                    background: rgba(66, 173, 0, 0.1);
                }

                &.no-match {
                    color: var(--color-red);
                    background: rgba(255, 107, 107, 0.1);
                }
            }

            .password-length {
                &.valid {
                    color: var(--color-green);
                    background: rgba(66, 173, 0, 0.1);
                }

                &.invalid {
                    color: var(--color-red);
                    background: rgba(255, 107, 107, 0.1);
                }
            }
        }

        .submit-btn {
            display: flex;
            justify-content: center;
            margin-top: 1rem;
        }
    }

    @media (max-width: 768px) {
        padding: 1rem;

        .profile-container {
            padding: 1.5rem;

            .section-header {
                flex-direction: column;
                gap: 1rem;
                align-items: stretch;
            }
        }
    }
`;

export default Profile;
