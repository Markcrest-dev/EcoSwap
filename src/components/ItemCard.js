import { useState } from 'react';

function ItemCard({ item }) {
  const [showContact, setShowContact] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="item-card">
      {item.image && (
        <div className="item-image">
          <img src={item.image} alt={item.title} />
        </div>
      )}
      <div className="item-content">
        <h3>{item.title}</h3>
        <p className="item-location">{item.location}</p>
        <p className="item-date">Posted on {formatDate(item.date)}</p>
        <p className="item-category">{item.category}</p>
        <p className="item-description">{item.description}</p>

        <button
          className="request-btn"
          onClick={() => setShowContact(!showContact)}
        >
          {showContact ? 'Hide Contact' : 'Request Item'}
        </button>

        {showContact && item.contact && (
          <div className="contact-info">
            <h4>Contact {item.contact.name}</h4>

            {item.contact.preferredMethod === 'email' && item.contact.email && (
              <div className="contact-method">
                <strong>Email:</strong>
                <a href={`mailto:${item.contact.email}`} className="contact-link">
                  {item.contact.email}
                </a>
              </div>
            )}

            {item.contact.preferredMethod === 'phone' && item.contact.phone && (
              <div className="contact-method">
                <strong>Phone:</strong>
                <a href={`tel:${item.contact.phone}`} className="contact-link">
                  {item.contact.phone}
                </a>
              </div>
            )}

            {item.contact.preferredMethod === 'both' && (
              <>
                {item.contact.email && (
                  <div className="contact-method">
                    <strong>Email:</strong>
                    <a href={`mailto:${item.contact.email}`} className="contact-link">
                      {item.contact.email}
                    </a>
                  </div>
                )}
                {item.contact.phone && (
                  <div className="contact-method">
                    <strong>Phone:</strong>
                    <a href={`tel:${item.contact.phone}`} className="contact-link">
                      {item.contact.phone}
                    </a>
                  </div>
                )}
              </>
            )}

            <p className="contact-note">
              Click the contact info above to reach out about this item.
            </p>
          </div>
        )}

        {showContact && !item.contact && (
          <div className="contact-info">
            <p>No contact information available for this item.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemCard;