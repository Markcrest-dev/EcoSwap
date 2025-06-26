import { useState } from 'react';

function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('joinDate');

  // Mock user data (in real app, this would come from user service)
  const [users] = useState([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      joinDate: '2024-01-15T10:30:00Z',
      lastLogin: '2024-01-20T14:20:00Z',
      status: 'active',
      itemsShared: 5,
      itemsRequested: 3,
      location: 'Seattle, WA',
      verified: true
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@email.com',
      joinDate: '2024-01-10T09:15:00Z',
      lastLogin: '2024-01-21T11:45:00Z',
      status: 'active',
      itemsShared: 8,
      itemsRequested: 2,
      location: 'Portland, OR',
      verified: true
    },
    {
      id: 3,
      firstName: 'Mike',
      lastName: 'Chen',
      email: 'mike.chen.tech@gmail.com',
      joinDate: '2024-01-08T16:20:00Z',
      lastLogin: '2024-01-19T09:30:00Z',
      status: 'active',
      itemsShared: 12,
      itemsRequested: 7,
      location: 'San Francisco, CA',
      verified: true
    },
    {
      id: 4,
      firstName: 'Emma',
      lastName: 'Rodriguez',
      email: 'emma.r.seattle@outlook.com',
      joinDate: '2024-01-05T12:45:00Z',
      lastLogin: '2024-01-18T15:10:00Z',
      status: 'inactive',
      itemsShared: 3,
      itemsRequested: 1,
      location: 'Seattle, WA',
      verified: false
    },
    {
      id: 5,
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@ecoswap.com',
      joinDate: '2024-01-01T00:00:00Z',
      lastLogin: '2024-01-21T16:30:00Z',
      status: 'active',
      itemsShared: 0,
      itemsRequested: 0,
      location: 'Demo City',
      verified: true,
      role: 'admin'
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.firstName.localeCompare(b.firstName);
      case 'email':
        return a.email.localeCompare(b.email);
      case 'joinDate':
        return new Date(b.joinDate) - new Date(a.joinDate);
      case 'lastLogin':
        return new Date(b.lastLogin) - new Date(a.lastLogin);
      case 'itemsShared':
        return b.itemsShared - a.itemsShared;
      default:
        return 0;
    }
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#28a745';
      case 'inactive':
        return '#6c757d';
      case 'suspended':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const handleUserAction = (userId, action) => {
    console.log(`Performing ${action} on user ${userId}`);
    alert(`${action} action would be performed on user ${userId} (This would be implemented with real API)`);
  };

  return (
    <div className="user-management">
      <div className="management-header">
        <h2>User Management</h2>
        <p>Manage community members and their platform access</p>
      </div>

      <div className="management-controls">
        <div className="search-section">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="sort-group">
            <label htmlFor="sort-by">Sort by:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="joinDate">Join Date</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="lastLogin">Last Login</option>
              <option value="itemsShared">Items Shared</option>
            </select>
          </div>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Last Login</th>
              <th>Activity</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <div className="user-details">
                      <div className="user-name">
                        {user.firstName} {user.lastName}
                        {user.role === 'admin' && <span className="admin-badge">👑</span>}
                      </div>
                      <div className="user-verification">
                        {user.verified ? (
                          <span className="verified">✅ Verified</span>
                        ) : (
                          <span className="unverified">⏳ Pending</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(user.status) }}
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                <td>{formatDate(user.joinDate)}</td>
                <td>{formatDate(user.lastLogin)}</td>
                <td>
                  <div className="activity-stats">
                    <span className="stat">📤 {user.itemsShared}</span>
                    <span className="stat">📥 {user.itemsRequested}</span>
                  </div>
                </td>
                <td>{user.location}</td>
                <td>
                  <div className="user-actions">
                    <button
                      className="action-btn view-btn"
                      onClick={() => handleUserAction(user.id, 'view')}
                      title="View Profile"
                    >
                      👁️
                    </button>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleUserAction(user.id, 'edit')}
                      title="Edit User"
                    >
                      ✏️
                    </button>
                    {user.status === 'active' ? (
                      <button
                        className="action-btn suspend-btn"
                        onClick={() => handleUserAction(user.id, 'suspend')}
                        title="Suspend User"
                      >
                        ⏸️
                      </button>
                    ) : (
                      <button
                        className="action-btn activate-btn"
                        onClick={() => handleUserAction(user.id, 'activate')}
                        title="Activate User"
                      >
                        ▶️
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="no-users">
          <div className="no-users-icon">👥</div>
          <h3>No users found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
