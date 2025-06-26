import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ReviewList from '../components/reviews/ReviewList';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewStats from '../components/reviews/ReviewStats';
import ReviewService from '../services/reviewService';

function ReviewsPage({ items }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('received');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [user]);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const reviewService = new ReviewService();
      const allReviews = await reviewService.getAllReviews();
      const userReviewsData = await reviewService.getUserReviews(user.email);
      
      setReviews(allReviews);
      setUserReviews(userReviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      const reviewService = new ReviewService();
      const newReview = await reviewService.createReview({
        ...reviewData,
        reviewerId: user.email,
        reviewerName: `${user.firstName} ${user.lastName}`,
        date: new Date().toISOString()
      });

      setReviews(prev => [newReview, ...prev]);
      setShowReviewForm(false);
      setSelectedItem(null);
      
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const reviewService = new ReviewService();
      await reviewService.deleteReview(reviewId);
      
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      setUserReviews(prev => prev.filter(review => review.id !== reviewId));
      
      alert('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    }
  };

  const handleReportReview = async (reviewId, reason) => {
    try {
      const reviewService = new ReviewService();
      await reviewService.reportReview(reviewId, reason, user.email);
      
      alert('Review reported successfully. Thank you for helping maintain our community standards.');
    } catch (error) {
      console.error('Error reporting review:', error);
      alert('Failed to report review. Please try again.');
    }
  };

  // Filter reviews based on active tab
  const getFilteredReviews = () => {
    switch (activeTab) {
      case 'received':
        return reviews.filter(review => 
          items?.some(item => 
            item.contact?.email === user.email && 
            review.itemId === item.id
          )
        );
      case 'given':
        return reviews.filter(review => review.reviewerId === user.email);
      case 'all':
        return reviews;
      default:
        return [];
    }
  };

  const filteredReviews = getFilteredReviews();

  // Get items that can be reviewed
  const getReviewableItems = () => {
    if (!items) return [];
    
    return items.filter(item => {
      // Can't review own items
      if (item.contact?.email === user.email) return false;
      
      // Check if already reviewed
      const alreadyReviewed = reviews.some(review => 
        review.itemId === item.id && 
        review.reviewerId === user.email
      );
      
      return !alreadyReviewed;
    });
  };

  const reviewableItems = getReviewableItems();

  // Calculate user's average rating
  const getUserRating = () => {
    const receivedReviews = reviews.filter(review => 
      items?.some(item => 
        item.contact?.email === user.email && 
        review.itemId === item.id
      )
    );
    
    if (receivedReviews.length === 0) return 0;
    
    const totalRating = receivedReviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / receivedReviews.length).toFixed(1);
  };

  const userRating = getUserRating();

  const tabs = [
    { id: 'received', label: 'Reviews Received', icon: '⭐' },
    { id: 'given', label: 'Reviews Given', icon: '✍️' },
    { id: 'all', label: 'All Reviews', icon: '📋' }
  ];

  if (isLoading) {
    return (
      <div className="reviews-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Loading reviews...</h2>
          <p>Please wait while we fetch the reviews</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      <div className="reviews-header">
        <div className="reviews-title">
          <h1>Reviews & Ratings</h1>
          <p>Build trust through community feedback</p>
        </div>
        <div className="reviews-summary">
          <div className="summary-stat">
            <span className="stat-value">{userRating}</span>
            <span className="stat-label">Your Rating</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">{filteredReviews.length}</span>
            <span className="stat-label">Total Reviews</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">{reviewableItems.length}</span>
            <span className="stat-label">Can Review</span>
          </div>
        </div>
      </div>

      <div className="reviews-content">
        <div className="reviews-sidebar">
          <ReviewStats 
            reviews={reviews} 
            userEmail={user.email}
            items={items}
          />
          
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <button 
              className="action-btn write-review-btn"
              onClick={() => setShowReviewForm(true)}
              disabled={reviewableItems.length === 0}
            >
              ✍️ Write Review
            </button>
            <button 
              className="action-btn view-profile-btn"
              onClick={() => alert('Profile view feature would be implemented here')}
            >
              👤 View My Profile
            </button>
            <button 
              className="action-btn guidelines-btn"
              onClick={() => alert('Review guidelines would be shown here')}
            >
              📋 Review Guidelines
            </button>
          </div>
        </div>

        <div className="reviews-main">
          <div className="reviews-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`reviews-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
                <span className="tab-count">
                  ({tab.id === 'received' 
                    ? reviews.filter(r => items?.some(i => i.contact?.email === user.email && r.itemId === i.id)).length
                    : tab.id === 'given'
                    ? reviews.filter(r => r.reviewerId === user.email).length
                    : reviews.length
                  })
                </span>
              </button>
            ))}
          </div>

          <ReviewList
            reviews={filteredReviews}
            currentUser={user}
            items={items}
            onDeleteReview={handleDeleteReview}
            onReportReview={handleReportReview}
          />
        </div>
      </div>

      {showReviewForm && (
        <ReviewForm
          items={reviewableItems}
          selectedItem={selectedItem}
          onSubmit={handleSubmitReview}
          onCancel={() => {
            setShowReviewForm(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}

export default ReviewsPage;
