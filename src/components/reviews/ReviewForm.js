import { useState } from 'react';

function ReviewForm({ items, selectedItem, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    itemId: selectedItem?.id || '',
    rating: 0,
    title: '',
    comment: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
    
    if (errors.rating) {
      setErrors(prev => ({
        ...prev,
        rating: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.itemId) {
      newErrors.itemId = 'Please select an item to review';
    }

    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a review title';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

    if (!formData.comment.trim()) {
      newErrors.comment = 'Please enter a review comment';
    } else if (formData.comment.length < 10) {
      newErrors.comment = 'Comment must be at least 10 characters';
    } else if (formData.comment.length > 1000) {
      newErrors.comment = 'Comment must be 1000 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const selectedItemData = items.find(item => item.id === formData.itemId);
      
      onSubmit({
        ...formData,
        itemTitle: selectedItemData?.title || 'Unknown Item',
        revieweeId: selectedItemData?.contact?.email || '',
        revieweeName: selectedItemData?.contact?.name || 'Unknown User'
      });
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type="button"
        className={`star-btn ${star <= (hoveredRating || formData.rating) ? 'filled' : 'empty'}`}
        onClick={() => handleRatingClick(star)}
        onMouseEnter={() => setHoveredRating(star)}
        onMouseLeave={() => setHoveredRating(0)}
      >
        ⭐
      </button>
    ));
  };

  const getRatingText = (rating) => {
    const ratingTexts = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return ratingTexts[rating] || '';
  };

  return (
    <div className="review-form-modal">
      <div className="modal-overlay" onClick={onCancel}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Write a Review</h2>
          <button className="modal-close" onClick={onCancel}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-section">
            <label htmlFor="item-select">Select Item *</label>
            <select
              id="item-select"
              value={formData.itemId}
              onChange={(e) => handleInputChange('itemId', e.target.value)}
              className={errors.itemId ? 'error' : ''}
            >
              <option value="">Choose an item to review...</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  {item.title} - {item.contact?.name || 'Unknown User'}
                </option>
              ))}
            </select>
            {errors.itemId && <span className="error-message">{errors.itemId}</span>}
          </div>

          <div className="form-section">
            <label>Rating *</label>
            <div className="rating-section">
              <div className="stars-container">
                {renderStars()}
              </div>
              <span className="rating-text">
                {getRatingText(hoveredRating || formData.rating)}
              </span>
            </div>
            {errors.rating && <span className="error-message">{errors.rating}</span>}
          </div>

          <div className="form-section">
            <label htmlFor="review-title">Review Title *</label>
            <input
              type="text"
              id="review-title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Summarize your experience..."
              maxLength="100"
              className={errors.title ? 'error' : ''}
            />
            <div className="char-count">
              {formData.title.length}/100
            </div>
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-section">
            <label htmlFor="review-comment">Your Review *</label>
            <textarea
              id="review-comment"
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              placeholder="Share details about your experience with this item and the person you exchanged with..."
              rows="6"
              maxLength="1000"
              className={errors.comment ? 'error' : ''}
            />
            <div className="char-count">
              {formData.comment.length}/1000
            </div>
            {errors.comment && <span className="error-message">{errors.comment}</span>}
          </div>

          <div className="review-guidelines">
            <h4>Review Guidelines</h4>
            <ul>
              <li>Be honest and fair in your review</li>
              <li>Focus on your experience with the item and the exchange</li>
              <li>Avoid personal attacks or inappropriate language</li>
              <li>Include specific details that would help other users</li>
              <li>Remember that reviews are public and permanent</li>
            </ul>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={!formData.itemId || !formData.rating || !formData.title.trim() || !formData.comment.trim()}
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewForm;
