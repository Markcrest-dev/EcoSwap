import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardStats from '../components/dashboard/DashboardStats';
import UserProfile from '../components/dashboard/UserProfile';
import UserItems from '../components/dashboard/UserItems';
import UserActivity from '../components/dashboard/UserActivity';
import UserRequests from '../components/dashboard/UserRequests';

function DashboardPage({ items, setItems }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats, setUserStats] = useState({
    itemsShared: 0,
    itemsRequested: 0,
    totalViews: 0,
    totalInterested: 0,
    impactScore: 0
  });

  // Calculate user statistics
  useEffect(() => {
    if (user && items) {
      const userItems = items.filter(item => 
        item.contact && item.contact.email === user.email
      );
      
      const totalViews = userItems.reduce((sum, item) => sum + (item.views || 0), 0);
      const totalInterested = userItems.reduce((sum, item) => sum + (item.interested || 0), 0);
      const impactScore = userItems.length * 10 + totalViews * 2 + totalInterested * 5;

      setUserStats({
        itemsShared: userItems.length,
        itemsRequested: 0, // Will be implemented with request feature
        totalViews,
        totalInterested,
        impactScore
      });
    }
  }, [user, items]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'items', label: 'My Items', icon: '📦' },
    { id: 'requests', label: 'Requests', icon: '🙋' },
    { id: 'activity', label: 'Activity', icon: '📈' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="dashboard-overview">
            <DashboardStats stats={userStats} user={user} />
            <div className="overview-grid">
              <div className="overview-section">
                <h3>Recent Activity</h3>
                <UserActivity items={items} user={user} limit={5} />
              </div>
              <div className="overview-section">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <button 
                    className="quick-action-btn"
                    onClick={() => window.location.href = '/share'}
                  >
                    <span className="action-icon">📤</span>
                    <span className="action-text">Share New Item</span>
                  </button>
                  <button 
                    className="quick-action-btn"
                    onClick={() => setActiveTab('profile')}
                  >
                    <span className="action-icon">✏️</span>
                    <span className="action-text">Edit Profile</span>
                  </button>
                  <button 
                    className="quick-action-btn"
                    onClick={() => setActiveTab('items')}
                  >
                    <span className="action-icon">📋</span>
                    <span className="action-text">Manage Items</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return <UserProfile user={user} />;
      case 'items':
        return <UserItems items={items} setItems={setItems} user={user} />;
      case 'requests':
        return <UserRequests user={user} />;
      case 'activity':
        return <UserActivity items={items} user={user} />;
      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Welcome back, {user?.firstName}!</h1>
          <p>Manage your EcoSwap activity and profile</p>
        </div>
        <div className="dashboard-user-info">
          <div className="user-avatar-large">
            {user?.firstName?.charAt(0) || 'U'}
          </div>
          <div className="user-details-large">
            <h3>{user?.firstName} {user?.lastName}</h3>
            <p>{user?.email}</p>
            <span className="user-badge">Community Member</span>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`dashboard-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default DashboardPage;
