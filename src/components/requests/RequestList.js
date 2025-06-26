import { useState } from 'react';
import RequestCard from './RequestCard';

function RequestList({ 
  requests, 
  currentUser, 
  items, 
  isOwnRequests, 
  onUpdate, 
  onDelete, 
  onOfferItem, 
  onAcceptOffer,
  onSelectRequest 
}) {
  const [sortBy, setSortBy] = useState('date');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort requests
  const filteredAndSortedRequests = requests
    .filter(request => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesTitle = request.title.toLowerCase().includes(searchLower);
        const matchesDescription = request.description.toLowerCase().includes(searchLower);
        const matchesTags = request.tags?.some(tag => tag.toLowerCase().includes(searchLower));
        const matchesLocation = request.location.toLowerCase().includes(searchLower);
        
        if (!matchesTitle && !matchesDescription && !matchesTags && !matchesLocation) {
          return false;
        }
      }

      // Category filter
      if (filterCategory !== 'all' && request.category !== filterCategory) {
        return false;
      }

      // Urgency filter
      if (filterUrgency !== 'all' && request.urgency !== filterUrgency) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'urgency':
          const urgencyOrder = { high: 3, medium: 2, low: 1 };
          return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        case 'offers':
          return (b.offers?.length || 0) - (a.offers?.length || 0);
        case 'expiry':
          return new Date(a.expiresAt) - new Date(b.expiresAt);
        default:
          return 0;
      }
    });

  const sortOptions = [
    { value: 'date', label: 'Most Recent' },
    { value: 'urgency', label: 'Most Urgent' },
    { value: 'offers', label: 'Most Offers' },
    { value: 'expiry', label: 'Expiring Soon' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'household', label: 'Household' },
    { value: 'other', label: 'Other' }
  ];

  const urgencyOptions = [
    { value: 'all', label: 'All Urgency' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const getUrgencyStats = () => {
    const stats = { high: 0, medium: 0, low: 0 };
    requests.forEach(request => {
      if (request.status === 'active') {
        stats[request.urgency]++;
      }
    });
    return stats;
  };

  const urgencyStats = getUrgencyStats();

  return (
    <div className="request-list">
      <div className="request-list-header">
        <div className="requests-summary">
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-value">{requests.length}</span>
              <span className="stat-label">Total Requests</span>
            </div>
            <div className="stat-item urgent">
              <span className="stat-value">{urgencyStats.high}</span>
              <span className="stat-label">Urgent</span>
            </div>
            <div className="stat-item medium">
              <span className="stat-value">{urgencyStats.medium}</span>
              <span className="stat-label">Medium</span>
            </div>
            <div className="stat-item low">
              <span className="stat-value">{urgencyStats.low}</span>
              <span className="stat-label">Low</span>
            </div>
          </div>
        </div>

        <div className="request-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-section">
            <div className="filter-group">
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
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

            <div className="filter-group">
              <label htmlFor="category-filter">Category:</label>
              <select
                id="category-filter"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="urgency-filter">Urgency:</label>
              <select
                id="urgency-filter"
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
              >
                {urgencyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="requests-container">
        {filteredAndSortedRequests.length === 0 ? (
          <div className="no-requests">
            <div className="no-requests-icon">📋</div>
            <h3>No requests found</h3>
            <p>
              {searchTerm || filterCategory !== 'all' || filterUrgency !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : isOwnRequests
                ? 'You haven\'t created any requests yet'
                : 'No active requests available'
              }
            </p>
            {isOwnRequests && (
              <button 
                className="create-first-request-btn"
                onClick={() => window.location.href = '/requests'}
              >
                Create Your First Request
              </button>
            )}
          </div>
        ) : (
          <div className="requests-grid">
            {filteredAndSortedRequests.map(request => (
              <RequestCard
                key={request.id}
                request={request}
                currentUser={currentUser}
                items={items}
                isOwnRequest={request.requesterId === currentUser.email}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onOfferItem={onOfferItem}
                onAcceptOffer={onAcceptOffer}
                onSelect={() => onSelectRequest(request)}
              />
            ))}
          </div>
        )}
      </div>

      {filteredAndSortedRequests.length > 0 && (
        <div className="request-list-footer">
          <div className="results-info">
            Showing {filteredAndSortedRequests.length} of {requests.length} requests
          </div>
          
          {filteredAndSortedRequests.length < requests.length && (
            <button 
              className="clear-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
                setFilterUrgency('all');
                setSortBy('date');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default RequestList;
