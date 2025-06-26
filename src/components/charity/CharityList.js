import { useState } from 'react';
import CharityCard from './CharityCard';

function CharityList({ charities, currentUser, onDonate, onFollow, onUnfollow }) {
  const [sortBy, setSortBy] = useState('featured');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort charities
  const filteredAndSortedCharities = charities
    .filter(charity => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesName = charity.name.toLowerCase().includes(searchLower);
        const matchesDescription = charity.description.toLowerCase().includes(searchLower);
        const matchesCategory = charity.category.toLowerCase().includes(searchLower);
        
        if (!matchesName && !matchesDescription && !matchesCategory) {
          return false;
        }
      }

      // Category filter
      if (filterCategory !== 'all' && charity.category !== filterCategory) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.totalRaised - a.totalRaised;
        case 'raised':
          return b.totalRaised - a.totalRaised;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  const sortOptions = [
    { value: 'featured', label: 'Featured First' },
    { value: 'raised', label: 'Most Raised' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'newest', label: 'Newest' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'environment', label: 'Environment' },
    { value: 'hunger', label: 'Hunger & Food' },
    { value: 'education', label: 'Education' },
    { value: 'animals', label: 'Animals' },
    { value: 'health', label: 'Health' },
    { value: 'community', label: 'Community' }
  ];

  const getCategoryStats = () => {
    const stats = {};
    charities.forEach(charity => {
      stats[charity.category] = (stats[charity.category] || 0) + 1;
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

  const getTotalRaised = () => {
    return filteredAndSortedCharities.reduce((sum, charity) => sum + charity.totalRaised, 0);
  };

  const getFeaturedCount = () => {
    return filteredAndSortedCharities.filter(charity => charity.featured).length;
  };

  return (
    <div className="charity-list">
      <div className="charity-list-header">
        <div className="charities-summary">
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-value">{filteredAndSortedCharities.length}</span>
              <span className="stat-label">Charities</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">${getTotalRaised().toLocaleString()}</span>
              <span className="stat-label">Total Raised</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{getFeaturedCount()}</span>
              <span className="stat-label">Featured</span>
            </div>
          </div>
        </div>

        <div className="charity-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search charities..."
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
                    {option.label} {categoryStats[option.value] ? `(${categoryStats[option.value]})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="charities-container">
        {filteredAndSortedCharities.length === 0 ? (
          <div className="no-charities">
            <div className="no-charities-icon">🏛️</div>
            <h3>No charities found</h3>
            <p>
              {searchTerm || filterCategory !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No charities available at the moment'
              }
            </p>
          </div>
        ) : (
          <div className="charities-grid">
            {filteredAndSortedCharities.map(charity => (
              <CharityCard
                key={charity.id}
                charity={charity}
                currentUser={currentUser}
                onDonate={onDonate}
                onFollow={onFollow}
                onUnfollow={onUnfollow}
              />
            ))}
          </div>
        )}
      </div>

      {filteredAndSortedCharities.length > 0 && (
        <div className="charity-list-footer">
          <div className="results-info">
            Showing {filteredAndSortedCharities.length} of {charities.length} charities
          </div>
          
          {filteredAndSortedCharities.length < charities.length && (
            <button 
              className="clear-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
                setSortBy('featured');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      <div className="charity-info-section">
        <div className="info-card">
          <h3>💡 How Charity Donations Work</h3>
          <ul>
            <li>Choose a charity that aligns with your values</li>
            <li>Donate directly or when sharing items</li>
            <li>Track your impact and donation history</li>
            <li>Follow charities to stay updated on their work</li>
            <li>All donations are processed securely</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>🌟 Featured Charities</h3>
          <p>
            Featured charities are carefully selected based on their transparency, 
            impact, and alignment with our community values. They undergo regular 
            reviews to ensure your donations make the maximum difference.
          </p>
        </div>

        <div className="info-card">
          <h3>📊 Transparency Matters</h3>
          <p>
            We provide transparency ratings for all charities based on their 
            financial reporting, impact measurement, and communication practices. 
            Look for high transparency scores when choosing where to donate.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CharityList;
