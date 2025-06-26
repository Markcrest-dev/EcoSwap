import { useState } from 'react';

function RequestCard({ 
  request, 
  currentUser, 
  items, 
  isOwnRequest, 
  onUpdate, 
  onDelete, 
  onOfferItem, 
  onAcceptOffer,
  onSelect 
}) {
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [offerMessage, setOfferMessage] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const formatExpiryDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) {
      return 'Expired';
    } else if (diffInDays === 0) {
      return 'Expires today';
    } else if (diffInDays === 1) {
      return 'Expires tomorrow';
    } else if (diffInDays < 7) {
      return `Expires in ${diffInDays} days`;
    } else {
      return `Expires ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return '#dc3545';
      case 'medium':
        return '#ffc107';
      case 'low':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#28a745';
      case 'fulfilled':
        return '#007bff';
      case 'expired':
        return '#6c757d';
      default:
        return '#6c757d';
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

  const getMatchingItems = () => {
    if (!items) return [];
    
    return items.filter(item => {
      // Don't show own items
      if (item.contact?.email === currentUser.email) return false;
      
      // Simple matching based on category and keywords
      if (item.category === request.category) return true;
      
      const requestKeywords = [
        ...request.title.toLowerCase().split(' '),
        ...request.description.toLowerCase().split(' ')
      ];
      
      const itemKeywords = [
        ...item.title.toLowerCase().split(' '),
        ...item.description.toLowerCase().split(' ')
      ];
      
      return requestKeywords.some(keyword => 
        itemKeywords.some(itemKeyword => 
          itemKeyword.includes(keyword) || keyword.includes(itemKeyword)
        )
      );
    });
  };

  const matchingItems = getMatchingItems();

  const handleOfferSubmit = () => {
    if (selectedItemId && offerMessage.trim()) {
      onOfferItem(request.id, selectedItemId, offerMessage.trim());
      setShowOfferModal(false);
      setSelectedItemId('');
      setOfferMessage('');
    }
  };

  const isExpired = new Date(request.expiresAt) < new Date();
  const isExpiringSoon = new Date(request.expiresAt) - new Date() < 7 * 24 * 60 * 60 * 1000;

  return (
    <div className={`request-card ${request.status} ${isExpired ? 'expired' : ''}`}>
      <div className="request-header">
        <div className="request-meta">
          <div className="category-icon" style={{ backgroundColor: getUrgencyColor(request.urgency) }}>
            {getCategoryIcon(request.category)}
          </div>
          <div className="request-info">
            <h3 className="request-title">{request.title}</h3>
            <div className="request-details">
              <span className="requester-name">by {request.requesterName}</span>
              <span className="request-date">{formatDate(request.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="request-status-badges">
          <span 
            className="urgency-badge"
            style={{ backgroundColor: getUrgencyColor(request.urgency) }}
          >
            {request.urgency}
          </span>
          <span 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(request.status) }}
          >
            {request.status}
          </span>
        </div>
      </div>

      <div className="request-content">
        <p className="request-description">{request.description}</p>
        
        <div className="request-tags">
          {request.tags?.map(tag => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>

        <div className="request-metadata">
          <div className="metadata-item">
            <span className="metadata-icon">📍</span>
            <span className="metadata-text">{request.location}</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-icon">📂</span>
            <span className="metadata-text">{request.category}</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-icon">⏰</span>
            <span className={`metadata-text ${isExpiringSoon ? 'expiring-soon' : ''}`}>
              {formatExpiryDate(request.expiresAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="request-footer">
        <div className="request-stats">
          <div className="stat-item">
            <span className="stat-icon">💬</span>
            <span className="stat-text">{request.offers?.length || 0} offers</span>
          </div>
          {matchingItems.length > 0 && !isOwnRequest && (
            <div className="stat-item matches">
              <span className="stat-icon">🎯</span>
              <span className="stat-text">{matchingItems.length} matches</span>
            </div>
          )}
        </div>

        <div className="request-actions">
          {isOwnRequest ? (
            <>
              {request.offers && request.offers.length > 0 && (
                <button 
                  className="action-btn view-offers-btn"
                  onClick={() => setShowOffersModal(true)}
                >
                  View Offers ({request.offers.length})
                </button>
              )}
              <button 
                className="action-btn edit-btn"
                onClick={() => onUpdate(request.id, { /* edit data */ })}
                disabled={request.status !== 'active'}
              >
                ✏️ Edit
              </button>
              <button 
                className="action-btn delete-btn"
                onClick={() => onDelete(request.id)}
              >
                🗑️ Delete
              </button>
            </>
          ) : (
            <>
              {matchingItems.length > 0 && request.status === 'active' && (
                <button 
                  className="action-btn offer-btn"
                  onClick={() => setShowOfferModal(true)}
                >
                  📤 Make Offer
                </button>
              )}
              <button 
                className="action-btn contact-btn"
                onClick={() => {
                  const email = request.requesterId;
                  const subject = `Regarding your request: ${request.title}`;
                  const body = `Hi ${request.requesterName},\n\nI saw your request for "${request.title}" and wanted to reach out.\n\nBest regards`;
                  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                }}
              >
                📧 Contact
              </button>
            </>
          )}
        </div>
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="offer-modal">
          <div className="modal-overlay" onClick={() => setShowOfferModal(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Make an Offer</h3>
              <button 
                className="modal-close"
                onClick={() => setShowOfferModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="item-select">Select Item to Offer:</label>
                <select
                  id="item-select"
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                >
                  <option value="">Choose an item...</option>
                  {matchingItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.title} - {item.category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="offer-message">Message:</label>
                <textarea
                  id="offer-message"
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder="Tell them why your item would be perfect for their request..."
                  rows="4"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowOfferModal(false)}
              >
                Cancel
              </button>
              <button 
                className="submit-btn"
                onClick={handleOfferSubmit}
                disabled={!selectedItemId || !offerMessage.trim()}
              >
                Send Offer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offers Modal */}
      {showOffersModal && (
        <div className="offers-modal">
          <div className="modal-overlay" onClick={() => setShowOffersModal(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Offers for "{request.title}"</h3>
              <button 
                className="modal-close"
                onClick={() => setShowOffersModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              {request.offers && request.offers.length > 0 ? (
                <div className="offers-list">
                  {request.offers.map(offer => (
                    <div key={offer.id} className={`offer-item ${offer.status}`}>
                      <div className="offer-header">
                        <span className="offerer-name">{offer.offererName}</span>
                        <span className="offer-date">{formatDate(offer.createdAt)}</span>
                      </div>
                      <div className="offer-message">{offer.message}</div>
                      {offer.status === 'pending' && (
                        <div className="offer-actions">
                          <button 
                            className="accept-btn"
                            onClick={() => {
                              onAcceptOffer(request.id, offer.id);
                              setShowOffersModal(false);
                            }}
                          >
                            Accept
                          </button>
                          <button className="decline-btn">
                            Decline
                          </button>
                        </div>
                      )}
                      {offer.status !== 'pending' && (
                        <div className="offer-status">
                          Status: {offer.status}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No offers yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestCard;
