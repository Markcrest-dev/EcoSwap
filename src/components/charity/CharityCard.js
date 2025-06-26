import { useState } from 'react';

function CharityCard({ charity, currentUser, onDonate, onFollow, onUnfollow }) {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const isFollowing = charity.followers?.includes(currentUser.email) || false;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryColor = (category) => {
    const colors = {
      environment: '#28a745',
      hunger: '#fd7e14',
      education: '#007bff',
      animals: '#6f42c1',
      health: '#dc3545',
      community: '#20c997'
    };
    return colors[category] || '#6c757d';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      environment: '🌍',
      hunger: '🍞',
      education: '📚',
      animals: '🐾',
      health: '🏥',
      community: '🤝'
    };
    return icons[category] || '🏛️';
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">⭐</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">⭐</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  const handleDonate = () => {
    const amount = parseFloat(donationAmount);
    if (amount && amount > 0) {
      onDonate(charity.id, amount);
      setShowDonateModal(false);
      setDonationAmount('');
    }
  };

  const handleQuickDonate = (amount) => {
    onDonate(charity.id, amount);
  };

  const handleFollowToggle = () => {
    if (isFollowing) {
      onUnfollow(charity.id);
    } else {
      onFollow(charity.id);
    }
  };

  const getProgressPercentage = () => {
    // Simulate a fundraising goal for demo purposes
    const goal = Math.ceil(charity.totalRaised * 1.5 / 1000) * 1000;
    return Math.min((charity.totalRaised / goal) * 100, 100);
  };

  const getTransparencyColor = (score) => {
    if (score >= 90) return '#28a745';
    if (score >= 75) return '#ffc107';
    if (score >= 60) return '#fd7e14';
    return '#dc3545';
  };

  return (
    <div className={`charity-card ${charity.featured ? 'featured' : ''}`}>
      {charity.featured && (
        <div className="featured-badge">
          <span className="badge-icon">⭐</span>
          <span className="badge-text">Featured</span>
        </div>
      )}

      <div className="charity-header">
        <div className="charity-logo" style={{ backgroundColor: getCategoryColor(charity.category) }}>
          {charity.logo || getCategoryIcon(charity.category)}
        </div>
        <div className="charity-info">
          <h3 className="charity-name">{charity.name}</h3>
          <div className="charity-meta">
            <span className="charity-category">
              {getCategoryIcon(charity.category)} {charity.category}
            </span>
            <div className="charity-rating">
              {renderStars(charity.rating)}
              <span className="rating-value">({charity.rating})</span>
            </div>
          </div>
        </div>
        <button 
          className={`follow-btn ${isFollowing ? 'following' : ''}`}
          onClick={handleFollowToggle}
        >
          {isFollowing ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="charity-content">
        <p className="charity-description">{charity.description}</p>
        
        <div className="charity-stats">
          <div className="stat-item">
            <span className="stat-value">{formatCurrency(charity.totalRaised)}</span>
            <span className="stat-label">Raised</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{charity.donorCount}</span>
            <span className="stat-label">Donors</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{charity.transparency}%</span>
            <span className="stat-label">Transparency</span>
          </div>
        </div>

        <div className="fundraising-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {getProgressPercentage().toFixed(0)}% of current goal
          </div>
        </div>

        <div className="transparency-score">
          <span className="transparency-label">Transparency Score:</span>
          <span 
            className="transparency-value"
            style={{ color: getTransparencyColor(charity.transparency) }}
          >
            {charity.transparency}%
          </span>
        </div>
      </div>

      <div className="charity-actions">
        <div className="quick-donate-buttons">
          <button 
            className="quick-donate-btn"
            onClick={() => handleQuickDonate(5)}
          >
            $5
          </button>
          <button 
            className="quick-donate-btn"
            onClick={() => handleQuickDonate(10)}
          >
            $10
          </button>
          <button 
            className="quick-donate-btn"
            onClick={() => handleQuickDonate(25)}
          >
            $25
          </button>
        </div>
        
        <div className="main-actions">
          <button 
            className="action-btn donate-btn"
            onClick={() => setShowDonateModal(true)}
          >
            💝 Donate
          </button>
          <button 
            className="action-btn details-btn"
            onClick={() => setShowDetails(true)}
          >
            ℹ️ Details
          </button>
          <button 
            className="action-btn website-btn"
            onClick={() => window.open(charity.website, '_blank')}
          >
            🌐 Website
          </button>
        </div>
      </div>

      {/* Donation Modal */}
      {showDonateModal && (
        <div className="donate-modal">
          <div className="modal-overlay" onClick={() => setShowDonateModal(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Donate to {charity.name}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowDonateModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="charity-summary">
                <div className="charity-logo-large">
                  {charity.logo || getCategoryIcon(charity.category)}
                </div>
                <p>{charity.description}</p>
              </div>

              <div className="donation-form">
                <label htmlFor="donation-amount">Donation Amount ($):</label>
                <input
                  type="number"
                  id="donation-amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  step="0.01"
                />
                
                <div className="suggested-amounts">
                  <span>Suggested amounts:</span>
                  <div className="amount-buttons">
                    {[5, 10, 25, 50, 100].map(amount => (
                      <button
                        key={amount}
                        className="amount-btn"
                        onClick={() => setDonationAmount(amount.toString())}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowDonateModal(false)}
              >
                Cancel
              </button>
              <button 
                className="donate-submit-btn"
                onClick={handleDonate}
                disabled={!donationAmount || parseFloat(donationAmount) <= 0}
              >
                Donate ${donationAmount || '0'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && (
        <div className="details-modal">
          <div className="modal-overlay" onClick={() => setShowDetails(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3>{charity.name}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowDetails(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="charity-details">
                <div className="detail-section">
                  <h4>About</h4>
                  <p>{charity.description}</p>
                </div>

                <div className="detail-section">
                  <h4>Current Projects</h4>
                  <ul>
                    {charity.projects?.map((project, index) => (
                      <li key={index}>{project}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h4>Impact Metrics</h4>
                  <div className="impact-metrics">
                    {Object.entries(charity.impact || {}).map(([key, value]) => (
                      <div key={key} className="impact-item">
                        <span className="impact-label">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                        <span className="impact-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Statistics</h4>
                  <div className="charity-statistics">
                    <div className="stat-row">
                      <span>Total Raised:</span>
                      <span>{formatCurrency(charity.totalRaised)}</span>
                    </div>
                    <div className="stat-row">
                      <span>Number of Donors:</span>
                      <span>{charity.donorCount}</span>
                    </div>
                    <div className="stat-row">
                      <span>Rating:</span>
                      <span>{charity.rating}/5.0</span>
                    </div>
                    <div className="stat-row">
                      <span>Transparency Score:</span>
                      <span style={{ color: getTransparencyColor(charity.transparency) }}>
                        {charity.transparency}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="website-btn"
                onClick={() => window.open(charity.website, '_blank')}
              >
                Visit Website
              </button>
              <button 
                className="donate-btn"
                onClick={() => {
                  setShowDetails(false);
                  setShowDonateModal(true);
                }}
              >
                Donate Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CharityCard;
