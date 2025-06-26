class ReviewService {
  constructor() {
    this.storageKey = 'ecoswap-reviews';
    this.reportsKey = 'ecoswap-review-reports';
    
    // Initialize storage if needed
    this.initializeStorage();
    
    // Generate sample reviews for demo
    this.generateSampleData();
  }

  initializeStorage() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.reportsKey)) {
      localStorage.setItem(this.reportsKey, JSON.stringify([]));
    }
  }

  generateSampleData() {
    const reviews = this.getStoredReviews();
    if (reviews.length === 0) {
      // Create sample reviews for demo
      const sampleReviews = [
        {
          id: 'review-1',
          itemId: 'item-1',
          itemTitle: 'Vintage Leather Armchair',
          reviewerId: 'sarah.j@email.com',
          reviewerName: 'Sarah Johnson',
          revieweeId: 'demo@ecoswap.com',
          revieweeName: 'Demo User',
          rating: 5,
          title: 'Excellent condition and great communication!',
          comment: 'The armchair was exactly as described. Demo User was very responsive and helpful throughout the process. Highly recommend!',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          helpful: 3,
          reported: false,
          verified: true
        },
        {
          id: 'review-2',
          itemId: 'item-2',
          itemTitle: 'iPhone 12 Pro',
          reviewerId: 'mike.chen.tech@gmail.com',
          reviewerName: 'Mike Chen',
          revieweeId: 'demo@ecoswap.com',
          revieweeName: 'Demo User',
          rating: 4,
          title: 'Good phone, minor wear',
          comment: 'Phone works perfectly but had a few more scratches than expected. Still a great deal though!',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          helpful: 1,
          reported: false,
          verified: true
        },
        {
          id: 'review-3',
          itemId: 'item-3',
          itemTitle: 'Kitchen Mixer',
          reviewerId: 'demo@ecoswap.com',
          reviewerName: 'Demo User',
          revieweeId: 'emily.davis.home@yahoo.com',
          revieweeName: 'Emily Davis',
          rating: 5,
          title: 'Perfect for my baking needs!',
          comment: 'Emily was wonderful to work with. The mixer is in excellent condition and works like new. Very happy with this exchange!',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          helpful: 2,
          reported: false,
          verified: true
        }
      ];

      localStorage.setItem(this.storageKey, JSON.stringify(sampleReviews));
    }
  }

  getStoredReviews() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  getStoredReports() {
    return JSON.parse(localStorage.getItem(this.reportsKey) || '[]');
  }

  async getAllReviews() {
    const reviews = this.getStoredReviews();
    return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getUserReviews(userEmail) {
    const reviews = this.getStoredReviews();
    return reviews.filter(review => 
      review.reviewerId === userEmail || review.revieweeId === userEmail
    );
  }

  async getItemReviews(itemId) {
    const reviews = this.getStoredReviews();
    return reviews.filter(review => review.itemId === itemId);
  }

  async createReview(reviewData) {
    const reviews = this.getStoredReviews();
    
    // Check if user already reviewed this item
    const existingReview = reviews.find(review => 
      review.itemId === reviewData.itemId && 
      review.reviewerId === reviewData.reviewerId
    );
    
    if (existingReview) {
      throw new Error('You have already reviewed this item');
    }

    const newReview = {
      id: `review-${Date.now()}`,
      ...reviewData,
      helpful: 0,
      reported: false,
      verified: true // In real app, this would be based on actual transaction
    };

    reviews.unshift(newReview);
    localStorage.setItem(this.storageKey, JSON.stringify(reviews));

    return newReview;
  }

  async updateReview(reviewId, updateData) {
    const reviews = this.getStoredReviews();
    const reviewIndex = reviews.findIndex(review => review.id === reviewId);
    
    if (reviewIndex === -1) {
      throw new Error('Review not found');
    }

    reviews[reviewIndex] = {
      ...reviews[reviewIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(this.storageKey, JSON.stringify(reviews));
    return reviews[reviewIndex];
  }

  async deleteReview(reviewId) {
    const reviews = this.getStoredReviews();
    const updatedReviews = reviews.filter(review => review.id !== reviewId);
    localStorage.setItem(this.storageKey, JSON.stringify(updatedReviews));
  }

  async markHelpful(reviewId, userEmail) {
    const reviews = this.getStoredReviews();
    const reviewIndex = reviews.findIndex(review => review.id === reviewId);
    
    if (reviewIndex === -1) {
      throw new Error('Review not found');
    }

    // In a real app, you'd track who marked it helpful to prevent duplicates
    reviews[reviewIndex].helpful = (reviews[reviewIndex].helpful || 0) + 1;
    
    localStorage.setItem(this.storageKey, JSON.stringify(reviews));
    return reviews[reviewIndex];
  }

  async reportReview(reviewId, reason, reporterEmail) {
    const reports = this.getStoredReports();
    
    const newReport = {
      id: `report-${Date.now()}`,
      reviewId,
      reason,
      reporterEmail,
      date: new Date().toISOString(),
      status: 'pending'
    };

    reports.push(newReport);
    localStorage.setItem(this.reportsKey, JSON.stringify(reports));

    // Mark review as reported
    const reviews = this.getStoredReviews();
    const reviewIndex = reviews.findIndex(review => review.id === reviewId);
    if (reviewIndex !== -1) {
      reviews[reviewIndex].reported = true;
      localStorage.setItem(this.storageKey, JSON.stringify(reviews));
    }

    return newReport;
  }

  async getUserRating(userEmail) {
    const reviews = this.getStoredReviews();
    const userReviews = reviews.filter(review => review.revieweeId === userEmail);
    
    if (userReviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const totalRating = userReviews.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / userReviews.length;

    return {
      average: Math.round(average * 10) / 10,
      count: userReviews.length
    };
  }

  async getReviewStats() {
    const reviews = this.getStoredReviews();
    
    const stats = {
      total: reviews.length,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      recentReviews: reviews.slice(0, 5),
      topReviewers: {},
      verifiedCount: reviews.filter(r => r.verified).length
    };

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      stats.averageRating = Math.round((totalRating / reviews.length) * 10) / 10;

      // Calculate rating distribution
      reviews.forEach(review => {
        stats.ratingDistribution[review.rating]++;
      });

      // Calculate top reviewers
      reviews.forEach(review => {
        if (!stats.topReviewers[review.reviewerId]) {
          stats.topReviewers[review.reviewerId] = {
            name: review.reviewerName,
            count: 0,
            averageRating: 0
          };
        }
        stats.topReviewers[review.reviewerId].count++;
      });
    }

    return stats;
  }

  async searchReviews(query, filters = {}) {
    const reviews = this.getStoredReviews();
    
    let filteredReviews = reviews;

    // Text search
    if (query) {
      const searchLower = query.toLowerCase();
      filteredReviews = filteredReviews.filter(review =>
        review.title.toLowerCase().includes(searchLower) ||
        review.comment.toLowerCase().includes(searchLower) ||
        review.itemTitle.toLowerCase().includes(searchLower) ||
        review.reviewerName.toLowerCase().includes(searchLower)
      );
    }

    // Rating filter
    if (filters.rating) {
      filteredReviews = filteredReviews.filter(review => review.rating === filters.rating);
    }

    // Date filter
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filteredReviews = filteredReviews.filter(review => {
        const reviewDate = new Date(review.date);
        return reviewDate >= start && reviewDate <= end;
      });
    }

    // Verified filter
    if (filters.verifiedOnly) {
      filteredReviews = filteredReviews.filter(review => review.verified);
    }

    return filteredReviews;
  }

  async getReviewsByItem(itemId) {
    const reviews = this.getStoredReviews();
    return reviews.filter(review => review.itemId === itemId);
  }

  async canUserReview(userEmail, itemId) {
    const reviews = this.getStoredReviews();
    const existingReview = reviews.find(review => 
      review.itemId === itemId && 
      review.reviewerId === userEmail
    );
    
    return !existingReview;
  }
}

export default ReviewService;
