import { useState } from 'react';

function MapFilters({ filters, onFilterChange, userLocation, onLocationRequest, isLoadingLocation }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const categories = [
    { id: 'all', name: 'All Categories', icon: '📦' },
    { id: 'clothing', name: 'Clothing', icon: '👕' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'furniture', name: 'Furniture', icon: '🪑' },
    { id: 'household', name: 'Household', icon: '🏠' },
    { id: 'other', name: 'Other', icon: '🔧' }
  ];

  const radiusOptions = [
    { value: 1, label: '1 km' },
    { value: 2, label: '2 km' },
    { value: 5, label: '5 km' },
    { value: 10, label: '10 km' },
    { value: 20, label: '20 km' },
    { value: 50, label: '50 km' }
  ];

  const sortOptions = [
    { value: 'distance', label: 'Distance', icon: '📍' },
    { value: 'date', label: 'Newest First', icon: '📅' },
    { value: 'popularity', label: 'Most Popular', icon: '⭐' }
  ];

  const handleRadiusChange = (value) => {
    onFilterChange('radius', parseInt(value));
  };

  const handleCategoryChange = (categoryId) => {
    onFilterChange('category', categoryId);
  };

  const handleAvailabilityToggle = () => {
    onFilterChange('showOnlyAvailable', !filters.showOnlyAvailable);
  };

  const handleSortChange = (sortBy) => {
    onFilterChange('sortBy', sortBy);
  };

  const formatLocation = (location) => {
    if (!location) return 'Unknown';
    return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
  };

  return (
    <div className="map-filters">
      <div className="filters-header">
        <h3>Filters & Settings</h3>
        <button 
          className="expand-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {isExpanded && (
        <div className="filters-content">
          {/* Location Section */}
          <div className="filter-section">
            <h4>📍 Your Location</h4>
            <div className="location-info">
              {userLocation ? (
                <div className="location-display">
                  <span className="location-coords">
                    {formatLocation(userLocation)}
                  </span>
                  <button 
                    className="location-refresh-btn"
                    onClick={onLocationRequest}
                    disabled={isLoadingLocation}
                    title="Refresh location"
                  >
                    {isLoadingLocation ? '⏳' : '🔄'}
                  </button>
                </div>
              ) : (
                <button 
                  className="location-request-btn"
                  onClick={onLocationRequest}
                  disabled={isLoadingLocation}
                >
                  {isLoadingLocation ? 'Getting location...' : 'Get My Location'}
                </button>
              )}
            </div>
          </div>

          {/* Search Radius */}
          <div className="filter-section">
            <h4>🎯 Search Radius</h4>
            <div className="radius-selector">
              <div className="radius-buttons">
                {radiusOptions.map(option => (
                  <button
                    key={option.value}
                    className={`radius-btn ${filters.radius === option.value ? 'active' : ''}`}
                    onClick={() => handleRadiusChange(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="radius-slider">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={filters.radius}
                  onChange={(e) => handleRadiusChange(e.target.value)}
                  className="slider"
                />
                <div className="slider-value">{filters.radius} km</div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <h4>📂 Category</h4>
            <div className="category-selector">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-filter-btn ${filters.category === category.id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="filter-section">
            <h4>✅ Availability</h4>
            <label className="availability-toggle">
              <input
                type="checkbox"
                checked={filters.showOnlyAvailable}
                onChange={handleAvailabilityToggle}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Show only available items</span>
            </label>
          </div>

          {/* Sort Options */}
          <div className="filter-section">
            <h4>🔄 Sort By</h4>
            <div className="sort-selector">
              {sortOptions.map(option => (
                <button
                  key={option.value}
                  className={`sort-btn ${filters.sortBy === option.value ? 'active' : ''}`}
                  onClick={() => handleSortChange(option.value)}
                >
                  <span className="sort-icon">{option.icon}</span>
                  <span className="sort-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="filter-section">
            <h4>⚡ Quick Actions</h4>
            <div className="quick-actions">
              <button 
                className="quick-action-btn"
                onClick={() => {
                  onFilterChange('category', 'all');
                  onFilterChange('radius', 10);
                  onFilterChange('showOnlyAvailable', true);
                  onFilterChange('sortBy', 'distance');
                }}
              >
                🔄 Reset Filters
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => onFilterChange('radius', 2)}
              >
                🏃 Nearby Only
              </button>
              <button 
                className="quick-action-btn"
                onClick={() => onFilterChange('sortBy', 'date')}
              >
                🆕 Show Latest
              </button>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="filter-summary">
            <h4>📊 Current Filters</h4>
            <div className="summary-items">
              <div className="summary-item">
                <span className="summary-label">Radius:</span>
                <span className="summary-value">{filters.radius} km</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Category:</span>
                <span className="summary-value">
                  {categories.find(c => c.id === filters.category)?.name || 'All'}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Available Only:</span>
                <span className="summary-value">
                  {filters.showOnlyAvailable ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Sort:</span>
                <span className="summary-value">
                  {sortOptions.find(s => s.value === filters.sortBy)?.label || 'Distance'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapFilters;
