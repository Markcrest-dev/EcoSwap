import { useState } from 'react';

function UserProfile({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    phone: user?.phone || '',
    preferences: {
      notifications: user?.preferences?.notifications ?? true,
      emailUpdates: user?.preferences?.emailUpdates ?? true,
      theme: user?.preferences?.theme || 'light'
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Here you would typically update the user in the database
    console.log('Saving user profile:', formData);
    
    setIsSaving(false);
    setIsEditing(false);
    
    // Show success message
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
      phone: user?.phone || '',
      preferences: {
        notifications: user?.preferences?.notifications ?? true,
        emailUpdates: user?.preferences?.emailUpdates ?? true,
        theme: user?.preferences?.theme || 'light'
      }
    });
    setIsEditing(false);
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>Profile Settings</h2>
        {!isEditing && (
          <button 
            className="edit-profile-btn"
            onClick={() => setIsEditing(true)}
          >
            <span className="btn-icon">✏️</span>
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="profile-sections">
          {/* Personal Information */}
          <div className="profile-section">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={true} // Email should not be editable
                />
                <small className="form-note">Email cannot be changed</small>
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Location & Bio */}
          <div className="profile-section">
            <h3>Location & Bio</h3>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="City, State"
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Tell the community a bit about yourself..."
                rows="4"
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="profile-section">
            <h3>Preferences</h3>
            <div className="preferences-grid">
              <div className="preference-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="preferences.notifications"
                    checked={formData.preferences.notifications}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <span className="checkbox-custom"></span>
                  <div className="preference-info">
                    <span className="preference-title">Push Notifications</span>
                    <span className="preference-description">
                      Receive notifications about item requests and messages
                    </span>
                  </div>
                </label>
              </div>
              <div className="preference-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="preferences.emailUpdates"
                    checked={formData.preferences.emailUpdates}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <span className="checkbox-custom"></span>
                  <div className="preference-info">
                    <span className="preference-title">Email Updates</span>
                    <span className="preference-description">
                      Receive weekly summaries and community updates
                    </span>
                  </div>
                </label>
              </div>
              <div className="preference-item">
                <label htmlFor="theme">Theme Preference</label>
                <select
                  id="theme"
                  name="preferences.theme"
                  value={formData.preferences.theme}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="profile-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="button-spinner"></span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="btn-icon">💾</span>
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default UserProfile;
