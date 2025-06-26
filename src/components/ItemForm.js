import { useEffect, useState } from 'react';
import CharityService from '../services/charityService';

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

  // Charity donation fields
  const [enableCharity, setEnableCharity] = useState(false);
  const [selectedCharity, setSelectedCharity] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [charities, setCharities] = useState([]);

  // Load charities on component mount
  useEffect(() => {
    const loadCharities = async () => {
      try {
        const charityService = new CharityService();
        const charitiesData = await charityService.getAllCharities();
        setCharities(charitiesData.filter(c => c.status === 'active'));
      } catch (error) {
        console.error('Error loading charities:', error);
      }
    };

    loadCharities();
  }, []);

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

  const handleSubmit = async (e) => {
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

    // Validate charity donation if enabled
    if (enableCharity) {
      if (!selectedCharity) {
        alert('Please select a charity for your donation');
        return;
      }
      if (!donationAmount || parseFloat(donationAmount) <= 0) {
        alert('Please enter a valid donation amount');
        return;
      }
    }

    const newItem = {
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
      date: new Date().toISOString(),
      charity: enableCharity ? {
        charityId: selectedCharity,
        donationAmount: parseFloat(donationAmount)
      } : null
    };

    // Process charity donation if enabled
    if (enableCharity && selectedCharity && donationAmount) {
      try {
        const charityService = new CharityService();
        await charityService.createDonation({
          charityId: selectedCharity,
          amount: parseFloat(donationAmount),
          itemId: newItem.id || `item-${Date.now()}`,
          itemTitle: title,
          donorId: contactEmail,
          donorName: contactName,
          type: 'item-share',
          message: `Donated in connection with sharing "${title}"`
        });

        alert(`Item shared successfully! Thank you for your $${donationAmount} donation! 🌱💝`);
      } catch (error) {
        console.error('Error processing donation:', error);
        alert('Item shared successfully, but there was an issue processing the donation. Please try donating separately.');
      }
    }

    addItem(newItem);

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
    setEnableCharity(false);
    setSelectedCharity('');
    setDonationAmount('');
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

        {/* Charity Donation Section */}
        <div className="form-section charity-section">
          <h3>💝 Support a Charity (Optional)</h3>
          <p>Make a donation to a charity when sharing your item to maximize your positive impact!</p>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={enableCharity}
                onChange={(e) => setEnableCharity(e.target.checked)}
              />
              <span className="checkbox-text">I want to make a charity donation with this item share</span>
            </label>
          </div>

          {enableCharity && (
            <div className="charity-form">
              <div className="form-group">
                <label htmlFor="selectedCharity">Choose a Charity *</label>
                <select
                  id="selectedCharity"
                  value={selectedCharity}
                  onChange={(e) => setSelectedCharity(e.target.value)}
                  required={enableCharity}
                >
                  <option value="">Select a charity...</option>
                  {charities.map(charity => (
                    <option key={charity.id} value={charity.id}>
                      {charity.logo} {charity.name} - {charity.category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="donationAmount">Donation Amount ($) *</label>
                <input
                  type="number"
                  id="donationAmount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  step="0.01"
                  required={enableCharity}
                />
                <div className="suggested-amounts">
                  <span>Quick amounts:</span>
                  {[5, 10, 25, 50].map(amount => (
                    <button
                      key={amount}
                      type="button"
                      className="amount-btn"
                      onClick={() => setDonationAmount(amount.toString())}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              {selectedCharity && (
                <div className="charity-preview">
                  {(() => {
                    const charity = charities.find(c => c.id === selectedCharity);
                    return charity ? (
                      <div className="charity-info">
                        <div className="charity-header">
                          <span className="charity-logo">{charity.logo}</span>
                          <div className="charity-details">
                            <h4>{charity.name}</h4>
                            <p>{charity.description}</p>
                            <div className="charity-stats">
                              <span>Rating: {charity.rating}⭐</span>
                              <span>Transparency: {charity.transparency}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              <div className="charity-impact">
                <p>
                  💡 <strong>Your impact:</strong> By donating while sharing items, you're
                  reducing waste AND supporting important causes in your community!
                </p>
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="submit-btn">
          {enableCharity && donationAmount
            ? `Share Item & Donate $${donationAmount}`
            : 'Share Item'
          }
        </button>
      </form>
    </div>
  );
}

export default ItemForm;