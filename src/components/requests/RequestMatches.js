import { useState, useMemo } from 'react';

function RequestMatches({ requests, items, currentUser, onOfferItem }) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');

  // Calculate matches between user's items and requests
  const matches = useMemo(() => {
    if (!items || !requests) return [];

    const userItems = items.filter(item => item.contact?.email === currentUser.email);
    const matchResults = [];

    userItems.forEach(item => {
      requests.forEach(request => {
        if (request.status !== 'active') return;

        const score = calculateMatchScore(item, request);
        if (score > 0) {
          matchResults.push({
            item,
            request,
            score,
            reasons: getMatchReasons(item, request)
          });
        }
      });
    });

    return matchResults.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return b.score - a.score;
        case 'urgency':
          const urgencyOrder = { high: 3, medium: 2, low: 1 };
          return urgencyOrder[b.request.urgency] - urgencyOrder[a.request.urgency];
        case 'date':
          return new Date(b.request.createdAt) - new Date(a.request.createdAt);
        default:
          return b.score - a.score;
      }
    });
  }, [items, requests, currentUser, sortBy]);

  const calculateMatchScore = (item, request) => {
    let score = 0;

    // Category match (highest weight)
    if (item.category === request.category) {
      score += 50;
    }

    // Title keyword matching
    const itemKeywords = item.title.toLowerCase().split(' ');
    const requestKeywords = [
      ...request.title.toLowerCase().split(' '),
      ...request.description.toLowerCase().split(' ')
    ];

    const titleMatches = itemKeywords.filter(keyword => 
      requestKeywords.some(reqKeyword => 
        reqKeyword.includes(keyword) || keyword.includes(reqKeyword)
      )
    );
    score += titleMatches.length * 10;

    // Description keyword matching
    const itemDescKeywords = item.description.toLowerCase().split(' ');
    const descMatches = itemDescKeywords.filter(keyword => 
      requestKeywords.some(reqKeyword => 
        reqKeyword.includes(keyword) || keyword.includes(reqKeyword)
      )
    );
    score += descMatches.length * 5;

    // Tag matching
    if (request.tags) {
      const tagMatches = request.tags.filter(tag => 
        item.title.toLowerCase().includes(tag) || 
        item.description.toLowerCase().includes(tag)
      );
      score += tagMatches.length * 15;
    }

    // Condition matching
    if (request.condition === 'any' || item.condition === request.condition) {
      score += 10;
    }

    return score;
  };

  const getMatchReasons = (item, request) => {
    const reasons = [];

    if (item.category === request.category) {
      reasons.push(`Same category: ${item.category}`);
    }

    const itemKeywords = item.title.toLowerCase().split(' ');
    const requestKeywords = request.title.toLowerCase().split(' ');
    const commonKeywords = itemKeywords.filter(keyword => 
      requestKeywords.some(reqKeyword => 
        reqKeyword.includes(keyword) || keyword.includes(reqKeyword)
      )
    );

    if (commonKeywords.length > 0) {
      reasons.push(`Matching keywords: ${commonKeywords.slice(0, 3).join(', ')}`);
    }

    if (request.tags) {
      const tagMatches = request.tags.filter(tag => 
        item.title.toLowerCase().includes(tag) || 
        item.description.toLowerCase().includes(tag)
      );
      if (tagMatches.length > 0) {
        reasons.push(`Matching tags: ${tagMatches.slice(0, 2).join(', ')}`);
      }
    }

    return reasons;
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#28a745';
    if (score >= 50) return '#ffc107';
    if (score >= 30) return '#fd7e14';
    return '#6c757d';
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Excellent Match';
    if (score >= 50) return 'Good Match';
    if (score >= 30) return 'Fair Match';
    return 'Possible Match';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleOfferItem = (match) => {
    const message = `Hi! I saw your request for "${match.request.title}" and I have a ${match.item.title} that might be perfect for you. Let me know if you're interested!`;
    onOfferItem(match.request.id, match.item.id, message);
  };

  const sortOptions = [
    { value: 'relevance', label: 'Best Match' },
    { value: 'urgency', label: 'Most Urgent' },
    { value: 'date', label: 'Most Recent' }
  ];

  return (
    <div className="request-matches">
      <div className="matches-header">
        <div className="matches-title">
          <h3>Item Matches</h3>
          <p>Your items that match community requests</p>
        </div>
        
        <div className="matches-controls">
          <div className="sort-section">
            <label htmlFor="matches-sort">Sort by:</label>
            <select
              id="matches-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="matches-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-value">{matches.length}</span>
            <span className="stat-label">Total Matches</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{matches.filter(m => m.score >= 70).length}</span>
            <span className="stat-label">Excellent</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{matches.filter(m => m.score >= 50 && m.score < 70).length}</span>
            <span className="stat-label">Good</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{matches.filter(m => m.score < 50).length}</span>
            <span className="stat-label">Fair</span>
          </div>
        </div>
      </div>

      <div className="matches-container">
        {matches.length === 0 ? (
          <div className="no-matches">
            <div className="no-matches-icon">🎯</div>
            <h3>No matches found</h3>
            <p>
              We couldn't find any requests that match your shared items. 
              Try sharing more items or check back later for new requests!
            </p>
            <button 
              className="share-item-btn"
              onClick={() => window.location.href = '/share'}
            >
              Share an Item
            </button>
          </div>
        ) : (
          <div className="matches-grid">
            {matches.map((match, index) => (
              <div key={`${match.item.id}-${match.request.id}`} className="match-card">
                <div className="match-header">
                  <div className="match-score">
                    <div 
                      className="score-circle"
                      style={{ backgroundColor: getScoreColor(match.score) }}
                    >
                      {match.score}
                    </div>
                    <span className="score-label">{getScoreLabel(match.score)}</span>
                  </div>
                  
                  <div className="urgency-indicator">
                    <span className={`urgency-badge ${match.request.urgency}`}>
                      {match.request.urgency}
                    </span>
                  </div>
                </div>

                <div className="match-content">
                  <div className="your-item">
                    <h4>Your Item</h4>
                    <div className="item-preview">
                      {match.item.image && (
                        <img src={match.item.image} alt={match.item.title} className="item-thumbnail" />
                      )}
                      <div className="item-info">
                        <h5>{match.item.title}</h5>
                        <p>{match.item.description.substring(0, 100)}...</p>
                        <span className="item-category">{match.item.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="match-arrow">
                    ↓ matches ↓
                  </div>

                  <div className="requested-item">
                    <h4>Requested</h4>
                    <div className="request-preview">
                      <div className="request-info">
                        <h5>{match.request.title}</h5>
                        <p>{match.request.description.substring(0, 100)}...</p>
                        <div className="request-meta">
                          <span className="requester">by {match.request.requesterName}</span>
                          <span className="request-date">{formatDate(match.request.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="match-reasons">
                  <h5>Why it matches:</h5>
                  <ul>
                    {match.reasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>

                <div className="match-actions">
                  <button 
                    className="view-request-btn"
                    onClick={() => setSelectedRequest(match.request)}
                  >
                    👁️ View Request
                  </button>
                  <button 
                    className="offer-item-btn"
                    onClick={() => handleOfferItem(match)}
                  >
                    📤 Offer Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedRequest && (
        <div className="request-detail-modal">
          <div className="modal-overlay" onClick={() => setSelectedRequest(null)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedRequest.title}</h3>
              <button 
                className="modal-close"
                onClick={() => setSelectedRequest(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="request-details">
                <p><strong>Description:</strong> {selectedRequest.description}</p>
                <p><strong>Category:</strong> {selectedRequest.category}</p>
                <p><strong>Location:</strong> {selectedRequest.location}</p>
                <p><strong>Urgency:</strong> {selectedRequest.urgency}</p>
                <p><strong>Condition:</strong> {selectedRequest.condition}</p>
                {selectedRequest.tags && selectedRequest.tags.length > 0 && (
                  <p><strong>Tags:</strong> {selectedRequest.tags.join(', ')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestMatches;
