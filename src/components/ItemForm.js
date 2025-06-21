import { useState } from 'react';

function ItemForm({ addItem }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMethod, setContactMethod] = useState('email');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !category || !location || !contactName) return;

    // Validate contact information based on preferred method
    if (contactMethod === 'email' && !contactEmail) {
      alert('Please provide an email address');
      return;
    }
    if (contactMethod === 'phone' && !contactPhone) {
      alert('Please provide a phone number');
      return;
    }
    if (contactMethod === 'both' && (!contactEmail || !contactPhone)) {
      alert('Please provide both email and phone number');
      return;
    }

    addItem({
      title,
      description,
      category,
      location,
      image: imagePreview,
      contact: {
        name: contactName,
        email: contactEmail,
        phone: contactPhone,
        preferredMethod: contactMethod
      },
      date: new Date().toISOString()
    });

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setLocation('');
    setImage(null);
    setImagePreview('');
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setContactMethod('email');
  };

  return (
    <div className="item-form-container">
      <h2>Share an Item</h2>
      <form onSubmit={handleSubmit} className="item-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="clothing">Clothing</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="household">Household</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Neighborhood or area"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <div className="contact-section">
          <h3>Contact Information</h3>
          <p className="contact-note">This information will be shown to people interested in your item.</p>

          <div className="form-group">
            <label htmlFor="contactName">Your Name *</label>
            <input
              type="text"
              id="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="How should people address you?"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactMethod">Preferred Contact Method</label>
            <select
              id="contactMethod"
              value={contactMethod}
              onChange={(e) => setContactMethod(e.target.value)}
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="both">Both Email and Phone</option>
            </select>
          </div>

          {(contactMethod === 'email' || contactMethod === 'both') && (
            <div className="form-group">
              <label htmlFor="contactEmail">Email Address *</label>
              <input
                type="email"
                id="contactEmail"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="your.email@example.com"
                required={contactMethod === 'email' || contactMethod === 'both'}
              />
            </div>
          )}

          {(contactMethod === 'phone' || contactMethod === 'both') && (
            <div className="form-group">
              <label htmlFor="contactPhone">Phone Number *</label>
              <input
                type="tel"
                id="contactPhone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="(555) 123-4567"
                required={contactMethod === 'phone' || contactMethod === 'both'}
              />
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn">Share Item</button>
      </form>
    </div>
  );
}

export default ItemForm;