import { useState } from 'react';

function RequestForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    urgency: 'medium',
    location: '',
    condition: 'any',
    maxDistance: 15,
    tags: ''
  });
  const [errors, setErrors] = useState({});

  const categories = [
    { value: '', label: 'Select a category...' },
    { value: 'clothing', label: 'Clothing & Accessories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'household', label: 'Household Items' },
    { value: 'other', label: 'Other' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low - I can wait', description: 'No rush, whenever available' },
    { value: 'medium', label: 'Medium - Preferred soon', description: 'Would like within a few weeks' },
    { value: 'high', label: 'High - Needed urgently', description: 'Need as soon as possible' }
  ];

  const conditionOptions = [
    { value: 'any', label: 'Any condition' },
    { value: 'excellent', label: 'Excellent - Like new' },
    { value: 'good', label: 'Good - Minor wear' },
    { value: 'fair', label: 'Fair - Some wear but functional' }
  ];

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a title for your request';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please describe what you\'re looking for';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be 1000 characters or less';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Please enter your location';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0);

      onSubmit({
        ...formData,
        tags
      });
    }
  };

  const getCharacterCount = (field, max) => {
    const current = formData[field].length;
    return `${current}/${max}`;
  };

  return (
    <div className="request-form-modal">
      <div className="modal-overlay" onClick={onCancel}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create Item Request</h2>
          <button className="modal-close" onClick={onCancel}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="request-form">
          <div className="form-section">
            <label htmlFor="request-title">What are you looking for? *</label>
            <input
              type="text"
              id="request-title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Winter coat size medium, Desk lamp for office..."
              maxLength="100"
              className={errors.title ? 'error' : ''}
            />
            <div className="char-count">
              {getCharacterCount('title', 100)}
            </div>
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-section">
            <label htmlFor="request-description">Detailed Description *</label>
            <textarea
              id="request-description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Provide more details about what you need, preferred condition, size, color, etc. The more specific you are, the better matches you'll get!"
              rows="4"
              maxLength="1000"
              className={errors.description ? 'error' : ''}
            />
            <div className="char-count">
              {getCharacterCount('description', 1000)}
            </div>
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-section">
              <label htmlFor="request-category">Category *</label>
              <select
                id="request-category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={errors.category ? 'error' : ''}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            <div className="form-section">
              <label htmlFor="request-location">Your Location *</label>
              <input
                type="text"
                id="request-location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="City, State or ZIP code"
                className={errors.location ? 'error' : ''}
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>
          </div>

          <div className="form-section">
            <label>Urgency Level</label>
            <div className="urgency-options">
              {urgencyLevels.map(level => (
                <label key={level.value} className="urgency-option">
                  <input
                    type="radio"
                    name="urgency"
                    value={level.value}
                    checked={formData.urgency === level.value}
                    onChange={(e) => handleInputChange('urgency', e.target.value)}
                  />
                  <div className="urgency-content">
                    <span className="urgency-label">{level.label}</span>
                    <span className="urgency-description">{level.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-section">
              <label htmlFor="request-condition">Preferred Condition</label>
              <select
                id="request-condition"
                value={formData.condition}
                onChange={(e) => handleInputChange('condition', e.target.value)}
              >
                {conditionOptions.map(condition => (
                  <option key={condition.value} value={condition.value}>
                    {condition.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-section">
              <label htmlFor="max-distance">Max Distance (km)</label>
              <input
                type="range"
                id="max-distance"
                min="1"
                max="100"
                value={formData.maxDistance}
                onChange={(e) => handleInputChange('maxDistance', parseInt(e.target.value))}
              />
              <div className="distance-value">{formData.maxDistance} km</div>
            </div>
          </div>

          <div className="form-section">
            <label htmlFor="request-tags">Tags (optional)</label>
            <input
              type="text"
              id="request-tags"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="Add tags separated by commas (e.g., vintage, leather, brown)"
            />
            <div className="tags-help">
              Tags help others find your request more easily
            </div>
          </div>

          <div className="request-guidelines">
            <h4>Request Guidelines</h4>
            <ul>
              <li>Be specific about what you need</li>
              <li>Include size, color, or other important details</li>
              <li>Set realistic expectations for condition</li>
              <li>Be responsive to offers from community members</li>
              <li>Remember to mark your request as fulfilled when complete</li>
            </ul>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={!formData.title.trim() || !formData.description.trim() || !formData.category || !formData.location.trim()}
            >
              Create Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RequestForm;
