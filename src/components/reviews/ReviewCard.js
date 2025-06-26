import { useState } from 'react';

function ReviewCard({ review, currentUser, items, onDelete, onReport }) {
  const [showActions, setShowActions] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

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

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map(star => (
      <span 
        key={star} 
        className={`star ${star <= rating ? 'filled' : 'empty'}`}
      >
        ⭐
      </span>
    ));
  };

  const getRelatedItem = () => {
    if (items && review.itemId) {
      return items.find(item => item.id === review.itemId);
    }
    return null;
  };

  const relatedItem = getRelatedItem();

  const canDelete = review.reviewerId === currentUser.email;
  const canReport = review.reviewerId !== currentUser.email && !review.reported;

  const handleReport = (reason) => {
    onReport(review.id, reason);
    setShowReportModal(false);
    setShowActions(false);
  };

  const reportReasons = [
    'Inappropriate content',
    'Spam or fake review',
    'Personal attack',
    'Off-topic',
    'Misleading information',
    'Other'
  ];

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">
            {review.reviewerName.charAt(0).toUpperCase()}
          </div>
          <div className="reviewer-details">
            <h4 className="reviewer-name">{review.reviewerName}</h4>
            <div className="review-meta">
              <span className="review-date">{formatDate(review.date)}</span>
              {review.verified && (
                <span className="verified-badge">✓ Verified</span>
              )}
            </div>
          </div>
        </div>

        <div className="review-actions">
          <div className="review-rating">
            {renderStars(review.rating)}
          </div>
          
          <button
            className="actions-toggle"
            onClick={() => setShowActions(!showActions)}
          >
            ⋮
          </button>
          
          {showActions && (
            <div className="actions-dropdown">
              {canDelete && (
                <button
                  className="action-item delete-action"
                  onClick={() => {
                    onDelete(review.id);
                    setShowActions(false);
                  }}
                >
                  🗑️ Delete
                </button>
              )}
              {canReport && (
                <button
                  className="action-item report-action"
                  onClick={() => {
                    setShowReportModal(true);
                    setShowActions(false);
                  }}
                >
                  🚩 Report
                </button>
              )}
              <button
                className="action-item share-action"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Review link copied to clipboard!');
                  setShowActions(false);
                }}
              >
                📤 Share
              </button>
            </div>
          )}
        </div>
      </div>

      {relatedItem && (
        <div className="related-item">
          <div className="item-preview">
            {relatedItem.image && (
              <img src={relatedItem.image} alt={relatedItem.title} className="item-thumbnail" />
            )}
            <div className="item-info">
              <span className="item-title">{review.itemTitle}</span>
              <span className="item-category">{relatedItem.category}</span>
            </div>
          </div>
        </div>
      )}

      <div className="review-content">
        <h3 className="review-title">{review.title}</h3>
        <p className="review-comment">{review.comment}</p>
      </div>

      <div className="review-footer">
        <div className="review-stats">
          <button 
            className="helpful-btn"
            onClick={() => {
              // In real app, would call API to mark as helpful
              alert('Marked as helpful!');
            }}
            disabled={review.reviewerId === currentUser.email}
          >
            👍 Helpful ({review.helpful || 0})
          </button>
        </div>

        {review.reported && (
          <div className="reported-indicator">
            <span className="reported-icon">🚩</span>
            <span className="reported-text">Reported</span>
          </div>
        )}
      </div>

      {showReportModal && (
        <div className="report-modal">
          <div className="modal-overlay" onClick={() => setShowReportModal(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Report Review</h3>
              <button 
                className="modal-close"
                onClick={() => setShowReportModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <p>Why are you reporting this review?</p>
              <div className="report-reasons">
                {reportReasons.map(reason => (
                  <button
                    key={reason}
                    className="reason-btn"
                    onClick={() => handleReport(reason)}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewCard;
