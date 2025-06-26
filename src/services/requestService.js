class RequestService {
  constructor() {
    this.storageKey = 'ecoswap-requests';
    this.offersKey = 'ecoswap-offers';
    
    // Initialize storage if needed
    this.initializeStorage();
    
    // Generate sample requests for demo
    this.generateSampleData();
  }

  initializeStorage() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.offersKey)) {
      localStorage.setItem(this.offersKey, JSON.stringify([]));
    }
  }

  generateSampleData() {
    const requests = this.getStoredRequests();
    if (requests.length === 0) {
      // Create sample requests for demo
      const sampleRequests = [
        {
          id: 'req-1',
          title: 'Looking for a Desk Lamp',
          description: 'Need a good desk lamp for my home office. Preferably LED with adjustable brightness. Any color is fine.',
          category: 'household',
          urgency: 'medium',
          location: 'Seattle, WA',
          requesterId: 'sarah.j@email.com',
          requesterName: 'Sarah Johnson',
          status: 'active',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
          offers: [],
          tags: ['desk', 'lamp', 'LED', 'office'],
          condition: 'any',
          maxDistance: 15
        },
        {
          id: 'req-2',
          title: 'Winter Coat - Size Medium',
          description: 'Looking for a warm winter coat in size medium. My old one got damaged and winter is coming. Any style or color works.',
          category: 'clothing',
          urgency: 'high',
          location: 'Portland, OR',
          requesterId: 'mike.chen.tech@gmail.com',
          requesterName: 'Mike Chen',
          status: 'active',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
          offers: [
            {
              id: 'offer-1',
              itemId: 'item-1',
              offererId: 'demo@ecoswap.com',
              offererName: 'Demo User',
              message: 'I have a navy blue winter coat in medium that might work for you!',
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'pending'
            }
          ],
          tags: ['coat', 'winter', 'medium', 'clothing'],
          condition: 'good',
          maxDistance: 25
        },
        {
          id: 'req-3',
          title: 'Children\'s Books for Ages 5-8',
          description: 'Looking for children\'s books for my daughter who is learning to read. Picture books or early chapter books would be perfect.',
          category: 'other',
          urgency: 'low',
          location: 'San Francisco, CA',
          requesterId: 'emily.davis.home@yahoo.com',
          requesterName: 'Emily Davis',
          status: 'active',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
          offers: [],
          tags: ['books', 'children', 'reading', 'education'],
          condition: 'any',
          maxDistance: 20
        }
      ];

      localStorage.setItem(this.storageKey, JSON.stringify(sampleRequests));
    }
  }

  getStoredRequests() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  getStoredOffers() {
    return JSON.parse(localStorage.getItem(this.offersKey) || '[]');
  }

  async getAllRequests() {
    const requests = this.getStoredRequests();
    return requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getUserRequests(userEmail) {
    const requests = this.getStoredRequests();
    return requests.filter(request => request.requesterId === userEmail);
  }

  async createRequest(requestData) {
    const requests = this.getStoredRequests();
    
    const newRequest = {
      id: `req-${Date.now()}`,
      ...requestData,
      offers: [],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    };

    requests.unshift(newRequest);
    localStorage.setItem(this.storageKey, JSON.stringify(requests));

    return newRequest;
  }

  async updateRequest(requestId, updateData) {
    const requests = this.getStoredRequests();
    const requestIndex = requests.findIndex(request => request.id === requestId);
    
    if (requestIndex === -1) {
      throw new Error('Request not found');
    }

    requests[requestIndex] = {
      ...requests[requestIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(this.storageKey, JSON.stringify(requests));
    return requests[requestIndex];
  }

  async deleteRequest(requestId) {
    const requests = this.getStoredRequests();
    const updatedRequests = requests.filter(request => request.id !== requestId);
    localStorage.setItem(this.storageKey, JSON.stringify(updatedRequests));
  }

  async offerItem(requestId, itemId, offererId, message) {
    const requests = this.getStoredRequests();
    const requestIndex = requests.findIndex(request => request.id === requestId);
    
    if (requestIndex === -1) {
      throw new Error('Request not found');
    }

    const newOffer = {
      id: `offer-${Date.now()}`,
      itemId,
      offererId,
      offererName: offererId.split('@')[0], // Simplified name
      message,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    if (!requests[requestIndex].offers) {
      requests[requestIndex].offers = [];
    }

    requests[requestIndex].offers.push(newOffer);
    localStorage.setItem(this.storageKey, JSON.stringify(requests));

    return newOffer;
  }

  async acceptOffer(requestId, offerId) {
    const requests = this.getStoredRequests();
    const requestIndex = requests.findIndex(request => request.id === requestId);
    
    if (requestIndex === -1) {
      throw new Error('Request not found');
    }

    const request = requests[requestIndex];
    const offerIndex = request.offers.findIndex(offer => offer.id === offerId);
    
    if (offerIndex === -1) {
      throw new Error('Offer not found');
    }

    // Mark the accepted offer
    request.offers[offerIndex].status = 'accepted';
    request.offers[offerIndex].acceptedAt = new Date().toISOString();

    // Mark other offers as declined
    request.offers.forEach((offer, index) => {
      if (index !== offerIndex && offer.status === 'pending') {
        offer.status = 'declined';
      }
    });

    // Update request status
    request.status = 'fulfilled';
    request.fulfilledAt = new Date().toISOString();

    localStorage.setItem(this.storageKey, JSON.stringify(requests));
    return request;
  }

  async declineOffer(requestId, offerId) {
    const requests = this.getStoredRequests();
    const requestIndex = requests.findIndex(request => request.id === requestId);
    
    if (requestIndex === -1) {
      throw new Error('Request not found');
    }

    const request = requests[requestIndex];
    const offerIndex = request.offers.findIndex(offer => offer.id === offerId);
    
    if (offerIndex === -1) {
      throw new Error('Offer not found');
    }

    request.offers[offerIndex].status = 'declined';
    request.offers[offerIndex].declinedAt = new Date().toISOString();

    localStorage.setItem(this.storageKey, JSON.stringify(requests));
    return request;
  }

  async searchRequests(query, filters = {}) {
    const requests = this.getStoredRequests();
    
    let filteredRequests = requests.filter(request => request.status === 'active');

    // Text search
    if (query) {
      const searchLower = query.toLowerCase();
      filteredRequests = filteredRequests.filter(request =>
        request.title.toLowerCase().includes(searchLower) ||
        request.description.toLowerCase().includes(searchLower) ||
        request.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filteredRequests = filteredRequests.filter(request => request.category === filters.category);
    }

    // Urgency filter
    if (filters.urgency) {
      filteredRequests = filteredRequests.filter(request => request.urgency === filters.urgency);
    }

    // Location filter (simplified - in real app would use geolocation)
    if (filters.location) {
      filteredRequests = filteredRequests.filter(request => 
        request.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    return filteredRequests;
  }

  async getMatchingItems(requestId, availableItems) {
    const requests = this.getStoredRequests();
    const request = requests.find(req => req.id === requestId);
    
    if (!request) {
      return [];
    }

    // Simple matching algorithm based on category and keywords
    const matches = availableItems.filter(item => {
      // Category match
      if (item.category === request.category) {
        return true;
      }

      // Keyword matching
      const requestKeywords = [
        ...request.title.toLowerCase().split(' '),
        ...request.description.toLowerCase().split(' '),
        ...request.tags
      ];

      const itemKeywords = [
        ...item.title.toLowerCase().split(' '),
        ...item.description.toLowerCase().split(' ')
      ];

      const commonKeywords = requestKeywords.filter(keyword => 
        itemKeywords.some(itemKeyword => 
          itemKeyword.includes(keyword) || keyword.includes(itemKeyword)
        )
      );

      return commonKeywords.length > 0;
    });

    return matches;
  }

  async getRequestStats() {
    const requests = this.getStoredRequests();
    
    const stats = {
      total: requests.length,
      active: requests.filter(r => r.status === 'active').length,
      fulfilled: requests.filter(r => r.status === 'fulfilled').length,
      expired: requests.filter(r => new Date(r.expiresAt) < new Date()).length,
      totalOffers: requests.reduce((sum, r) => sum + (r.offers?.length || 0), 0),
      categoryBreakdown: {},
      urgencyBreakdown: { low: 0, medium: 0, high: 0 }
    };

    // Calculate category breakdown
    requests.forEach(request => {
      stats.categoryBreakdown[request.category] = (stats.categoryBreakdown[request.category] || 0) + 1;
    });

    // Calculate urgency breakdown
    requests.forEach(request => {
      stats.urgencyBreakdown[request.urgency]++;
    });

    return stats;
  }

  async markRequestAsExpired(requestId) {
    return this.updateRequest(requestId, { 
      status: 'expired',
      expiredAt: new Date().toISOString()
    });
  }

  async extendRequest(requestId, additionalDays = 30) {
    const requests = this.getStoredRequests();
    const request = requests.find(r => r.id === requestId);
    
    if (!request) {
      throw new Error('Request not found');
    }

    const newExpiryDate = new Date(request.expiresAt);
    newExpiryDate.setDate(newExpiryDate.getDate() + additionalDays);

    return this.updateRequest(requestId, {
      expiresAt: newExpiryDate.toISOString(),
      extendedAt: new Date().toISOString()
    });
  }
}

export default RequestService;
