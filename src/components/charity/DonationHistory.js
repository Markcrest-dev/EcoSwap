import { useState } from 'react';

function DonationHistory({ donations, charities, items }) {
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort donations
  const filteredAndSortedDonations = donations
    .filter(donation => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesCharity = donation.charityName.toLowerCase().includes(searchLower);
        const matchesItem = donation.itemTitle?.toLowerCase().includes(searchLower);
        const matchesMessage = donation.message?.toLowerCase().includes(searchLower);
        
        if (!matchesCharity && !matchesItem && !matchesMessage) {
          return false;
        }
      }

      // Type filter
      if (filterType !== 'all' && donation.type !== filterType) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'amount':
          return b.amount - a.amount;
        case 'charity':
          return a.charityName.localeCompare(b.charityName);
        default:
          return 0;
      }
    });

  const sortOptions = [
    { value: 'date', label: 'Most Recent' },
    { value: 'amount', label: 'Highest Amount' },
    { value: 'charity', label: 'Charity Name' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Donations' },
    { value: 'direct', label: 'Direct Donations' },
    { value: 'item-share', label: 'Item Share Donations' }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getTotalDonated = () => {
    return filteredAndSortedDonations.reduce((sum, donation) => sum + donation.amount, 0);
  };

  const getCharityInfo = (charityId) => {
    return charities.find(charity => charity.id === charityId);
  };

  const getItemInfo = (itemId) => {
    return items?.find(item => item.id === itemId);
  };

  const getDonationTypeIcon = (type) => {
    switch (type) {
      case 'direct':
        return '💝';
      case 'item-share':
        return '📤';
      default:
        return '💰';
    }
  };

  const getDonationTypeLabel = (type) => {
    switch (type) {
      case 'direct':
        return 'Direct Donation';
      case 'item-share':
        return 'Item Share Donation';
      default:
        return 'Donation';
    }
  };

  return (
    <div className="donation-history">
      <div className="donation-history-header">
        <div className="donations-summary">
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-value">{filteredAndSortedDonations.length}</span>
              <span className="stat-label">Donations</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{formatCurrency(getTotalDonated())}</span>
              <span className="stat-label">Total Amount</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {new Set(filteredAndSortedDonations.map(d => d.charityId)).size}
              </span>
              <span className="stat-label">Charities Supported</span>
            </div>
          </div>
        </div>

        <div className="donation-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search donations..."
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
              <label htmlFor="type-filter">Type:</label>
              <select
                id="type-filter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="donations-container">
        {filteredAndSortedDonations.length === 0 ? (
          <div className="no-donations">
            <div className="no-donations-icon">💝</div>
            <h3>No donations found</h3>
            <p>
              {searchTerm || filterType !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'You haven\'t made any donations yet'
              }
            </p>
            {!searchTerm && filterType === 'all' && (
              <button 
                className="start-donating-btn"
                onClick={() => window.location.href = '/charity'}
              >
                Start Donating
              </button>
            )}
          </div>
        ) : (
          <div className="donations-list">
            {filteredAndSortedDonations.map(donation => {
              const charity = getCharityInfo(donation.charityId);
              const item = getItemInfo(donation.itemId);
              
              return (
                <div key={donation.id} className="donation-item">
                  <div className="donation-header">
                    <div className="donation-type">
                      <span className="type-icon">{getDonationTypeIcon(donation.type)}</span>
                      <span className="type-label">{getDonationTypeLabel(donation.type)}</span>
                    </div>
                    <div className="donation-amount">
                      {formatCurrency(donation.amount)}
                    </div>
                  </div>

                  <div className="donation-content">
                    <div className="charity-info">
                      <h4 className="charity-name">{donation.charityName}</h4>
                      {charity && (
                        <div className="charity-category">
                          {charity.category} • {charity.rating}⭐
                        </div>
                      )}
                    </div>

                    {donation.itemId && item && (
                      <div className="related-item">
                        <span className="item-label">Related to item:</span>
                        <span className="item-title">{donation.itemTitle}</span>
                      </div>
                    )}

                    {donation.message && (
                      <div className="donation-message">
                        <p>"{donation.message}"</p>
                      </div>
                    )}

                    <div className="donation-meta">
                      <span className="donation-date">{formatDate(donation.date)}</span>
                      <span className="donation-id">ID: {donation.id}</span>
                    </div>
                  </div>

                  <div className="donation-actions">
                    {charity && (
                      <button 
                        className="action-btn view-charity-btn"
                        onClick={() => {
                          // Navigate to charity details or open charity page
                          alert(`View ${charity.name} details`);
                        }}
                      >
                        View Charity
                      </button>
                    )}
                    <button 
                      className="action-btn receipt-btn"
                      onClick={() => {
                        // Generate receipt or download
                        alert('Receipt functionality would be implemented here');
                      }}
                    >
                      📄 Receipt
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {filteredAndSortedDonations.length > 0 && (
        <div className="donation-history-footer">
          <div className="results-info">
            Showing {filteredAndSortedDonations.length} of {donations.length} donations
          </div>
          
          {filteredAndSortedDonations.length < donations.length && (
            <button 
              className="clear-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setSortBy('date');
              }}
            >
              Clear Filters
            </button>
          )}

          <div className="export-options">
            <button 
              className="export-btn"
              onClick={() => {
                // Export functionality
                alert('Export functionality would be implemented here');
              }}
            >
              📊 Export Data
            </button>
          </div>
        </div>
      )}

      <div className="donation-insights">
        <div className="insight-card">
          <h3>💡 Your Donation Impact</h3>
          <p>
            Your {donations.length} donations totaling {formatCurrency(getTotalDonated())} 
            have supported {new Set(donations.map(d => d.charityId)).size} different charities. 
            Thank you for making a difference in your community!
          </p>
        </div>

        <div className="insight-card">
          <h3>📈 Donation Trends</h3>
          <p>
            {donations.filter(d => d.type === 'item-share').length > 0 
              ? `${Math.round((donations.filter(d => d.type === 'item-share').length / donations.length) * 100)}% of your donations were made while sharing items.`
              : 'Consider donating when sharing items to maximize your impact!'
            }
          </p>
        </div>
      </div>
    </div>
  );
}

export default DonationHistory;
