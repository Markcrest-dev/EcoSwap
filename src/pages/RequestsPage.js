import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import RequestList from '../components/requests/RequestList';
import RequestForm from '../components/requests/RequestForm';
import RequestMatches from '../components/requests/RequestMatches';
import RequestService from '../services/requestService';

function RequestsPage({ items }) {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('browse');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, [user]);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const requestService = new RequestService();
      const allRequests = await requestService.getAllRequests();
      const userRequestsData = await requestService.getUserRequests(user.email);
      
      setRequests(allRequests);
      setUserRequests(userRequestsData);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRequest = async (requestData) => {
    try {
      const requestService = new RequestService();
      const newRequest = await requestService.createRequest({
        ...requestData,
        requesterId: user.email,
        requesterName: `${user.firstName} ${user.lastName}`,
        status: 'active',
        createdAt: new Date().toISOString()
      });

      setRequests(prev => [newRequest, ...prev]);
      setUserRequests(prev => [newRequest, ...prev]);
      setShowRequestForm(false);
      
      alert('Request created successfully! We\'ll notify you when matching items are found.');
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create request. Please try again.');
    }
  };

  const handleUpdateRequest = async (requestId, updateData) => {
    try {
      const requestService = new RequestService();
      const updatedRequest = await requestService.updateRequest(requestId, updateData);
      
      setRequests(prev => prev.map(req => 
        req.id === requestId ? updatedRequest : req
      ));
      setUserRequests(prev => prev.map(req => 
        req.id === requestId ? updatedRequest : req
      ));
      
      alert('Request updated successfully!');
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Failed to update request. Please try again.');
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      const requestService = new RequestService();
      await requestService.deleteRequest(requestId);
      
      setRequests(prev => prev.filter(req => req.id !== requestId));
      setUserRequests(prev => prev.filter(req => req.id !== requestId));
      
      alert('Request deleted successfully!');
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Failed to delete request. Please try again.');
    }
  };

  const handleOfferItem = async (requestId, itemId, message) => {
    try {
      const requestService = new RequestService();
      await requestService.offerItem(requestId, itemId, user.email, message);
      
      alert('Your offer has been sent to the requester!');
    } catch (error) {
      console.error('Error offering item:', error);
      alert('Failed to send offer. Please try again.');
    }
  };

  const handleAcceptOffer = async (requestId, offerId) => {
    try {
      const requestService = new RequestService();
      await requestService.acceptOffer(requestId, offerId);
      
      // Update request status
      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'fulfilled' } : req
      ));
      setUserRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status: 'fulfilled' } : req
      ));
      
      alert('Offer accepted! You can now coordinate with the item owner.');
    } catch (error) {
      console.error('Error accepting offer:', error);
      alert('Failed to accept offer. Please try again.');
    }
  };

  // Get filtered requests based on active tab
  const getFilteredRequests = () => {
    switch (activeTab) {
      case 'browse':
        return requests.filter(req => 
          req.requesterId !== user.email && 
          req.status === 'active'
        );
      case 'my-requests':
        return userRequests;
      case 'matches':
        return requests.filter(req => req.requesterId !== user.email);
      default:
        return [];
    }
  };

  const filteredRequests = getFilteredRequests();

  // Get request statistics
  const getRequestStats = () => {
    const activeRequests = userRequests.filter(req => req.status === 'active').length;
    const fulfilledRequests = userRequests.filter(req => req.status === 'fulfilled').length;
    const totalOffers = userRequests.reduce((sum, req) => sum + (req.offers?.length || 0), 0);
    
    return {
      activeRequests,
      fulfilledRequests,
      totalOffers
    };
  };

  const stats = getRequestStats();

  const tabs = [
    { id: 'browse', label: 'Browse Requests', icon: '🔍' },
    { id: 'my-requests', label: 'My Requests', icon: '📋' },
    { id: 'matches', label: 'Item Matches', icon: '🎯' }
  ];

  if (isLoading) {
    return (
      <div className="requests-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Loading requests...</h2>
          <p>Please wait while we fetch the item requests</p>
        </div>
      </div>
    );
  }

  return (
    <div className="requests-page">
      <div className="requests-header">
        <div className="requests-title">
          <h1>Item Requests</h1>
          <p>Request items you need or help fulfill others' requests</p>
        </div>
        <div className="requests-summary">
          <div className="summary-stat">
            <span className="stat-value">{stats.activeRequests}</span>
            <span className="stat-label">Active Requests</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">{stats.fulfilledRequests}</span>
            <span className="stat-label">Fulfilled</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">{stats.totalOffers}</span>
            <span className="stat-label">Offers Received</span>
          </div>
        </div>
      </div>

      <div className="requests-content">
        <div className="requests-sidebar">
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <button 
              className="action-btn create-request-btn"
              onClick={() => setShowRequestForm(true)}
            >
              ➕ Create Request
            </button>
            <button 
              className="action-btn browse-items-btn"
              onClick={() => window.location.href = '/home'}
            >
              🔍 Browse Available Items
            </button>
            <button 
              className="action-btn share-item-btn"
              onClick={() => window.location.href = '/share'}
            >
              📤 Share an Item
            </button>
          </div>

          <div className="request-tips">
            <h3>💡 Tips for Better Requests</h3>
            <ul>
              <li>Be specific about what you need</li>
              <li>Include your preferred location</li>
              <li>Set a reasonable urgency level</li>
              <li>Add details about condition preferences</li>
              <li>Be flexible with alternatives</li>
            </ul>
          </div>
        </div>

        <div className="requests-main">
          <div className="requests-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`requests-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
                <span className="tab-count">
                  ({tab.id === 'browse' 
                    ? requests.filter(r => r.requesterId !== user.email && r.status === 'active').length
                    : tab.id === 'my-requests'
                    ? userRequests.length
                    : requests.filter(r => r.requesterId !== user.email).length
                  })
                </span>
              </button>
            ))}
          </div>

          {activeTab === 'matches' ? (
            <RequestMatches
              requests={filteredRequests}
              items={items}
              currentUser={user}
              onOfferItem={handleOfferItem}
            />
          ) : (
            <RequestList
              requests={filteredRequests}
              currentUser={user}
              items={items}
              isOwnRequests={activeTab === 'my-requests'}
              onUpdate={handleUpdateRequest}
              onDelete={handleDeleteRequest}
              onOfferItem={handleOfferItem}
              onAcceptOffer={handleAcceptOffer}
              onSelectRequest={setSelectedRequest}
            />
          )}
        </div>
      </div>

      {showRequestForm && (
        <RequestForm
          onSubmit={handleCreateRequest}
          onCancel={() => setShowRequestForm(false)}
        />
      )}
    </div>
  );
}

export default RequestsPage;
