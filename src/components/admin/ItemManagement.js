import { useState, useMemo } from 'react';

function ItemManagement({ items, setItems }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'clothing', name: 'Clothing' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'household', name: 'Household' },
    { id: 'other', name: 'Other' }
  ];

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = items || [];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.contact && item.contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => {
        const status = item.status || 'available';
        return status === filterStatus;
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
        case 'owner':
          return (a.contact?.name || '').localeCompare(b.contact?.name || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [items, searchTerm, filterCategory, filterStatus, sortBy]);

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
      case 'flagged':
        return '#dc3545';
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
      case 'flagged':
        return '🚩';
      default:
        return '✅';
    }
  };

  const handleItemAction = (itemId, action) => {
    switch (action) {
      case 'approve':
        setItems(prevItems =>
          prevItems.map(item =>
            item.id === itemId ? { ...item, status: 'available' } : item
          )
        );
        break;
      case 'flag':
        setItems(prevItems =>
          prevItems.map(item =>
            item.id === itemId ? { ...item, status: 'flagged' } : item
          )
        );
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this item?')) {
          setItems(prevItems => prevItems.filter(item => item.id !== itemId));
        }
        break;
      default:
        console.log(`Performing ${action} on item ${itemId}`);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'clothing':
        return '👕';
      case 'electronics':
        return '📱';
      case 'furniture':
        return '🪑';
      case 'household':
        return '🏠';
      case 'other':
        return '🔧';
      default:
        return '📦';
    }
  };

  return (
    <div className="item-management">
      <div className="management-header">
        <h2>Item Management</h2>
        <p>Review and manage all items shared on the platform</p>
      </div>

      <div className="management-controls">
        <div className="search-section">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search items by title, description, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select
              id="category-filter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>

          <div className="sort-group">
            <label htmlFor="sort-by">Sort by:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Date Posted</option>
              <option value="title">Title</option>
              <option value="views">Views</option>
              <option value="interested">Interest</option>
              <option value="owner">Owner</option>
            </select>
          </div>
        </div>
      </div>

      <div className="items-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="admin-item-card">
            {item.image && (
              <div className="item-image">
                <img src={item.image} alt={item.title} />
                <div className="item-overlay">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(item.status || 'available') }}
                  >
                    {getStatusIcon(item.status || 'available')} 
                    {(item.status || 'available').charAt(0).toUpperCase() + (item.status || 'available').slice(1)}
                  </span>
                </div>
              </div>
            )}
            
            <div className="item-content">
              <div className="item-header">
                <h3 className="item-title">{item.title}</h3>
                <div className="item-category">
                  <span className="category-icon">{getCategoryIcon(item.category)}</span>
                  <span className="category-name">{item.category}</span>
                </div>
              </div>
              
              <p className="item-description">{item.description}</p>
              
              <div className="item-meta">
                <div className="meta-row">
                  <span className="meta-label">Owner:</span>
                  <span className="meta-value">{item.contact?.name || 'Unknown'}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Email:</span>
                  <span className="meta-value">{item.contact?.email || 'N/A'}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Location:</span>
                  <span className="meta-value">{item.location}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Posted:</span>
                  <span className="meta-value">{formatDate(item.date)}</span>
                </div>
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

              <div className="admin-actions">
                {(item.status === 'flagged' || !item.status) && (
                  <button
                    className="action-btn approve-btn"
                    onClick={() => handleItemAction(item.id, 'approve')}
                  >
                    ✅ Approve
                  </button>
                )}
                {item.status !== 'flagged' && (
                  <button
                    className="action-btn flag-btn"
                    onClick={() => handleItemAction(item.id, 'flag')}
                  >
                    🚩 Flag
                  </button>
                )}
                <button
                  className="action-btn edit-btn"
                  onClick={() => handleItemAction(item.id, 'edit')}
                >
                  ✏️ Edit
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleItemAction(item.id, 'delete')}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="no-items">
          <div className="no-items-icon">📦</div>
          <h3>No items found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}

export default ItemManagement;
