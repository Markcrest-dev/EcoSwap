import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminStats from '../components/admin/AdminStats';
import UserManagement from '../components/admin/UserManagement';
import ItemManagement from '../components/admin/ItemManagement';
import PlatformAnalytics from '../components/admin/PlatformAnalytics';
import SystemControls from '../components/admin/SystemControls';
import AdminReports from '../components/admin/AdminReports';

function AdminDashboard({ items, setItems }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    activeItems: 0,
    totalViews: 0,
    totalInterested: 0,
    recentSignups: 0,
    platformGrowth: 0
  });

  // Check if user is admin (in a real app, this would be a proper role check)
  const isAdmin = user?.email === 'demo@ecoswap.com' || user?.email?.includes('admin');

  // Calculate admin statistics
  useEffect(() => {
    if (items) {
      const totalViews = items.reduce((sum, item) => sum + (item.views || 0), 0);
      const totalInterested = items.reduce((sum, item) => sum + (item.interested || 0), 0);
      const activeItems = items.filter(item => item.status !== 'completed').length;
      
      // Simulate user data (in real app, this would come from user service)
      const totalUsers = 25; // Mock data
      const recentSignups = 5; // Mock data
      const platformGrowth = 15.5; // Mock percentage

      setAdminStats({
        totalUsers,
        totalItems: items.length,
        activeItems,
        totalViews,
        totalInterested,
        recentSignups,
        platformGrowth
      });
    }
  }, [items]);

  // Redirect non-admin users
  if (!isAdmin) {
    return (
      <div className="admin-access-denied">
        <div className="access-denied-content">
          <div className="access-denied-icon">🚫</div>
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin dashboard.</p>
          <button 
            className="back-btn"
            onClick={() => window.location.href = '/home'}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'items', label: 'Items', icon: '📦' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'reports', label: 'Reports', icon: '📋' },
    { id: 'system', label: 'System', icon: '⚙️' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="admin-overview">
            <AdminStats stats={adminStats} />
            <div className="overview-grid">
              <div className="overview-section">
                <h3>Recent Activity</h3>
                <div className="recent-activity">
                  <div className="activity-item">
                    <span className="activity-icon">👤</span>
                    <span className="activity-text">5 new users registered today</span>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">📦</span>
                    <span className="activity-text">12 new items shared</span>
                    <span className="activity-time">4 hours ago</span>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">❤️</span>
                    <span className="activity-text">45 item requests made</span>
                    <span className="activity-time">6 hours ago</span>
                  </div>
                </div>
              </div>
              <div className="overview-section">
                <h3>Quick Actions</h3>
                <div className="admin-quick-actions">
                  <button 
                    className="admin-action-btn"
                    onClick={() => setActiveTab('users')}
                  >
                    <span className="action-icon">👥</span>
                    <span className="action-text">Manage Users</span>
                  </button>
                  <button 
                    className="admin-action-btn"
                    onClick={() => setActiveTab('items')}
                  >
                    <span className="action-icon">📦</span>
                    <span className="action-text">Review Items</span>
                  </button>
                  <button 
                    className="admin-action-btn"
                    onClick={() => setActiveTab('reports')}
                  >
                    <span className="action-icon">📋</span>
                    <span className="action-text">Generate Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'items':
        return <ItemManagement items={items} setItems={setItems} />;
      case 'analytics':
        return <PlatformAnalytics items={items} stats={adminStats} />;
      case 'reports':
        return <AdminReports items={items} stats={adminStats} />;
      case 'system':
        return <SystemControls />;
      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-title">
          <h1>Admin Dashboard</h1>
          <p>Manage and monitor the EcoSwap platform</p>
        </div>
        <div className="admin-user-info">
          <div className="admin-badge">
            <span className="badge-icon">👑</span>
            <span className="badge-text">Administrator</span>
          </div>
          <div className="admin-user-details">
            <h3>{user?.firstName} {user?.lastName}</h3>
            <p>Platform Administrator</p>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="admin-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;
