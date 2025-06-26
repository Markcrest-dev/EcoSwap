import { useState, useMemo } from 'react';

function UserItems({ items, setItems, user }) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Get user's items
  const userItems = useMemo(() => {
    if (!user || !items) return [];
    return items.filter(item => 
      item.contact && item.contact.email === user.email
    );
  }, [items, user]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = userItems;

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(item => {
        switch (filter) {
          case 'available':
            return item.status === 'available' || !item.status;
          case 'pending':
            return item.status === 'pending';
          case 'completed':
            return item.status === 'completed';
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'views':
          return (b.views || 0) - (a.views || 0);
        case 'interested':
          return (b.interested || 0) - (a.interested || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [userItems, filter, sortBy]);

  const handleStatusChange = (itemId, newStatus) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, status: newStatus }
          : item
      )
    );
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'completed':
        return '#6c757d';
      default:
        return '#28a745';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available':
        return '✅';
      case 'pending':
        return '⏳';
      case 'completed':
        return '🎉';
      default:
        return '✅';
    }
  };

  return (
    <div className="user-items">
      <div className="items-header">
        <h2>My Items ({userItems.length})</h2>
        <div className="items-controls">
          <div className="filter-group">
            <label htmlFor="filter">Filter:</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Items</option>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="sort-group">
            <label htmlFor="sort">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Date Posted</option>
              <option value="title">Title</option>
              <option value="views">Views</option>
              <option value="interested">Interest</option>
            </select>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-items">
          <div className="empty-icon">📦</div>
          <h3>No items found</h3>
          <p>
            {filter === 'all' 
              ? "You haven't shared any items yet. Start sharing to help your community!"
              : `No ${filter} items found. Try changing the filter.`
            }
          </p>
          <button 
            className="share-item-btn"
            onClick={() => window.location.href = '/share'}
          >
            Share Your First Item
          </button>
        </div>
      ) : (
        <div className="items-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="user-item-card">
              {item.image && (
                <div className="item-image">
                  <img src={item.image} alt={item.title} />
                </div>
              )}
              <div className="item-content">
                <div className="item-header">
                  <h3 className="item-title">{item.title}</h3>
                  <div className="item-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(item.status || 'available') }}
                    >
                      {getStatusIcon(item.status || 'available')} 
                      {(item.status || 'available').charAt(0).toUpperCase() + (item.status || 'available').slice(1)}
                    </span>
                  </div>
                </div>
                
                <p className="item-description">{item.description}</p>
                
                <div className="item-meta">
                  <span className="item-category">📂 {item.category}</span>
                  <span className="item-location">📍 {item.location}</span>
                  <span className="item-date">📅 {formatDate(item.date)}</span>
                </div>

                <div className="item-stats">
                  <div className="stat">
                    <span className="stat-icon">👀</span>
                    <span className="stat-value">{item.views || 0} views</span>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">❤️</span>
                    <span className="stat-value">{item.interested || 0} interested</span>
                  </div>
                </div>

                <div className="item-actions">
                  <select
                    value={item.status || 'available'}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    className="edit-item-btn"
                    onClick={() => alert('Edit functionality coming soon!')}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="delete-item-btn"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserItems;
