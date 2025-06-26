import { useState } from 'react';

function UserRequests({ user }) {
  const [activeTab, setActiveTab] = useState('sent');
  
  // Mock data for demonstration - this would come from a real API
  const [sentRequests] = useState([
    {
      id: 1,
      itemTitle: "Vintage Leather Armchair",
      itemOwner: "Sarah Johnson",
      requestDate: "2024-01-15T10:30:00Z",
      status: "pending",
      message: "Hi! I'm really interested in this chair for my reading corner. Would love to pick it up this weekend if possible.",
      ownerResponse: null
    },
    {
      id: 2,
      itemTitle: "iPhone 12 Pro - Unlocked",
      itemOwner: "Mike Chen",
      requestDate: "2024-01-14T14:20:00Z",
      status: "approved",
      message: "Hello! I need a phone for my teenager. Is this still available?",
      ownerResponse: "Yes, it's available! Please contact me at mike.chen.tech@gmail.com to arrange pickup."
    },
    {
      id: 3,
      itemTitle: "Children's Books Collection",
      itemOwner: "Amanda Foster",
      requestDate: "2024-01-13T09:15:00Z",
      status: "completed",
      message: "These books would be perfect for my 5-year-old daughter. Thank you for sharing!",
      ownerResponse: "So glad they found a good home! Hope your daughter enjoys them."
    }
  ]);

  const [receivedRequests] = useState([
    {
      id: 4,
      itemTitle: "Coffee Table Books Collection",
      requesterName: "John Smith",
      requesterEmail: "john.smith@email.com",
      requestDate: "2024-01-16T11:45:00Z",
      status: "pending",
      message: "Hi David! I'm an art student and would love these books for reference. Could I pick them up this week?",
      myResponse: null
    },
    {
      id: 5,
      itemTitle: "Gaming Mechanical Keyboard",
      requesterName: "Lisa Wang",
      requesterEmail: "lisa.wang.gamer@gmail.com",
      requestDate: "2024-01-15T16:30:00Z",
      status: "approved",
      message: "Perfect for my new gaming setup! When would be a good time to collect?",
      myResponse: "Great! You can pick it up anytime this weekend. I'll send you my address."
    }
  ]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ffc107';
      case 'approved':
        return '#28a745';
      case 'declined':
        return '#dc3545';
      case 'completed':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'approved':
        return '✅';
      case 'declined':
        return '❌';
      case 'completed':
        return '🎉';
      default:
        return '❓';
    }
  };

  const handleRequestResponse = (requestId, response) => {
    // This would typically make an API call
    console.log(`Responding to request ${requestId} with: ${response}`);
    alert(`Request ${response}! (This would be implemented with real API)`);
  };

  const renderSentRequests = () => (
    <div className="requests-list">
      {sentRequests.length === 0 ? (
        <div className="empty-requests">
          <div className="empty-icon">📤</div>
          <h3>No requests sent</h3>
          <p>Browse items and send requests to get started!</p>
          <button 
            className="browse-items-btn"
            onClick={() => window.location.href = '/home'}
          >
            Browse Items
          </button>
        </div>
      ) : (
        sentRequests.map(request => (
          <div key={request.id} className="request-card">
            <div className="request-header">
              <h4 className="request-title">{request.itemTitle}</h4>
              <div className="request-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(request.status) }}
                >
                  {getStatusIcon(request.status)} {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="request-meta">
              <span className="request-owner">To: {request.itemOwner}</span>
              <span className="request-date">{formatDate(request.requestDate)}</span>
            </div>
            
            <div className="request-message">
              <strong>Your message:</strong>
              <p>"{request.message}"</p>
            </div>
            
            {request.ownerResponse && (
              <div className="owner-response">
                <strong>Owner's response:</strong>
                <p>"{request.ownerResponse}"</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  const renderReceivedRequests = () => (
    <div className="requests-list">
      {receivedRequests.length === 0 ? (
        <div className="empty-requests">
          <div className="empty-icon">📥</div>
          <h3>No requests received</h3>
          <p>Share more items to receive requests from the community!</p>
          <button 
            className="share-item-btn"
            onClick={() => window.location.href = '/share'}
          >
            Share an Item
          </button>
        </div>
      ) : (
        receivedRequests.map(request => (
          <div key={request.id} className="request-card">
            <div className="request-header">
              <h4 className="request-title">{request.itemTitle}</h4>
              <div className="request-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(request.status) }}
                >
                  {getStatusIcon(request.status)} {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="request-meta">
              <span className="request-requester">From: {request.requesterName}</span>
              <span className="request-email">{request.requesterEmail}</span>
              <span className="request-date">{formatDate(request.requestDate)}</span>
            </div>
            
            <div className="request-message">
              <strong>Their message:</strong>
              <p>"{request.message}"</p>
            </div>
            
            {request.status === 'pending' && (
              <div className="request-actions">
                <button 
                  className="approve-btn"
                  onClick={() => handleRequestResponse(request.id, 'approved')}
                >
                  ✅ Approve
                </button>
                <button 
                  className="decline-btn"
                  onClick={() => handleRequestResponse(request.id, 'declined')}
                >
                  ❌ Decline
                </button>
              </div>
            )}
            
            {request.myResponse && (
              <div className="my-response">
                <strong>Your response:</strong>
                <p>"{request.myResponse}"</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="user-requests">
      <div className="requests-header">
        <h2>Item Requests</h2>
        <p>Manage requests you've sent and received</p>
      </div>

      <div className="requests-tabs">
        <button
          className={`requests-tab ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          <span className="tab-icon">📤</span>
          <span className="tab-label">Sent ({sentRequests.length})</span>
        </button>
        <button
          className={`requests-tab ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          <span className="tab-icon">📥</span>
          <span className="tab-label">Received ({receivedRequests.length})</span>
        </button>
      </div>

      <div className="requests-content">
        {activeTab === 'sent' ? renderSentRequests() : renderReceivedRequests()}
      </div>
    </div>
  );
}

export default UserRequests;
