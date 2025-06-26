import { useMemo } from 'react';

function ReviewStats({ reviews, userEmail, items }) {
  const stats = useMemo(() => {
    // Reviews received by the user
    const receivedReviews = reviews.filter(review => 
      items?.some(item => 
        item.contact?.email === userEmail && 
        review.itemId === item.id
      )
    );

    // Reviews given by the user
    const givenReviews = reviews.filter(review => review.reviewerId === userEmail);

    // Calculate user's average rating
    const userRating = receivedReviews.length > 0
      ? (receivedReviews.reduce((sum, review) => sum + review.rating, 0) / receivedReviews.length).toFixed(1)
      : 0;

    // Calculate rating distribution for received reviews
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    receivedReviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    // Recent activity
    const recentReviews = [...receivedReviews, ...givenReviews]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Monthly review count (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthReviews = [...receivedReviews, ...givenReviews].filter(review => {
        const reviewDate = new Date(review.date);
        return reviewDate >= monthStart && reviewDate <= monthEnd;
      });

      monthlyData.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        count: monthReviews.length
      });
    }

    // Trust score calculation
    const trustScore = calculateTrustScore(receivedReviews, givenReviews);

    return {
      receivedCount: receivedReviews.length,
      givenCount: givenReviews.length,
      userRating: parseFloat(userRating),
      ratingDistribution,
      recentReviews,
      monthlyData,
      trustScore
    };
  }, [reviews, userEmail, items]);

  const calculateTrustScore = (received, given) => {
    let score = 50; // Base score

    // Boost for having reviews
    if (received.length > 0) {
      score += Math.min(received.length * 2, 20); // Up to 20 points for reviews received
    }

    if (given.length > 0) {
      score += Math.min(given.length * 1, 10); // Up to 10 points for reviews given
    }

    // Boost for high ratings
    if (received.length > 0) {
      const avgRating = received.reduce((sum, r) => sum + r.rating, 0) / received.length;
      score += (avgRating - 3) * 5; // +/- 10 points based on rating vs 3.0
    }

    // Boost for verified reviews
    const verifiedCount = received.filter(r => r.verified).length;
    score += Math.min(verifiedCount * 2, 10);

    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTrustLevel = (score) => {
    if (score >= 90) return { level: 'Excellent', color: '#28a745' };
    if (score >= 75) return { level: 'Very Good', color: '#20c997' };
    if (score >= 60) return { level: 'Good', color: '#ffc107' };
    if (score >= 40) return { level: 'Fair', color: '#fd7e14' };
    return { level: 'Building', color: '#6c757d' };
  };

  const trustLevel = getTrustLevel(stats.trustScore);

  return (
    <div className="review-stats">
      <div className="stats-header">
        <h3>Your Review Profile</h3>
      </div>

      <div className="stats-content">
        {/* Overall Rating */}
        <div className="stat-card rating-card">
          <div className="stat-header">
            <h4>Your Rating</h4>
          </div>
          <div className="rating-display">
            <div className="rating-value">{stats.userRating}</div>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <span 
                  key={star} 
                  className={`star ${star <= Math.round(stats.userRating) ? 'filled' : ''}`}
                >
                  ⭐
                </span>
              ))}
            </div>
            <div className="rating-count">
              Based on {stats.receivedCount} reviews
            </div>
          </div>
        </div>

        {/* Trust Score */}
        <div className="stat-card trust-card">
          <div className="stat-header">
            <h4>Trust Score</h4>
          </div>
          <div className="trust-display">
            <div className="trust-circle">
              <div 
                className="trust-fill"
                style={{ 
                  background: `conic-gradient(${trustLevel.color} ${stats.trustScore * 3.6}deg, #e9ecef 0deg)`
                }}
              >
                <div className="trust-inner">
                  <span className="trust-value">{stats.trustScore}</span>
                </div>
              </div>
            </div>
            <div className="trust-level" style={{ color: trustLevel.color }}>
              {trustLevel.level}
            </div>
          </div>
        </div>

        {/* Review Counts */}
        <div className="stat-card counts-card">
          <div className="stat-header">
            <h4>Review Activity</h4>
          </div>
          <div className="counts-display">
            <div className="count-item">
              <span className="count-value">{stats.receivedCount}</span>
              <span className="count-label">Received</span>
            </div>
            <div className="count-item">
              <span className="count-value">{stats.givenCount}</span>
              <span className="count-label">Given</span>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        {stats.receivedCount > 0 && (
          <div className="stat-card distribution-card">
            <div className="stat-header">
              <h4>Rating Breakdown</h4>
            </div>
            <div className="distribution-display">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = stats.ratingDistribution[rating];
                const percentage = stats.receivedCount > 0 ? (count / stats.receivedCount) * 100 : 0;
                
                return (
                  <div key={rating} className="distribution-bar">
                    <span className="rating-label">{rating}⭐</span>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="count-label">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Monthly Activity */}
        <div className="stat-card activity-card">
          <div className="stat-header">
            <h4>Recent Activity</h4>
          </div>
          <div className="activity-chart">
            {stats.monthlyData.map((month, index) => (
              <div key={index} className="activity-bar">
                <div 
                  className="bar-fill"
                  style={{ height: `${Math.max(month.count * 10, 5)}px` }}
                  title={`${month.count} reviews in ${month.month}`}
                ></div>
                <span className="month-label">{month.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        {stats.recentReviews.length > 0 && (
          <div className="stat-card recent-card">
            <div className="stat-header">
              <h4>Recent Reviews</h4>
            </div>
            <div className="recent-reviews">
              {stats.recentReviews.slice(0, 3).map(review => (
                <div key={review.id} className="recent-review">
                  <div className="review-info">
                    <div className="review-rating">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span 
                          key={star} 
                          className={`mini-star ${star <= review.rating ? 'filled' : ''}`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <div className="review-title">{review.title}</div>
                    <div className="review-date">{formatDate(review.date)}</div>
                  </div>
                  <div className="review-type">
                    {review.reviewerId === userEmail ? 'Given' : 'Received'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        <div className="stat-card achievements-card">
          <div className="stat-header">
            <h4>Achievements</h4>
          </div>
          <div className="achievements-list">
            {stats.receivedCount >= 1 && (
              <div className="achievement">
                <span className="achievement-icon">🌟</span>
                <span className="achievement-text">First Review</span>
              </div>
            )}
            {stats.receivedCount >= 5 && (
              <div className="achievement">
                <span className="achievement-icon">⭐</span>
                <span className="achievement-text">5 Reviews</span>
              </div>
            )}
            {stats.userRating >= 4.5 && stats.receivedCount >= 3 && (
              <div className="achievement">
                <span className="achievement-icon">🏆</span>
                <span className="achievement-text">Highly Rated</span>
              </div>
            )}
            {stats.givenCount >= 5 && (
              <div className="achievement">
                <span className="achievement-icon">✍️</span>
                <span className="achievement-text">Active Reviewer</span>
              </div>
            )}
            {stats.trustScore >= 90 && (
              <div className="achievement">
                <span className="achievement-icon">🛡️</span>
                <span className="achievement-text">Trusted Member</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewStats;
