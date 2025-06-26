import { useState } from 'react';

function ItemLocationCard({ item, isSelected, onSelect }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      const options = { month: 'short', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      clothing: '👕',
      electronics: '📱',
      furniture: '🪑',
      household: '🏠',
      other: '🔧'
    };
    return icons[category] || '📦';
  };

  const getCategoryColor = (category) => {
    const colors = {
      clothing: '#e74c3c',
      electronics: '#3498db',
      furniture: '#f39c12',
      household: '#2ecc71',
      other: '#9b59b6'
    };
    return colors[category] || '#95a5a6';
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

  const handleCardClick = () => {
    onSelect();
  };

  const handleExpandClick = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleContactClick = (e) => {
    e.stopPropagation();
    if (item.contact?.email) {
      window.location.href = `mailto:${item.contact.email}?subject=Interest in ${item.title}&body=Hi! I'm interested in your item "${item.title}" that you shared on EcoSwap.`;
    }
  };

  const handleDirectionsClick = (e) => {
    e.stopPropagation();
    if (item.coordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${item.coordinates.lat},${item.coordinates.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div 
      className={`item-location-card ${isSelected ? 'selected' : ''}`}
      onClick={handleCardClick}
    >
      <div className="card-header">
        <div className="item-category" style={{ backgroundColor: getCategoryColor(item.category) }}>
          <span className="category-icon">{getCategoryIcon(item.category)}</span>
        </div>
        <div className="item-info">
          <h4 className="item-title">{item.title}</h4>
          <div className="item-meta">
            <span className="item-location">📍 {item.location}</span>
            {item.distance && (
              <span className="item-distance">{item.distance}km away</span>
            )}
          </div>
        </div>
        <div className="card-actions">
          <div 
            className="item-status"
            style={{ backgroundColor: getStatusColor(item.status || 'available') }}
          >
            {getStatusIcon(item.status || 'available')}
          </div>
          <button 
            className="expand-btn"
            onClick={handleExpandClick}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="card-content">
          <div className="item-description">
            <p>{item.description}</p>
          </div>

          <div className="item-details">
            <div className="detail-row">
              <span className="detail-label">Posted:</span>
              <span className="detail-value">{formatDate(item.date)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Category:</span>
              <span className="detail-value">{item.category}</span>
            </div>
            {item.contact?.name && (
              <div className="detail-row">
                <span className="detail-label">Owner:</span>
                <span className="detail-value">{item.contact.name}</span>
              </div>
            )}
          </div>

          <div className="item-stats">
            <div className="stat-item">
              <span className="stat-icon">👀</span>
              <span className="stat-value">{item.views || 0}</span>
              <span className="stat-label">views</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">❤️</span>
              <span className="stat-value">{item.interested || 0}</span>
              <span className="stat-label">interested</span>
            </div>
          </div>

          <div className="card-actions-expanded">
            <button 
              className="action-btn contact-btn"
              onClick={handleContactClick}
              disabled={!item.contact?.email}
            >
              <span className="btn-icon">📧</span>
              <span className="btn-text">Contact Owner</span>
            </button>
            <button 
              className="action-btn directions-btn"
              onClick={handleDirectionsClick}
              disabled={!item.coordinates}
            >
              <span className="btn-icon">🗺️</span>
              <span className="btn-text">Get Directions</span>
            </button>
          </div>
        </div>
      )}

      {item.image && (
        <div className="item-image-preview">
          <img src={item.image} alt={item.title} />
        </div>
      )}

      {isSelected && (
        <div className="selection-indicator">
          <span className="selection-icon">📍</span>
          <span className="selection-text">Selected on map</span>
        </div>
      )}
    </div>
  );
}

export default ItemLocationCard;
