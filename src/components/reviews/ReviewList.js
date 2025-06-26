import { useState } from 'react';
import ReviewCard from './ReviewCard';

function ReviewList({ reviews, currentUser, items, onDeleteReview, onReportReview }) {
  const [sortBy, setSortBy] = useState('date');
  const [filterRating, setFilterRating] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter(review => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesTitle = review.title.toLowerCase().includes(searchLower);
        const matchesComment = review.comment.toLowerCase().includes(searchLower);
        const matchesItem = review.itemTitle.toLowerCase().includes(searchLower);
        const matchesReviewer = review.reviewerName.toLowerCase().includes(searchLower);
        
        if (!matchesTitle && !matchesComment && !matchesItem && !matchesReviewer) {
          return false;
        }
      }

      // Rating filter
      if (filterRating !== 'all' && review.rating !== parseInt(filterRating)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        case 'helpful':
          return (b.helpful || 0) - (a.helpful || 0);
        default:
          return 0;
      }
    });

  const sortOptions = [
    { value: 'date', label: 'Most Recent' },
    { value: 'rating-high', label: 'Highest Rating' },
    { value: 'rating-low', label: 'Lowest Rating' },
    { value: 'helpful', label: 'Most Helpful' }
  ];

  const ratingOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' }
  ];

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();
  const averageRating = getAverageRating();

  return (
    <div className="review-list">
      <div className="review-list-header">
        <div className="reviews-summary">
          <div className="summary-stats">
            <div className="average-rating">
              <span className="rating-value">{averageRating}</span>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span 
                    key={star} 
                    className={`star ${star <= Math.round(averageRating) ? 'filled' : ''}`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <span className="rating-count">({reviews.length} reviews)</span>
            </div>
          </div>

          <div className="rating-breakdown">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = ratingDistribution[rating];
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              
              return (
                <div key={rating} className="rating-bar">
                  <span className="rating-label">{rating} ⭐</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="rating-count">({count})</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="review-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search reviews..."
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
              <label htmlFor="rating-filter">Rating:</label>
              <select
                id="rating-filter"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
              >
                {ratingOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="reviews-container">
        {filteredAndSortedReviews.length === 0 ? (
          <div className="no-reviews">
            <div className="no-reviews-icon">⭐</div>
            <h3>No reviews found</h3>
            <p>
              {searchTerm || filterRating !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No reviews available yet'
              }
            </p>
          </div>
        ) : (
          <div className="reviews-grid">
            {filteredAndSortedReviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                currentUser={currentUser}
                items={items}
                onDelete={onDeleteReview}
                onReport={onReportReview}
              />
            ))}
          </div>
        )}
      </div>

      {filteredAndSortedReviews.length > 0 && (
        <div className="review-list-footer">
          <div className="results-info">
            Showing {filteredAndSortedReviews.length} of {reviews.length} reviews
          </div>
          
          {filteredAndSortedReviews.length < reviews.length && (
            <button 
              className="clear-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setFilterRating('all');
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

export default ReviewList;
